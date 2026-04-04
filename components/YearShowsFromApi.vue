<script setup lang="ts">
import type {
  MediaPulseCurrentlyWatchingShowCard,
  MediaPulseYearShowUnwatchedCard,
  MediaPulseYearShowWatchedCard,
  MediaPulseYearShowsResponse
} from '~/types/media-pulse-shows'

const props = defineProps<{
  year: number
}>()

const { apiUrl, assetUrl } = useMediaPulseApi()

const {
  data,
  pending,
  error,
  refresh
} = useAsyncData(
  () => `year-shows-${props.year}`,
  async () => {
    const [yearShows, currentlyWatching] = await Promise.all([
      $fetch<MediaPulseYearShowsResponse>(apiUrl(`/api/shows/year/${props.year}`)),
      $fetch<MediaPulseCurrentlyWatchingShowCard[]>(apiUrl('/api/shows/currently-watching'))
    ])

    return {
      yearShows,
      currentlyWatching
    }
  },
  {
    server: false,
    watch: [() => props.year]
  }
)

const watched = computed(() => data.value?.yearShows.watched || [])
const unwatched = computed(() => data.value?.yearShows.unwatched || [])
const currentlyWatching = computed(() => data.value?.currentlyWatching || [])

const currentlyWatchingSorted = computed(() => {
  return [...currentlyWatching.value].sort((a, b) => {
    const aDate = new Date(a.lastWatchedAt || 0).getTime()
    const bDate = new Date(b.lastWatchedAt || 0).getTime()
    return bDate - aDate
  })
})

const watchedSorted = computed(() => {
  return [...watched.value].sort((a, b) => {
    const aDate = new Date(a.lastWatchedAt || a.firstWatchedAt || 0).getTime()
    const bDate = new Date(b.lastWatchedAt || b.firstWatchedAt || 0).getTime()
    return bDate - aDate
  })
})

const unwatchedSorted = computed(() => {
  return [...unwatched.value].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
})

const detailsLink = (slug?: string | null) => {
  if (!slug?.trim()) return ''
  return `/series/detalhe/${slug}`
}

const coverSrc = (coverUrl?: string | null) => {
  if (!coverUrl) return ''
  return assetUrl(coverUrl)
}

const formatDate = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const hasOriginalTitleDiff = (
  show: MediaPulseCurrentlyWatchingShowCard | MediaPulseYearShowWatchedCard | MediaPulseYearShowUnwatchedCard
) => {
  const original = show.originalTitle?.trim()
  const title = show.title?.trim()
  if (!original || !title) return false
  return original.toLowerCase() !== title.toLowerCase()
}

const watchedLabel = (item: MediaPulseYearShowWatchedCard) => {
  const count = Number(item.watchCountInYear || 0)
  if (!count) return ''
  if (count === 1) return '1 episódio no ano'
  return `${count} episódios no ano`
}

const currentlyWatchingLabel = (item: MediaPulseCurrentlyWatchingShowCard) => {
  const watchedEpisodesCount = Number(item.progress?.watchedEpisodesCount || 0)
  const episodesCount = Number(item.progress?.episodesCount || 0)

  if (!episodesCount) return ''
  return `${watchedEpisodesCount}/${episodesCount} episódios`
}

const currentlyWatchingProgressLabel = (item: MediaPulseCurrentlyWatchingShowCard) => {
  const progress = item.progress
  if (!progress) return ''

  const seasonBits: string[] = []
  if (progress.seasonsCount) {
    seasonBits.push(`${progress.completedSeasonsCount}/${progress.seasonsCount} temporadas`)
  }
  if (progress.inProgress) {
    seasonBits.push('em andamento')
  }

  return seasonBits.join(' · ')
}

const firstLastLabel = (item: MediaPulseYearShowWatchedCard) => {
  const first = formatDate(item.firstWatchedAt)
  const last = formatDate(item.lastWatchedAt)
  if (!first && !last) return ''
  if (first && last && first !== last) return `Primeiro: ${first} · Último: ${last}`
  return `Registro em ${last || first}`
}

const lastWatchedLabel = (item: MediaPulseCurrentlyWatchingShowCard) => {
  const last = formatDate(item.lastWatchedAt)
  if (!last) return ''
  return `Último episódio em ${last}`
}

