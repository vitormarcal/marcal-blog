<script setup lang="ts">
import type {
  MediaPulseYearMovieUnwatchedCard,
  MediaPulseYearMovieWatchedCard,
  MediaPulseYearMoviesResponse
} from '~/types/media-pulse-movies'

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
  () => `year-movies-${props.year}`,
  () => $fetch<MediaPulseYearMoviesResponse>(apiUrl(`/api/movies/year/${props.year}`)),
  {
    server: false,
    watch: [() => props.year]
  }
)

const summary = computed(() => data.value?.stats || null)

const watched = computed(() => data.value?.watched || [])
const unwatched = computed(() => data.value?.unwatched || [])

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
  return `/filmes/detalhe/${slug}`
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

const rangeLabel = computed(() => {
  const start = formatDate(data.value?.range?.start)
  const end = formatDate(data.value?.range?.end)
  if (!start || !end) return ''
  return `${start} a ${end}`
})

const hasOriginalTitleDiff = (movie: MediaPulseYearMovieWatchedCard | MediaPulseYearMovieUnwatchedCard) => {
  const original = movie.originalTitle?.trim()
  const title = movie.title?.trim()
  if (!original || !title) return false
  return original.toLowerCase() !== title.toLowerCase()
}

const watchedLabel = (item: MediaPulseYearMovieWatchedCard) => {
  const count = Number(item.watchCountInYear || 0)
  if (!count) return ''
  if (count === 1) return '1 sessão no ano'
  return `${count} sessões no ano`
}

const firstLastLabel = (item: MediaPulseYearMovieWatchedCard) => {
  const first = formatDate(item.firstWatchedAt)
  const last = formatDate(item.lastWatchedAt)
  if (!first && !last) return ''
  if (first && last && first !== last) return `Primeira: ${first} · Última: ${last}`
  return `Sessão registrada em ${last || first}`
}

const errorMessage = computed(() => {
  if (!error.value) return ''
  return 'Não foi possível carregar os filmes do ano agora.'
})
</script>

<template>
  <section id="year-movies-top" class="year-movies" aria-labelledby="year-movies-title">
    <div v-if="pending" class="year-movies__skeleton" aria-busy="true">
      <div class="skeleton-line skeleton-line--title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>

    <div v-else-if="errorMessage" class="year-movies__error" role="status">
      <p>{{ errorMessage }}</p>
      <button type="button" @click="refresh()">Tentar novamente</button>
    </div>

    <div v-else-if="data" class="year-movies__content">
      <header class="year-movies__summary">
        <div class="summary-head">
          <p class="summary-kicker">Filmes de {{ props.year }}</p>
          <h2 id="year-movies-title">Resumo do ano</h2>
          <p class="summary-subtitle">Tudo que entrou em cena neste ano e o que ainda está na fila.</p>
        </div>

        <ul v-if="summary" class="summary-list" aria-label="Resumo de filmes do ano">
          <li class="summary-card">
            <span class="summary-label">Sessões no ano</span>
            <strong class="summary-value">{{ summary.watchesCount }}</strong>
          </li>
          <li class="summary-card">
            <span class="summary-label">Filmes únicos</span>
            <strong class="summary-value">{{ summary.uniqueMoviesCount }}</strong>
          </li>
          <li class="summary-card">
            <span class="summary-label">Reassistidos</span>
            <strong class="summary-value">{{ summary.rewatchesCount }}</strong>
          </li>
          <li class="summary-card">
            <span class="summary-label">Período</span>
            <strong class="summary-value">{{ rangeLabel || 'Ano completo' }}</strong>
          </li>
        </ul>

        <nav class="summary-nav" aria-label="Navegação de seções">
          <a href="#section-assistidos">Assistidos ({{ watchedSorted.length }})</a>
          <a href="#section-nao-assistidos">Ainda não assistidos ({{ unwatchedSorted.length }})</a>
        </nav>
      </header>

      <section id="section-assistidos" class="year-movies__section" data-accent="watched">
        <div class="section-head">
          <h3>Assistidos</h3>
          <p>
            <strong>{{ watchedSorted.length }}</strong>
            filmes com sessão registrada em {{ props.year }}.
          </p>
        </div>

        <ul v-if="watchedSorted.length" class="movies-list">
          <li v-for="item in watchedSorted" :key="`watched-${item.movieId}`" class="movies-item">
            <ExpandableImage
              v-if="item.coverUrl"
              :src="coverSrc(item.coverUrl)"
              :alt="`Pôster de ${item.title}`"
              :expand-label="`Expandir pôster de ${item.title}`"
              gallery="year-movies-covers"
              thumb-width="72px"
              thumb-height="106px"
              mobile-thumb-width="58px"
              mobile-thumb-height="86px"
              thumb-radius="8px"
            />
            <div v-else class="movies-item__cover movies-item__cover--placeholder" aria-hidden="true">
              sem pôster
            </div>

            <div class="movies-item__content">
              <div class="movies-item__head">
                <div class="movies-item__titles">
                  <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__title-link">
                    <strong class="movies-item__title">{{ item.title }}</strong>
                  </NuxtLink>
                  <strong v-else class="movies-item__title">{{ item.title }}</strong>
                  <span v-if="hasOriginalTitleDiff(item)" class="movies-item__original-title">{{ item.originalTitle }}</span>
                </div>

                <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__details-link">
                  Ver detalhes
                </NuxtLink>
              </div>

              <div class="movies-item__meta-row">
                <span v-if="item.year" class="movies-item__meta-pill">{{ item.year }}</span>
                <span v-if="watchedLabel(item)" class="movies-item__meta-pill movies-item__meta-pill--highlight">
                  {{ watchedLabel(item) }}
                </span>
              </div>

              <span v-if="firstLastLabel(item)" class="movies-item__date">{{ firstLastLabel(item) }}</span>
            </div>
          </li>
        </ul>

        <p v-else class="movies-empty">Sem filmes assistidos neste ano.</p>
        <a class="back-to-top" href="#year-movies-top">Voltar ao topo</a>
      </section>

      <section id="section-nao-assistidos" class="year-movies__section" data-accent="unwatched">
        <div class="section-head">
          <h3>Ainda não assistidos</h3>
          <p>
            <strong>{{ unwatchedSorted.length }}</strong>
            filmes sem sessão registrada.
          </p>
        </div>

        <ul v-if="unwatchedSorted.length" class="movies-list">
          <li v-for="item in unwatchedSorted" :key="`unwatched-${item.movieId}`" class="movies-item">
            <ExpandableImage
              v-if="item.coverUrl"
              :src="coverSrc(item.coverUrl)"
              :alt="`Pôster de ${item.title}`"
              :expand-label="`Expandir pôster de ${item.title}`"
              gallery="year-movies-covers"
              thumb-width="72px"
              thumb-height="106px"
              mobile-thumb-width="58px"
              mobile-thumb-height="86px"
              thumb-radius="8px"
            />
            <div v-else class="movies-item__cover movies-item__cover--placeholder" aria-hidden="true">
              sem pôster
            </div>

            <div class="movies-item__content">
              <div class="movies-item__head">
                <div class="movies-item__titles">
                  <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__title-link">
                    <strong class="movies-item__title">{{ item.title }}</strong>
                  </NuxtLink>
                  <strong v-else class="movies-item__title">{{ item.title }}</strong>
                  <span v-if="hasOriginalTitleDiff(item)" class="movies-item__original-title">{{ item.originalTitle }}</span>
                </div>

                <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__details-link">
                  Ver detalhes
                </NuxtLink>
              </div>

              <div class="movies-item__meta-row">
                <span v-if="item.year" class="movies-item__meta-pill">{{ item.year }}</span>
                <span class="movies-item__meta-pill">na fila</span>
              </div>
            </div>
          </li>
        </ul>

        <p v-else class="movies-empty">Nenhum filme pendente na biblioteca.</p>
        <a class="back-to-top" href="#year-movies-top">Voltar ao topo</a>
      </section>
    </div>
  </section>
