<script setup lang="ts">
import type {
  MediaPulseShowDetailsResponse,
  MediaPulseShowProgress,
  MediaPulseShowSeason
} from '~/types/media-pulse-shows'

definePageMeta({
  documentDriven: false
})

const route = useRoute()
const { apiUrl, assetUrl } = useMediaPulseApi()

const slugParam = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const showSlug = String(slugParam || '').trim()

if (!showSlug) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Série não encontrada'
  })
}

const { data: show, pending, error } = useAsyncData(
  `show-details-${showSlug}`,
  () => $fetch<MediaPulseShowDetailsResponse>(apiUrl(`/api/shows/slug/${encodeURIComponent(showSlug)}`)),
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
    statusMessage: 'Série não encontrada'
  }))
}, { immediate: true })

watch(show, async (value) => {
  if (!value?.slug) return

  const routeSlug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
  if (routeSlug !== value.slug) {
    await navigateTo(`/series/detalhe/${value.slug}`, { redirectCode: 301, replace: true })
  }
}, { immediate: true })

const pageTitle = computed(() => {
  if (!show.value) return 'Série'
  if (show.value.year) return `${show.value.title} (${show.value.year}) | Séries`
  return `${show.value.title} | Séries`
})

const pageDescription = computed(() => {
  if (!show.value) return 'Detalhes da série.'
  return show.value.description?.trim() || `Detalhes de ${show.value.title}.`
})

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageDescription,
  ogDescription: pageDescription
})

const coverSrc = computed(() => {
  if (!show.value?.coverUrl) return ''
  return assetUrl(show.value.coverUrl)
})

const titleLabel = computed(() => {
  if (!show.value) return 'Série'
  if (show.value.year) return `${show.value.title} (${show.value.year})`
  return show.value.title
})

const progressStatus = computed(() => {
  const progress = showProgress.value
  if (!progress) return null
  if (progress.completed) return { label: 'Completa', tone: 'complete' } as const
  if (progress.inProgress) return { label: 'Em andamento', tone: 'progress' } as const
  return { label: 'Não iniciada', tone: 'idle' } as const
})

const originalTitleLabel = computed(() => {
  if (!show.value?.originalTitle?.trim()) return ''
  if (show.value.originalTitle.trim().toLowerCase() === show.value.title.trim().toLowerCase()) return ''
  return show.value.originalTitle
})

const descriptionParagraphs = computed(() => {
  const raw = show.value?.description?.trim()
  if (!raw) return []

  return raw
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
})

const showImages = computed(() => {
  const images = show.value?.images || []
  return images.filter((image) => image.url?.trim())
})

const showProgress = computed(() => show.value?.progress || null)
const showSeasons = computed(() => show.value?.seasons || [])

