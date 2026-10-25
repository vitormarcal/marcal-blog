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
    await navigateTo(`/filmes/detalhe/${value.slug}`, { redirectCode: 301, replace: true })
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

const movieTerms = computed(() => (movie.value?.terms || []).filter((term) => term.active))
const movieDirectors = computed(() => (movie.value?.people || []).filter((person) => person.department?.toLowerCase() === 'directing' || person.job?.toLowerCase() === 'director'))
const movieCast = computed(() => (movie.value?.people || []).filter((person) => person.creditType === 'CAST').slice(0, 8))
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
          <div v-if="movie?.favorite || movie?.abandoned" class="movie-page__marks">
            <span v-if="movie.favorite">Favorito</span><span v-if="movie.abandoned">Abandonado</span>
          </div>
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
              <div v-if="movie.rating">
                <dt>Minha nota</dt>
                <dd class="movie-page__rating">{{ movie.rating.rating.toLocaleString('pt-BR') }} <span>★</span></dd>
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
                <span>{{ sourceLabel(watchItem.source) }}</span>
              </li>
            </ul>
            <p v-else class="movie-page__empty">Sem histórico de sessões para este filme.</p>
          </section>

          <section v-if="movie.collection" class="movie-page__section movie-page__collection">
            <h2>Na mesma coleção</h2>
            <div class="movie-page__collection-head">
              <img v-if="movie.collection.posterUrl" :src="assetUrl(movie.collection.posterUrl)" :alt="`Pôster da coleção ${movie.collection.name}`" loading="lazy" />
              <div><p class="movie-page__kicker">Coleção</p><h3>{{ movie.collection.name }}</h3><p>{{ movie.collection.movies.length }} filmes catalogados</p></div>
            </div>
            <div class="movie-page__related">
              <NuxtLink v-for="related in movie.collection.movies.filter((item) => item.slug && item.movieId !== movie.movieId)" :key="related.movieId" :to="`/filmes/detalhe/${related.slug}`">
                <img v-if="related.coverUrl" :src="assetUrl(related.coverUrl)" :alt="`Pôster de ${related.title}`" loading="lazy" /><span>{{ related.title }}<small>{{ related.watched ? 'Já assisti' : 'Na fila' }}</small></span>
              </NuxtLink>
            </div>
          </section>

          <section v-if="movieDirectors.length || movieCast.length" class="movie-page__section">
            <h2>Quem fez o filme</h2>
            <p v-if="movieDirectors.length" class="movie-page__credits"><strong>Direção</strong> {{ movieDirectors.map((person) => person.name).join(' · ') }}</p>
            <div v-if="movieCast.length" class="movie-page__people">
              <article v-for="person in movieCast" :key="person.personId"><img v-if="person.profileUrl" :src="person.profileUrl" :alt="person.name" loading="lazy" /><span><strong>{{ person.name }}</strong><small v-if="person.characterName">{{ person.characterName }}</small></span></article>
            </div>
          </section>

          <section v-if="movieTerms.length" class="movie-page__section">
            <h2>Gêneros e temas</h2>
            <div class="movie-page__terms"><span v-for="term in movieTerms" :key="term.id">{{ term.name }}</span></div>
          </section>

          <section v-if="movie.lists?.length" class="movie-page__section">
            <h2>Em listas</h2>
            <div class="movie-page__terms"><span v-for="list in movie.lists" :key="list.listId">{{ list.name }}</span></div>
          </section>

          <section v-if="movie.companies?.length" class="movie-page__section">
            <h2>Produção</h2>
            <div class="movie-page__companies"><span v-for="company in movie.companies" :key="company.companyId"><img v-if="company.logoUrl" :src="company.logoUrl" :alt="company.name" loading="lazy" /><strong>{{ company.name }}</strong></span></div>
          </section>

          <section v-if="movie.comments?.length" class="movie-page__section movie-page__comments">
            <h2>Anotação</h2>
            <blockquote v-for="comment in movie.comments" :key="comment.id"><p>{{ comment.body }}</p><footer>{{ formatDateTime(comment.commentedAt) }}</footer></blockquote>
          </section>
        </template>
      </article>
    </main>
  </section>
</template>

<style scoped src="~/assets/css/media/catalog-detail.css"></style>