</template>

<style scoped>
.year-movies {
  display: grid;
  gap: 2rem;
  padding: 1.5rem 0 3.5rem;
}

.year-movies__content {
  display: grid;
  gap: 2.4rem;
}

.year-movies__summary {
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

.year-movies__summary h2 {
  margin: 0;
  font-size: clamp(1.3rem, 1.1rem + 1vw, 1.9rem);
}

.summary-subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.95rem;
}

.summary-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(136px, 1fr));
  gap: 0.7rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.summary-card {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 0.75rem 0.88rem;
  display: grid;
  gap: 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.summary-label {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.65);
}

.summary-value {
  font-size: 1.08rem;
  color: var(--font-color);
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

.year-movies__section {
  display: grid;
  gap: 1.15rem;
}

.section-head {
  display: grid;
  gap: 0.25rem;
  padding-left: 0.9rem;
  border-left: 3px solid transparent;
}

.year-movies__section[data-accent="watched"] .section-head {
  border-left-color: rgba(141, 181, 0, 0.85);
}

.year-movies__section[data-accent="unwatched"] .section-head {
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

.movies-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.8rem;
}

.movies-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.9rem;
  align-items: start;
  padding: 0.85rem 0.95rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
}

.movies-item__cover {
  width: 72px;
  height: 106px;
  border-radius: 8px;
  object-fit: cover;
}

.movies-item__cover--placeholder {
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.66rem;
  background: rgba(255, 255, 255, 0.16);
  text-transform: uppercase;
}

.movies-item__content {
  display: grid;
  gap: 0.45rem;
}

.movies-item__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.7rem;
}

.movies-item__titles {
  display: grid;
  gap: 0.18rem;
}

.movies-item__title {
  font-weight: 600;
}

.movies-item__title-link {
  width: fit-content;
  color: inherit;
  text-decoration: none;
}

.movies-item__title-link:hover {
  color: var(--green);
}

.movies-item__original-title {
  font-size: 0.88rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.74);
}

.movies-item__meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.movies-item__meta-pill {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
  padding: 0.14rem 0.5rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.78);
}

.movies-item__meta-pill--highlight {
  border-color: rgba(141, 181, 0, 0.5);
  color: rgba(141, 181, 0, 0.98);
}

.movies-item__date {
  font-size: 0.86rem;
  color: rgba(255, 255, 255, 0.7);
}

.movies-item__details-link {
  text-decoration: none;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  padding: 0.22rem 0.58rem;
  color: var(--font-color);
  font-size: 0.78rem;
  white-space: nowrap;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.movies-item__details-link:hover {
  border-color: rgba(141, 181, 0, 0.75);
  color: var(--green);
}

.movies-empty {
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

.year-movies__skeleton {
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

.year-movies__error {
  color: #fecaca;
  background: rgba(155, 28, 28, 0.25);
  padding: 0.85rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(155, 28, 28, 0.45);
  display: grid;
  gap: 0.65rem;
}

.year-movies__error p {
  margin: 0;
}

.year-movies__error button {
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
  .year-movies {
    padding: 1.2rem 0 2.8rem;
  }

  .year-movies__summary {
    padding: 1rem;
  }

  .movies-item {
    gap: 0.7rem;
    padding: 0.8rem 0.85rem;
  }

  .movies-item__cover {
    width: 58px;
    height: 86px;
  }

  .movies-item__head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