const sortedWatches = computed(() => {
  const watches = show.value?.watches || []
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
  if (normalized === 'TVDB') return 'TVDB'
  return provider
}

const progressPercent = (progress?: MediaPulseShowProgress | null) => {
  if (!progress?.episodesCount) return 0
  return Math.max(0, Math.min(100, (progress.watchedEpisodesCount / progress.episodesCount) * 100))
}

const progressSummary = (progress?: MediaPulseShowProgress | null) => {
  if (!progress) return ''
  const percent = progressPercent(progress)
  return `${progress.watchedEpisodesCount} de ${progress.episodesCount} episódios vistos (${percent.toFixed(1)}%)`
}

const seasonLabel = (season: MediaPulseShowSeason) => {
  if (season.seasonTitle?.trim()) return season.seasonTitle.trim()
  if (Number.isInteger(season.seasonNumber)) return `Temporada ${season.seasonNumber}`
  return 'Temporada especial'
}

const seasonStatus = (season: MediaPulseShowSeason) => {
  if (season.completed) return { label: 'Completa', tone: 'complete' } as const
  if (season.watchedEpisodesCount > 0) return { label: 'Em andamento', tone: 'progress' } as const
  return { label: 'Sem episódios vistos', tone: 'idle' } as const
}

const seasonProgressSummary = (season: MediaPulseShowSeason) => {
  if (!season.episodesCount) return 'Sem episódios catalogados'
  return `${season.watchedEpisodesCount} de ${season.episodesCount} episódios vistos`
}

const seasonProgressPercent = (season: MediaPulseShowSeason) => {
  if (!season.episodesCount) return 0
  return Math.max(0, Math.min(100, (season.watchedEpisodesCount / season.episodesCount) * 100))
}

const episodeLabel = (watchItem: MediaPulseShowDetailsResponse['watches'][number]) => {
  const parts = []

  if (Number.isInteger(watchItem.seasonNumber) && Number.isInteger(watchItem.episodeNumber)) {
    parts.push(`T${String(watchItem.seasonNumber).padStart(2, '0')}E${String(watchItem.episodeNumber).padStart(2, '0')}`)
  } else if (Number.isInteger(watchItem.seasonNumber)) {
    parts.push(`Temporada ${watchItem.seasonNumber}`)
  }

  if (watchItem.episodeTitle?.trim()) {
    parts.push(watchItem.episodeTitle.trim())
  }

  return parts.join(' · ')
}
</script>

<template>
  <section class="main-section">
    <main>
      <article class="post-section show-page">
        <div class="show-page__hero">
          <p class="show-page__kicker">Série</p>
          <h1>{{ titleLabel }}</h1>
          <p v-if="originalTitleLabel" class="show-page__original-title">
            {{ originalTitleLabel }}
          </p>
        </div>

        <div v-if="pending" class="show-page__state" aria-busy="true">
          Carregando detalhes da série...
        </div>

        <div v-else-if="error" class="show-page__state show-page__state--error">
          Não foi possível carregar esta série agora. Tente novamente em instantes.
        </div>

        <template v-else-if="show">
          <section class="show-page__summary">
            <ExpandableImage
              v-if="coverSrc"
              :src="coverSrc"
              :alt="`Capa de ${show.title}`"
              :expand-label="`Expandir capa de ${show.title}`"
              thumb-width="220px"
              thumb-height="330px"
              thumb-radius="14px"
              max-lightbox-width="1200px"
            />
            <div v-else class="show-page__poster-placeholder" aria-hidden="true">
              sem capa
            </div>

            <dl class="show-meta">
              <div>
                <dt>Título</dt>
                <dd>{{ show.title }}</dd>
              </div>
              <div v-if="progressStatus">
                <dt>Status</dt>
                <dd>
                  <span :class="['show-status-pill', `show-status-pill--${progressStatus.tone}`]">
                    {{ progressStatus.label }}
                  </span>
                </dd>
              </div>
              <div v-if="show.year">
                <dt>Ano</dt>
                <dd>{{ show.year }}</dd>
              </div>
              <div v-if="show.watches.length">
                <dt>Episódios registrados</dt>
                <dd>{{ show.watches.length }}</dd>
              </div>
              <div v-if="showProgress">
                <dt>Progresso geral</dt>
                <dd>{{ progressSummary(showProgress) }}</dd>
              </div>
              <div v-if="sortedWatches[0]?.watchedAt">
                <dt>Último play</dt>
                <dd>{{ formatDateTime(sortedWatches[0].watchedAt) }}</dd>
              </div>
            </dl>
          </section>

          <section v-if="showProgress" class="show-page__section">
            <h2>Progresso da série</h2>
            <div class="show-progress-card">
              <div class="show-progress-card__head">
                <div>
                  <strong>{{ progressStatus?.label || 'Sem status' }}</strong>
                  <p>{{ progressSummary(showProgress) }}</p>
                </div>
                <span class="show-progress-card__ratio">{{ progressPercent(showProgress).toFixed(1) }}%</span>
              </div>

              <div class="show-progress-bar" aria-hidden="true">
                <span class="show-progress-bar__fill" :style="{ width: `${progressPercent(showProgress)}%` }" />
              </div>

              <ul class="show-progress-stats">
                <li>
                  <span>Episódios</span>
                  <strong>{{ showProgress.episodesCount }}</strong>
                </li>
                <li>
                  <span>Assistidos</span>
                  <strong>{{ showProgress.watchedEpisodesCount }}</strong>
                </li>
                <li>
                  <span>Temporadas</span>
                  <strong>{{ showProgress.seasonsCount }}</strong>
                </li>
                <li>
                  <span>Temporadas completas</span>
                  <strong>{{ showProgress.completedSeasonsCount }}</strong>
                </li>
              </ul>
            </div>
          </section>

          <section class="show-page__section">
            <h2>Temporadas</h2>
            <ul v-if="showSeasons.length" class="show-list">
              <li
                v-for="season in showSeasons"
                :key="`${season.seasonNumber ?? 'special'}-${season.seasonTitle || ''}`"
                class="show-list__item show-list__item--season"
              >
                <div class="show-season__head">
                  <div>
                    <strong>{{ seasonLabel(season) }}</strong>
                    <span>{{ seasonProgressSummary(season) }}</span>
                  </div>
                  <span :class="['show-status-pill', `show-status-pill--${seasonStatus(season).tone}`]">
                    {{ seasonStatus(season).label }}
                  </span>
                </div>

                <div class="show-progress-bar" aria-hidden="true">
                  <span class="show-progress-bar__fill" :style="{ width: `${seasonProgressPercent(season)}%` }" />
                </div>

                <div class="show-season__meta">
                  <span>{{ seasonProgressPercent(season).toFixed(1) }}%</span>
                  <span v-if="season.lastWatchedAt">Último play: {{ formatDateTime(season.lastWatchedAt) }}</span>
                </div>
              </li>
            </ul>
            <p v-else class="show-page__empty">Sem temporadas catalogadas para esta série.</p>
          </section>

          <section class="show-page__section">
            <h2>Sinopse</h2>
            <div v-if="descriptionParagraphs.length" class="show-description">
              <p
                v-for="(paragraph, index) in descriptionParagraphs"
                :key="`${index}-${paragraph.slice(0, 18)}`"
              >
                {{ paragraph }}
              </p>
            </div>
            <p v-else class="show-page__empty">Sem sinopse registrada para esta série.</p>
          </section>

          <section class="show-page__section">
            <h2>Galeria</h2>
            <ul v-if="showImages.length" class="show-gallery">
              <li v-for="image in showImages" :key="image.id" class="show-gallery__item">
                <ExpandableImage
                  :src="assetUrl(image.url)"
                  :alt="`Imagem de ${show.title}`"
                  :expand-label="`Expandir imagem de ${show.title}`"
                  gallery="show-detail-gallery"
                  thumb-width="100%"
                  thumb-height="100%"
                  thumb-fit="cover"
                  thumb-radius="10px"
                  trigger-width="100%"
                  trigger-height="100%"
                  max-lightbox-width="1200px"
                />
                <span v-if="image.isPrimary" class="show-gallery__badge">principal</span>
              </li>
            </ul>
            <p v-else class="show-page__empty">Sem imagens extras para esta série.</p>
          </section>

          <section class="show-page__section">
            <h2>Histórico de episódios</h2>
            <ul v-if="sortedWatches.length" class="show-list">
              <li v-for="watchItem in sortedWatches" :key="watchItem.watchId" class="show-list__item">
                <strong>{{ formatDateTime(watchItem.watchedAt) }}</strong>
                <span v-if="episodeLabel(watchItem)">{{ episodeLabel(watchItem) }}</span>
                <span>Fonte: {{ sourceLabel(watchItem.source) }}</span>
              </li>
            </ul>
            <p v-else class="show-page__empty">Sem histórico de episódios para esta série.</p>
          </section>

          <section class="show-page__section">
            <h2>IDs externos</h2>
            <ul v-if="show.externalIds.length" class="show-list">
              <li
                v-for="externalId in show.externalIds"
                :key="`${externalId.provider}-${externalId.externalId}`"
                class="show-list__item"
              >
                <strong>{{ externalProviderLabel(externalId.provider) }}</strong>
                <span>{{ externalId.externalId }}</span>
              </li>
            </ul>
            <p v-else class="show-page__empty">Sem IDs externos cadastrados.</p>
          </section>
        </template>
      </article>
    </main>
  </section>
</template>

<style scoped>
.show-page {
  row-gap: 2rem;
}

.show-page > * {
  grid-column: 3 / span 8;
}

@media (max-width: 767px) {
  .show-page > * {
    grid-column: 1 / span 12;
  }
}

.show-page__hero {
  display: grid;
  gap: 0.7rem;
  padding: clamp(1.1rem, 0.9rem + 0.8vw, 1.7rem);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
}

.show-page__kicker {
  margin: 0;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.6);
}

