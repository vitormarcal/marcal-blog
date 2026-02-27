<script setup lang="ts">
import type { MediaPulseMovieDetailsResponse } from '~/types/media-pulse-movies'

definePageMeta({
  documentDriven: false
})

const route = useRoute()
const { apiUrl, assetUrl } = useMediaPulseApi()

const slugParam = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const movieSlug = String(slugParam || '').trim()

if (!movieSlug) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Filme não encontrado'
  })
}

const { data: movie, pending, error } = useAsyncData(
  `movie-details-${movieSlug}`,
  () => $fetch<MediaPulseMovieDetailsResponse>(apiUrl(`/api/movies/slug/${encodeURIComponent(movieSlug)}`)),
  {
    server: false
  }
)

const extractStatusCode = (value: unknown) => {
  const raw = value as any
  const candidates = [
    raw?.statusCode,
    raw?.status,
    raw?.response?.status,
    raw?.data?.statusCode
  ]

  for (const candidate of candidates) {
    const parsed = Number(candidate)
    if (Number.isInteger(parsed) && parsed > 0) return parsed
  }
  return null
}

watch(error, (value) => {
  if (!value) return
  if (extractStatusCode(value) !== 404) return

  showError(createError({
    statusCode: 404,
    statusMessage: 'Filme não encontrado'
  }))
}, { immediate: true })

watch(movie, async (value) => {
  if (!value?.slug) return

  const routeSlug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
  if (routeSlug !== value.slug) {
    await navigateTo(`/filmes/${value.slug}`, { redirectCode: 301, replace: true })
  }
}, { immediate: true })

const pageTitle = computed(() => {
  if (!movie.value) return 'Filme'
  if (movie.value.year) return `${movie.value.title} (${movie.value.year}) | Filmes`
  return `${movie.value.title} | Filmes`
})

const pageDescription = computed(() => {
  if (!movie.value) return 'Detalhes do filme.'
  return movie.value.description?.trim() || `Detalhes de ${movie.value.title}.`
})

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageDescription,
  ogDescription: pageDescription
})

const coverSrc = computed(() => {
  if (!movie.value?.coverUrl) return ''
  return assetUrl(movie.value.coverUrl)
})

const titleLabel = computed(() => {
  if (!movie.value) return 'Filme'
  if (movie.value.year) return `${movie.value.title} (${movie.value.year})`
  return movie.value.title
})

const originalTitleLabel = computed(() => {
  if (!movie.value?.originalTitle?.trim()) return ''
  if (movie.value.originalTitle.trim().toLowerCase() === movie.value.title.trim().toLowerCase()) return ''
  return movie.value.originalTitle
})

const descriptionParagraphs = computed(() => {
  const raw = movie.value?.description?.trim()
  if (!raw) return []

  return raw
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
})

const movieImages = computed(() => {
  const images = movie.value?.images || []
  return images.filter((image) => image.url?.trim())
})

const sortedWatches = computed(() => {
  const watches = movie.value?.watches || []
  return [...watches].sort((a, b) => {
    const aDate = new Date(a.watchedAt).getTime()
    const bDate = new Date(b.watchedAt).getTime()
    return bDate - aDate
  })
})

const formatDateTime = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const sourceLabel = (source: string) => {
  const normalized = source.trim().toUpperCase()
  if (normalized === 'PLEX') return 'Plex'
  return source
}

const externalProviderLabel = (provider: string) => {
  const normalized = provider.trim().toUpperCase()
  if (normalized === 'IMDB') return 'IMDb'
  if (normalized === 'TMDB') return 'TMDB'
  return provider
}
</script>