const errorMessage = computed(() => {
  if (!error.value) return ''
  return 'Não foi possível carregar as séries do ano agora.'
})
</script>

<template>
  <section id="year-shows-top" class="year-shows" aria-labelledby="year-shows-title">
    <div v-if="pending" class="year-shows__skeleton" aria-busy="true">
      <div class="skeleton-line skeleton-line--title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>

    <div v-else-if="errorMessage" class="year-shows__error" role="status">
      <p>{{ errorMessage }}</p>
      <button type="button" @click="refresh()">Tentar novamente</button>
    </div>

    <div v-else-if="data" class="year-shows__content">
      <header class="year-shows__summary">
        <div class="summary-head">
          <p class="summary-kicker">Séries de {{ props.year }}</p>
          <h2 id="year-shows-title">Resumo do ano</h2>
          <p class="summary-subtitle">O que está em andamento agora, o que teve episódio neste ano e o que ainda está sem play.</p>
        </div>

        <nav class="summary-nav" aria-label="Navegação de seções">
          <a href="#section-assistindo">Assistindo ({{ currentlyWatchingSorted.length }})</a>
          <a href="#section-assistidas">Assistidas ({{ watchedSorted.length }})</a>
          <a href="#section-nao-assistidas">Ainda não assistidas ({{ unwatchedSorted.length }})</a>
        </nav>
      </header>

      <section id="section-assistindo" class="year-shows__section" data-accent="watching">
        <div class="section-head">
          <h3>Assistindo</h3>
          <p>
            <strong>{{ currentlyWatchingSorted.length }}</strong>
            séries com progresso ativo recentemente.
          </p>
        </div>

        <ul v-if="currentlyWatchingSorted.length" class="shows-list">
          <li v-for="item in currentlyWatchingSorted" :key="`watching-${item.showId}`" class="shows-item">
            <ExpandableImage
              v-if="item.coverUrl"
              :src="coverSrc(item.coverUrl)"
              :alt="`Capa de ${item.title}`"
              :expand-label="`Expandir capa de ${item.title}`"
              gallery="year-shows-covers"
              thumb-width="72px"
              thumb-height="106px"
              mobile-thumb-width="58px"
              mobile-thumb-height="86px"
              thumb-radius="8px"
            />
            <div v-else class="shows-item__cover shows-item__cover--placeholder" aria-hidden="true">
              sem capa
            </div>

            <div class="shows-item__content">
              <div class="shows-item__head">
                <div class="shows-item__titles">
                  <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="shows-item__title-link">
                    <strong class="shows-item__title">{{ item.title }}</strong>
                  </NuxtLink>
                  <strong v-else class="shows-item__title">{{ item.title }}</strong>
                  <span v-if="hasOriginalTitleDiff(item)" class="shows-item__original-title">{{ item.originalTitle }}</span>
                </div>

                <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="shows-item__details-link">
                  Ver detalhes
                </NuxtLink>
              </div>

              <div class="shows-item__meta-row">
                <span v-if="item.year" class="shows-item__meta-pill">{{ item.year }}</span>
                <span v-if="currentlyWatchingLabel(item)" class="shows-item__meta-pill shows-item__meta-pill--highlight">
                  {{ currentlyWatchingLabel(item) }}
                </span>
                <span v-if="currentlyWatchingProgressLabel(item)" class="shows-item__meta-pill">
                  {{ currentlyWatchingProgressLabel(item) }}
                </span>
              </div>

              <span v-if="lastWatchedLabel(item)" class="shows-item__date">{{ lastWatchedLabel(item) }}</span>
            </div>
          </li>
        </ul>

        <p v-else class="shows-empty">Nenhuma série em andamento no momento.</p>
        <a class="back-to-top" href="#year-shows-top">Voltar ao topo</a>
      </section>

      <section id="section-assistidas" class="year-shows__section" data-accent="watched">
        <div class="section-head">
          <h3>Assistidas</h3>
          <p>
            <strong>{{ watchedSorted.length }}</strong>
            séries com episódio registrado em {{ props.year }}.
          </p>
        </div>

        <ul v-if="watchedSorted.length" class="shows-list">
          <li v-for="item in watchedSorted" :key="`watched-${item.showId}`" class="shows-item">
            <ExpandableImage
              v-if="item.coverUrl"
              :src="coverSrc(item.coverUrl)"
              :alt="`Capa de ${item.title}`"
              :expand-label="`Expandir capa de ${item.title}`"
              gallery="year-shows-covers"
              thumb-width="72px"
              thumb-height="106px"
              mobile-thumb-width="58px"
              mobile-thumb-height="86px"
              thumb-radius="8px"
            />
            <div v-else class="shows-item__cover shows-item__cover--placeholder" aria-hidden="true">
              sem capa
            </div>

            <div class="shows-item__content">
              <div class="shows-item__head">
                <div class="shows-item__titles">
                  <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="shows-item__title-link">
                    <strong class="shows-item__title">{{ item.title }}</strong>
                  </NuxtLink>
                  <strong v-else class="shows-item__title">{{ item.title }}</strong>
                  <span v-if="hasOriginalTitleDiff(item)" class="shows-item__original-title">{{ item.originalTitle }}</span>
                </div>

                <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="shows-item__details-link">
                  Ver detalhes
                </NuxtLink>
              </div>

              <div class="shows-item__meta-row">
                <span v-if="item.year" class="shows-item__meta-pill">{{ item.year }}</span>
                <span v-if="watchedLabel(item)" class="shows-item__meta-pill shows-item__meta-pill--highlight">
                  {{ watchedLabel(item) }}
                </span>
              </div>

              <span v-if="firstLastLabel(item)" class="shows-item__date">{{ firstLastLabel(item) }}</span>
            </div>
          </li>
        </ul>

        <p v-else class="shows-empty">Sem séries assistidas neste ano.</p>
        <a class="back-to-top" href="#year-shows-top">Voltar ao topo</a>
      </section>

      <section id="section-nao-assistidas" class="year-shows__section" data-accent="unwatched">
        <div class="section-head">
          <h3>Ainda não assistidas</h3>
          <p>
            <strong>{{ unwatchedSorted.length }}</strong>
            séries sem episódio registrado.
          </p>
        </div>

        <ul v-if="unwatchedSorted.length" class="shows-list">
          <li v-for="item in unwatchedSorted" :key="`unwatched-${item.showId}`" class="shows-item">
            <ExpandableImage
              v-if="item.coverUrl"
              :src="coverSrc(item.coverUrl)"
              :alt="`Capa de ${item.title}`"
              :expand-label="`Expandir capa de ${item.title}`"
              gallery="year-shows-covers"
              thumb-width="72px"
              thumb-height="106px"
              mobile-thumb-width="58px"
              mobile-thumb-height="86px"
              thumb-radius="8px"
            />
            <div v-else class="shows-item__cover shows-item__cover--placeholder" aria-hidden="true">
              sem capa
            </div>

            <div class="shows-item__content">
              <div class="shows-item__head">
                <div class="shows-item__titles">
                  <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="shows-item__title-link">
                    <strong class="shows-item__title">{{ item.title }}</strong>
                  </NuxtLink>
                  <strong v-else class="shows-item__title">{{ item.title }}</strong>
                  <span v-if="hasOriginalTitleDiff(item)" class="shows-item__original-title">{{ item.originalTitle }}</span>
                </div>

                <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="shows-item__details-link">
                  Ver detalhes
                </NuxtLink>
              </div>

              <div class="shows-item__meta-row">
                <span v-if="item.year" class="shows-item__meta-pill">{{ item.year }}</span>
                <span class="shows-item__meta-pill">na fila</span>
              </div>
            </div>
          </li>
        </ul>

        <p v-else class="shows-empty">Nenhuma série pendente na biblioteca.</p>
        <a class="back-to-top" href="#year-shows-top">Voltar ao topo</a>
      </section>
    </div>
  </section>
