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

    <div v-else-if="data">
      <header class="year-movies__summary">
        <div class="summary-head">
          <p class="summary-kicker">Filmes de {{ props.year }}</p>
          <h2 id="year-movies-title">Sumário</h2>
          <p class="summary-subtitle">Um panorama do que assisti e do que ainda falta assistir.</p>
        </div>
        <ul v-if="summary" class="summary-list" aria-label="Resumo de filmes">
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
          <a href="#section-assistidos">Assistidos</a>
          <a href="#section-nao-assistidos">Ainda não assistidos</a>
        </nav>
      </header>

      <div id="section-assistidos" class="year-movies__section" data-accent="watched">
        <div class="section-head">
          <h3>Assistidos</h3>
          <p>Filmes vistos ao longo do ano, com histórico de sessões.</p>
        </div>
        <ul v-if="watched.length" class="movies-list">
          <li v-for="item in watched" :key="`watched-${item.movieId}`" class="movies-item">
            <ExpandableImage
              v-if="item.coverUrl"
              :src="coverSrc(item.coverUrl)"
              :alt="`Pôster de ${item.title}`"
              :expand-label="`Expandir pôster de ${item.title}`"
              gallery="year-movies-covers"
              thumb-width="68px"
              thumb-height="102px"
              mobile-thumb-width="54px"
              mobile-thumb-height="82px"
              thumb-radius="8px"
            />
            <div v-else class="movies-item__cover movies-item__cover--placeholder" aria-hidden="true">
              sem pôster
            </div>

            <div class="movies-item__content">
              <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__title-link">
                <strong class="movies-item__title">{{ item.title }}</strong>
              </NuxtLink>
              <strong v-else class="movies-item__title">{{ item.title }}</strong>

              <span v-if="hasOriginalTitleDiff(item)" class="movies-item__original-title">{{ item.originalTitle }}</span>
              <span v-if="item.year" class="movies-item__meta">{{ item.year }}</span>
              <span v-if="watchedLabel(item)" class="movies-item__progress">{{ watchedLabel(item) }}</span>
              <span v-if="item.lastWatchedAt" class="movies-item__date">última sessão: {{ formatDate(item.lastWatchedAt) }}</span>
              <span v-if="item.firstWatchedAt" class="movies-item__date">primeira sessão: {{ formatDate(item.firstWatchedAt) }}</span>

              <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__details-link">
                Ver detalhes
              </NuxtLink>
            </div>
          </li>
        </ul>
        <p v-else class="movies-empty">Sem filmes assistidos neste ano.</p>
        <a class="back-to-top" href="#year-movies-top">Voltar ao topo</a>
      </div>

      <div id="section-nao-assistidos" class="year-movies__section" data-accent="unwatched">
        <div class="section-head">
          <h3>Ainda não assistidos</h3>
          <p>Filmes da biblioteca que ainda não têm sessão registrada.</p>
        </div>
        <ul v-if="unwatched.length" class="movies-list">
          <li v-for="item in unwatched" :key="`unwatched-${item.movieId}`" class="movies-item">
            <ExpandableImage
              v-if="item.coverUrl"
              :src="coverSrc(item.coverUrl)"
              :alt="`Pôster de ${item.title}`"
              :expand-label="`Expandir pôster de ${item.title}`"
              gallery="year-movies-covers"
              thumb-width="68px"
              thumb-height="102px"
              mobile-thumb-width="54px"
              mobile-thumb-height="82px"
              thumb-radius="8px"
            />
            <div v-else class="movies-item__cover movies-item__cover--placeholder" aria-hidden="true">
              sem pôster
            </div>

            <div class="movies-item__content">
              <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__title-link">
                <strong class="movies-item__title">{{ item.title }}</strong>
              </NuxtLink>
              <strong v-else class="movies-item__title">{{ item.title }}</strong>

              <span v-if="hasOriginalTitleDiff(item)" class="movies-item__original-title">{{ item.originalTitle }}</span>
              <span v-if="item.year" class="movies-item__meta">{{ item.year }}</span>

              <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__details-link">
                Ver detalhes
              </NuxtLink>
            </div>
          </li>
        </ul>
        <p v-else class="movies-empty">Nenhum filme pendente na biblioteca.</p>
        <a class="back-to-top" href="#year-movies-top">Voltar ao topo</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.year-movies {
  display: grid;
  gap: 3.5rem;
  padding: 2.5rem 0 4rem;
}

.year-movies__summary {
  display: grid;
  gap: 1.75rem;
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 40px rgba(0, 0, 0, 0.45);
}

.summary-head {
  display: grid;
  gap: 0.4rem;
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
  font-size: clamp(1.4rem, 1.1rem + 1.2vw, 2rem);
}

.summary-subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.summary-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.summary-card {
  background: rgba(0, 0, 0, 0.65);
  border-radius: 16px;
  padding: 1rem 1.2rem;
  display: grid;
  gap: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.5);
}

.summary-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
}

.summary-value {
  font-size: 1.3rem;
  color: var(--font-color);
}

.summary-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  font-size: 0.95rem;
}

.summary-nav a {
  color: var(--font-color);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  padding-bottom: 0.1rem;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.summary-nav a:hover {
  border-bottom-color: var(--green);
  color: var(--green);
}

.year-movies__section {
  display: grid;
  gap: 1.5rem;
  padding: 0.5rem 0;
  margin-top: 1rem;
}

.section-head {
  display: grid;
  gap: 0.35rem;
  padding-left: 1rem;
  border-left: 3px solid transparent;
}

.year-movies__section[data-accent="watched"] .section-head {
  border-left-color: rgba(141, 181, 0, 0.85);
}

.year-movies__section[data-accent="unwatched"] .section-head {
  border-left-color: rgba(141, 181, 0, 0.4);
}

.section-head h3 {
  margin: 0 !important;
  font-size: clamp(1.2rem, 1.05rem + 0.6vw, 1.6rem);
}

.section-head p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.movies-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1.2rem;
}

.movies-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
  padding: 1rem 1.1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.68);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.6);
}

.movies-item__cover {
  width: 68px;
  height: 102px;
  border-radius: 8px;
  object-fit: cover;
}

.movies-item__cover--placeholder {
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.68rem;
  background: rgba(255, 255, 255, 0.18);
  text-transform: uppercase;
}

.movies-item__content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
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
  font-size: 0.9rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.74);
}

.movies-item__meta,
.movies-item__date {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.72);
}

.movies-item__progress {
  font-size: 0.88rem;
  color: rgba(141, 181, 0, 0.95);
}

.movies-item__details-link {
  width: fit-content;
  margin-top: 0.18rem;
  font-size: 0.86rem;
  text-decoration: underline;
  color: var(--font-color);
}

.movies-item__details-link:hover {
  color: var(--green);
}

.movies-empty {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.95rem;
}

.back-to-top {
  width: fit-content;
  color: var(--font-color);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  padding-bottom: 0.1rem;
  font-size: 0.95rem;
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
  height: 14px;
  background: linear-gradient(90deg, #f2f2f2, #e5e5e5, #f2f2f2);
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
    padding: 1.5rem 0 3rem;
  }

  .year-movies__summary {
    padding: 1.5rem;
  }

  .movies-item {
    gap: 0.75rem;
    padding: 0.9rem 1rem;
  }

  .movies-item__cover {
    width: 54px;
    height: 82px;
  }
}
</style>