<template>
  <section class="main-section">
    <main>
      <article class="post-section movie-page">
        <div class="movie-page__hero">
          <p class="movie-page__kicker">Filme</p>
          <h1>{{ titleLabel }}</h1>
          <p v-if="originalTitleLabel" class="movie-page__original-title">
            {{ originalTitleLabel }}
          </p>
        </div>

        <div v-if="pending" class="movie-page__state" aria-busy="true">
          Carregando detalhes do filme...
        </div>

        <div v-else-if="error" class="movie-page__state movie-page__state--error">
          Não foi possível carregar este filme agora. Tente novamente em instantes.
        </div>

        <template v-else-if="movie">
          <section class="movie-page__summary">
            <ExpandableImage
              v-if="coverSrc"
              :src="coverSrc"
              :alt="`Pôster de ${movie.title}`"
              :expand-label="`Expandir pôster de ${movie.title}`"
              thumb-width="220px"
              thumb-height="330px"
              thumb-radius="14px"
              max-lightbox-width="1200px"
            />
            <div v-else class="movie-page__poster-placeholder" aria-hidden="true">
              sem pôster
            </div>

            <dl class="movie-meta">
              <div>
                <dt>Título</dt>
                <dd>{{ movie.title }}</dd>
              </div>
              <div v-if="movie.year">
                <dt>Ano</dt>
                <dd>{{ movie.year }}</dd>
              </div>
              <div v-if="movie.watches.length">
                <dt>Sessões registradas</dt>
                <dd>{{ movie.watches.length }}</dd>
              </div>
              <div v-if="sortedWatches[0]?.watchedAt">
                <dt>Última sessão</dt>
                <dd>{{ formatDateTime(sortedWatches[0].watchedAt) }}</dd>
              </div>
            </dl>
          </section>

          <section class="movie-page__section">
            <h2>Sinopse</h2>
            <div v-if="descriptionParagraphs.length" class="movie-description">
              <p
                v-for="(paragraph, index) in descriptionParagraphs"
                :key="`${index}-${paragraph.slice(0, 18)}`"
              >
                {{ paragraph }}
              </p>
            </div>
            <p v-else class="movie-page__empty">Sem sinopse registrada para este filme.</p>
          </section>

          <section class="movie-page__section">
            <h2>Galeria</h2>
            <ul v-if="movieImages.length" class="movie-gallery">
              <li v-for="image in movieImages" :key="image.id" class="movie-gallery__item">
                <ExpandableImage
                  :src="assetUrl(image.url)"
                  :alt="`Imagem de ${movie.title}`"
                  :expand-label="`Expandir imagem de ${movie.title}`"
                  gallery="movie-detail-gallery"
                  thumb-width="100%"
                  thumb-height="100%"
                  thumb-fit="cover"
                  thumb-radius="10px"
                  trigger-width="100%"
                  trigger-height="100%"
                  max-lightbox-width="1200px"
                />
                <span v-if="image.isPrimary" class="movie-gallery__badge">principal</span>
              </li>
            </ul>
            <p v-else class="movie-page__empty">Sem imagens extras para este filme.</p>
          </section>

          <section class="movie-page__section">
            <h2>Histórico de sessões</h2>
            <ul v-if="sortedWatches.length" class="movie-list">
              <li v-for="watchItem in sortedWatches" :key="watchItem.watchId" class="movie-list__item">
                <strong>{{ formatDateTime(watchItem.watchedAt) }}</strong>
                <span>Fonte: {{ sourceLabel(watchItem.source) }}</span>
              </li>
            </ul>
            <p v-else class="movie-page__empty">Sem histórico de sessões para este filme.</p>
          </section>

          <section class="movie-page__section">
            <h2>IDs externos</h2>
            <ul v-if="movie.externalIds.length" class="movie-list">
              <li
                v-for="externalId in movie.externalIds"
                :key="`${externalId.provider}-${externalId.externalId}`"
                class="movie-list__item"
              >
                <strong>{{ externalProviderLabel(externalId.provider) }}</strong>
                <span>{{ externalId.externalId }}</span>
              </li>
            </ul>
            <p v-else class="movie-page__empty">Sem IDs externos cadastrados.</p>
          </section>
        </template>
      </article>
    </main>
  </section>
</template>

<style scoped>
.movie-page {
  row-gap: 2rem;
}

.movie-page > * {
  grid-column: 3 / span 8;
}

@media (max-width: 767px) {
  .movie-page > * {
    grid-column: 1 / span 12;
  }
}

.movie-page__hero {
  display: grid;
  gap: 0.7rem;
  padding: clamp(1.1rem, 0.9rem + 0.8vw, 1.7rem);
  border-radius: 18px;
  border: 1px solid rgba(245, 195, 106, 0.24);
  background:
    radial-gradient(circle at 12% 0%, rgba(245, 195, 106, 0.2), transparent 42%),
    radial-gradient(circle at 100% 100%, rgba(127, 29, 29, 0.25), transparent 50%),
    linear-gradient(145deg, rgba(22, 11, 10, 0.84), rgba(13, 8, 9, 0.9));
}

.movie-page__kicker {
  margin: 0;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(245, 195, 106, 0.88);
}

.movie-page__hero h1 {
  margin: 0 !important;
}

.movie-page__original-title {
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  font-style: italic;
}

.movie-page__state {
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
}

.movie-page__state--error {
  color: #fecaca;
  border-color: rgba(190, 24, 93, 0.42);
  background: rgba(127, 29, 29, 0.22);
}

.movie-page__summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.3rem;
  align-items: start;
}

@media (max-width: 900px) {
  .movie-page__summary {
    grid-template-columns: 1fr;
  }
}

.movie-page__poster-placeholder {
  width: 220px;
  height: 330px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  text-transform: uppercase;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.08);
}

.movie-meta {
  display: grid;
  gap: 0.8rem;
  margin: 0;
}

.movie-meta dt {
  font-size: 0.86rem;
  color: rgba(255, 255, 255, 0.6);
}

.movie-meta dd {
  margin: 0.2rem 0 0;
}

.movie-page__section {
  display: grid;
  gap: 0.75rem;
}

.movie-page__section h2 {
  margin: 0 !important;
  font-size: 1.42rem;
}

.movie-page__empty {
  color: rgba(255, 255, 255, 0.7);
}

.movie-description {
  display: grid;
  gap: 0.7rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
  padding: 0.95rem 1rem;
}

.movie-description p {
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.65;
}

.movie-gallery {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.8rem;
}

.movie-gallery__item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.movie-gallery__badge {
  position: absolute;
  top: 0.55rem;
  right: 0.55rem;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  font-size: 0.7rem;
  color: rgba(255, 241, 217, 0.96);
  border: 1px solid rgba(245, 195, 106, 0.42);
  background: rgba(30, 13, 10, 0.68);
  pointer-events: none;
}

.movie-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.movie-list__item {
  display: grid;
  gap: 0.2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.85rem 0.95rem;
}

.movie-list__item span {
  color: rgba(255, 255, 255, 0.76);
}
</style>