</template>

<style scoped>
.year-shows {
  display: grid;
  gap: 2rem;
  padding: 1.5rem 0 3.5rem;
}

.year-shows__content {
  display: grid;
  gap: 2.4rem;
}

.year-shows__summary {
  display: grid;
  gap: 1.2rem;
  padding: 1.3rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
}

.summary-head {
  display: grid;
  gap: 0.35rem;
}

.summary-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.year-shows__summary h2 {
  margin: 0;
  font-size: clamp(1.3rem, 1.1rem + 1vw, 1.9rem);
}

.summary-subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.95rem;
}

.summary-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1.2rem;
  font-size: 0.92rem;
}

.summary-nav a {
  color: var(--font-color);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  padding-bottom: 0.08rem;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.summary-nav a:hover {
  border-bottom-color: var(--green);
  color: var(--green);
}

.year-shows__section {
  display: grid;
  gap: 1.15rem;
}

.section-head {
  display: grid;
  gap: 0.25rem;
  padding-left: 0.9rem;
  border-left: 3px solid transparent;
}

.year-shows__section[data-accent="watched"] .section-head {
  border-left-color: rgba(141, 181, 0, 0.85);
}

.year-shows__section[data-accent="watching"] .section-head {
  border-left-color: rgba(96, 165, 250, 0.85);
}

.year-shows__section[data-accent="unwatched"] .section-head {
  border-left-color: rgba(141, 181, 0, 0.45);
}

.section-head h3 {
  margin: 0 !important;
  font-size: clamp(1.15rem, 1.03rem + 0.56vw, 1.5rem);
}

.section-head p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.93rem;
}