.show-page__hero h1 {
  margin: 0 !important;
}

.show-page__original-title {
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  font-style: italic;
}

.show-page__state {
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
}

.show-page__state--error {
  color: #fecaca;
  border-color: rgba(155, 28, 28, 0.45);
  background: rgba(155, 28, 28, 0.25);
}

.show-page__summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.3rem;
  align-items: start;
}

@media (max-width: 900px) {
  .show-page__summary {
    grid-template-columns: 1fr;
  }
}

.show-page__poster-placeholder {
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

.show-meta {
  display: grid;
  gap: 0.8rem;
  margin: 0;
}

.show-meta dt {
  font-size: 0.86rem;
  color: rgba(255, 255, 255, 0.6);
}

.show-meta dd {
  margin: 0.2rem 0 0;
}

.show-status-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.24rem 0.68rem;
  font-size: 0.78rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.show-status-pill--complete {
  color: #d9f99d;
  border-color: rgba(163, 230, 53, 0.5);
  background: rgba(101, 163, 13, 0.18);
}

.show-status-pill--progress {
  color: #fde68a;
  border-color: rgba(251, 191, 36, 0.42);
  background: rgba(217, 119, 6, 0.18);
}

.show-status-pill--idle {
  color: rgba(255, 255, 255, 0.82);
  border-color: rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
}

.show-page__section {
  display: grid;
  gap: 0.75rem;
}

.show-page__section h2 {
  margin: 0 !important;
  font-size: 1.42rem;
}

.show-page__empty {
  color: rgba(255, 255, 255, 0.7);
}

.show-description {
  display: grid;
  gap: 0.7rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
  padding: 0.95rem 1rem;
}

.show-description p {
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.65;
}

.show-progress-card {
  display: grid;
  gap: 0.95rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
}

.show-progress-card__head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.show-progress-card__head p {
  margin: 0.35rem 0 0;
  color: rgba(255, 255, 255, 0.74);
}

.show-progress-card__ratio {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--font-color);
}

.show-progress-bar {
  width: 100%;
  height: 0.7rem;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.show-progress-bar__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(141, 181, 0, 0.55), rgba(141, 181, 0, 0.95));
}

.show-progress-stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.8rem;
}

.show-progress-stats li {
  display: grid;
  gap: 0.25rem;
}

.show-progress-stats span {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.64);
}

.show-progress-stats strong {
  font-size: 1.05rem;
}

.show-gallery {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.8rem;
}

.show-gallery__item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.show-gallery__badge {
  position: absolute;
  top: 0.55rem;
  right: 0.55rem;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(141, 181, 0, 0.5);
  background: rgba(0, 0, 0, 0.62);
  pointer-events: none;
}

.show-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.show-list__item {
  display: grid;
  gap: 0.2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.85rem 0.95rem;
}

.show-list__item span {
  color: rgba(255, 255, 255, 0.76);
}

.show-list__item--season {
  gap: 0.8rem;
}

.show-season__head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.show-season__head > div {
  display: grid;
  gap: 0.22rem;
}

.show-season__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 1rem;
}

@media (max-width: 767px) {
  .show-progress-card__head,
  .show-season__head {
    flex-direction: column;
  }
}
</style>