.section-head strong {
  color: var(--font-color);
}

.shows-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.8rem;
}

.shows-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.9rem;
  align-items: start;
  padding: 0.85rem 0.95rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
}

.shows-item__cover {
  width: 72px;
  height: 106px;
  border-radius: 8px;
  object-fit: cover;
}

.shows-item__cover--placeholder {
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.66rem;
  background: rgba(255, 255, 255, 0.16);
  text-transform: uppercase;
}

.shows-item__content {
  display: grid;
  gap: 0.45rem;
}

.shows-item__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.7rem;
}

.shows-item__titles {
  display: grid;
  gap: 0.18rem;
}

.shows-item__title {
  font-weight: 600;
}

.shows-item__title-link {
  width: fit-content;
  color: inherit;
  text-decoration: none;
}

.shows-item__title-link:hover {
  color: var(--green);
}

.shows-item__original-title {
  font-size: 0.88rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.74);
}

.shows-item__meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.shows-item__meta-pill {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
  padding: 0.14rem 0.5rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.78);
}

.shows-item__meta-pill--highlight {
  border-color: rgba(141, 181, 0, 0.5);
  color: rgba(141, 181, 0, 0.98);
}

.shows-item__date {
  font-size: 0.86rem;
  color: rgba(255, 255, 255, 0.7);
}

.shows-item__details-link {
  text-decoration: none;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  padding: 0.22rem 0.58rem;
  color: var(--font-color);
  font-size: 0.78rem;
  white-space: nowrap;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.shows-item__details-link:hover {
  border-color: rgba(141, 181, 0, 0.75);
  color: var(--green);
}

.shows-empty {
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.95rem;
}

.back-to-top {
  width: fit-content;
  color: var(--font-color);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  padding-bottom: 0.08rem;
  font-size: 0.92rem;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.back-to-top:hover {
  border-bottom-color: var(--green);
  color: var(--green);
}

.year-shows__skeleton {
  display: grid;
  gap: 0.75rem;
}

.skeleton-line {
  height: 13px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
  background-size: 200% 100%;
  animation: skeleton 1.2s ease-in-out infinite;
  border-radius: 6px;
}

.skeleton-line--title {
  height: 18px;
  width: 40%;
}

.year-shows__error {
  color: #fecaca;
  background: rgba(155, 28, 28, 0.25);
  padding: 0.85rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(155, 28, 28, 0.45);
  display: grid;
  gap: 0.65rem;
}

.year-shows__error p {
  margin: 0;
}

.year-shows__error button {
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.32);
  background: transparent;
  color: var(--font-color);
  padding: 0.35rem 0.62rem;
  border-radius: 8px;
  cursor: pointer;
}

@keyframes skeleton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 600px) {
  .year-shows {
    padding: 1.2rem 0 2.8rem;
  }

  .year-shows__summary {
    padding: 1rem;
  }

  .shows-item {
    gap: 0.7rem;
    padding: 0.8rem 0.85rem;
  }

  .shows-item__cover {
    width: 58px;
    height: 86px;
  }

  .shows-item__head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
