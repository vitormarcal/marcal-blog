<script setup lang="ts">
import type { MediaPulseMovieCard, MediaPulseMoviesSummaryResponse } from '~/types/media-pulse-movies'

type MoviesRange = 'month' | 'year'

const { apiUrl, assetUrl } = useMediaPulseApi()

const selectedRange = ref<MoviesRange>('month')

const rangeOptions: { key: MoviesRange, label: string }[] = [
  { key: 'month', label: 'Últimos 30 dias' },
  { key: 'year', label: 'Último ano' }
]

const {
  data,
  pending,
  error,
  refresh
} = useAsyncData(
  () => `movies-home-${selectedRange.value}`,
  async () => {
    const [summary, recent] = await Promise.all([
      $fetch<MediaPulseMoviesSummaryResponse>(apiUrl(`/api/movies/summary?range=${selectedRange.value}`)),
      $fetch<MediaPulseMovieCard[]>(apiUrl('/api/movies/recent?limit=36'))
    ])

    return {
      summary,
      recent
    }
  },
  {
    server: false,
    watch: [selectedRange]
  }
)

const movies = computed(() => data.value?.recent || [])
const summary = computed(() => data.value?.summary || null)

const errorMessage = computed(() => {
  if (!error.value) return ''
  return 'Não foi possível carregar os filmes agora. Tente novamente.'
})

const coverSrc = (coverUrl?: string | null) => {
  if (!coverUrl) return ''
  return assetUrl(coverUrl)
}

const detailsLink = (movie: MediaPulseMovieCard) => {
  if (!movie.slug?.trim()) return ''
  return `/filmes/detalhe/${movie.slug}`
}

const hasOriginalTitleDiff = (movie: MediaPulseMovieCard) => {
  if (!movie.originalTitle?.trim()) return false
  return movie.originalTitle.trim().toLowerCase() !== movie.title.trim().toLowerCase()
}

const formatFullDate = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

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

const rangeDatesLabel = computed(() => {
  if (!summary.value?.range?.start || !summary.value?.range?.end) return ''
  return `${formatFullDate(summary.value.range.start)} a ${formatFullDate(summary.value.range.end)}`
})

const lastWatchLabel = computed(() => {
  const firstWithWatch = movies.value.find((movie) => movie.watchedAt)
  if (!firstWithWatch?.watchedAt) return ''
  return formatDateTime(firstWithWatch.watchedAt)
})

const sectionTitle = computed(() => {
  return selectedRange.value === 'month'
    ? 'O que entrou em cena no último mês'
    : 'O que entrou em cena no último ano'
})
</script>

<template>
  <section id="movies-top" class="movies-board" aria-labelledby="movies-title">
    <header class="movies-hero">
      <p class="movies-hero__kicker">Cinema</p>
      <h1 id="movies-title">Filmes que andei assistindo</h1>
      <p class="movies-hero__subtitle">
        Uma vitrine viva do que vi recentemente, com acesso rápido para cada detalhe.
      </p>

      <div class="movies-range" role="tablist" aria-label="Período da visão geral">
        <button
          v-for="option in rangeOptions"
          :key="option.key"
          type="button"
          :class="['movies-range__button', { 'movies-range__button--active': selectedRange === option.key }]"
          @click="selectedRange = option.key"
        >
          {{ option.label }}
        </button>
      </div>
    </header>

    <div v-if="pending" class="movies-skeleton" aria-busy="true">
      <div class="movies-skeleton__summary">
        <div class="skeleton-line skeleton-line--medium"></div>
        <div class="skeleton-line skeleton-line--short"></div>
      </div>
      <div class="movies-skeleton__grid">
        <div v-for="index in 6" :key="index" class="movies-skeleton__card">
          <div class="movies-skeleton__poster"></div>
          <div class="skeleton-line skeleton-line--medium"></div>
          <div class="skeleton-line"></div>
        </div>
      </div>
    </div>

    <div v-else-if="errorMessage" class="movies-state movies-state--error" role="status">
      <p>{{ errorMessage }}</p>
      <button type="button" class="movies-state__retry" @click="refresh()">Tentar novamente</button>
    </div>

    <template v-else-if="summary">
      <section class="movies-summary" aria-label="Resumo de filmes">
        <h2 class="sr-only">Resumo</h2>
        <ul class="movies-summary__list">
          <li class="movies-summary__card">
            <span>Sessões no período</span>
            <strong>{{ summary.watchesCount }}</strong>
          </li>
          <li class="movies-summary__card">
            <span>Filmes únicos</span>
            <strong>{{ summary.uniqueMoviesCount }}</strong>
          </li>
          <li class="movies-summary__card">
            <span>Janela analisada</span>
            <strong>{{ rangeDatesLabel || 'Sem intervalo' }}</strong>
          </li>
          <li class="movies-summary__card">
            <span>Última sessão registrada</span>
            <strong>{{ lastWatchLabel || 'Sem registro recente' }}</strong>
          </li>
        </ul>
      </section>

      <section class="movies-grid-section" aria-labelledby="movies-grid-title">
        <div class="movies-grid-section__head">
          <h2 id="movies-grid-title">{{ sectionTitle }}</h2>
          <p>Abra qualquer filme para mergulhar no histórico completo.</p>
        </div>

        <ul v-if="movies.length" class="movies-grid">
          <li v-for="movie in movies" :key="movie.movieId" class="movie-card">
            <div class="movie-card__poster">
              <ExpandableImage
                v-if="movie.coverUrl"
                :src="coverSrc(movie.coverUrl)"
                :alt="`Capa de ${movie.title}`"
                :expand-label="`Expandir capa de ${movie.title}`"
                gallery="movies-recent-covers"
                thumb-width="100%"
                thumb-height="100%"
                thumb-fit="cover"
                thumb-radius="0"
                trigger-width="100%"
                trigger-height="100%"
                max-lightbox-width="1200px"
              />
              <span v-else class="movie-card__placeholder" aria-hidden="true">sem pôster</span>
            </div>

            <div class="movie-card__body">
              <div class="movie-card__title-wrap">
                <h3>{{ movie.title }}</h3>
                <p v-if="hasOriginalTitleDiff(movie)" class="movie-card__original-title">
                  {{ movie.originalTitle }}
                </p>
              </div>

              <div class="movie-card__meta">
                <span v-if="movie.year" class="movie-pill">{{ movie.year }}</span>
                <span v-if="movie.watchedAt" class="movie-pill movie-pill--muted">
                  visto em {{ formatDateTime(movie.watchedAt) }}
                </span>
              </div>

              <NuxtLink
                v-if="detailsLink(movie)"
                :to="detailsLink(movie)"
                class="movie-card__cta"
              >
                Ver detalhes
              </NuxtLink>
              <span v-else class="movie-card__cta movie-card__cta--disabled" aria-disabled="true">
                Detalhes indisponíveis
              </span>
            </div>
          </li>
        </ul>
        <div v-else class="movies-state">
          Nenhum filme encontrado neste momento.
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped>
.movies-board {
  display: grid;
  gap: 2.25rem;
  padding: 1rem 0 4rem;
}

.sr-only {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.movies-hero {
  display: grid;
  gap: 0.95rem;
  padding: clamp(1.4rem, 1rem + 1.2vw, 2rem);
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
}

.movies-hero__kicker {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.62);
}

.movies-hero h1 {
  margin: 0;
  font-size: clamp(1.8rem, 1.4rem + 1.2vw, 2.5rem);
}

.movies-hero__subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  max-width: 64ch;
}

.movies-range {
  margin-top: 0.3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.movies-range__button {
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(0, 0, 0, 0.62);
  color: rgba(255, 255, 255, 0.88);
  border-radius: 999px;
  padding: 0.48rem 0.95rem;
  font-size: 0.92rem;
  cursor: pointer;
  transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
}

.movies-range__button:hover {
  transform: translateY(-1px);
}

.movies-range__button--active {
  background: rgba(141, 181, 0, 0.2);
  border-color: rgba(141, 181, 0, 0.72);
}

.movies-summary__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.9rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.movies-summary__card {
  display: grid;
  gap: 0.35rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  padding: 0.95rem 1rem;
}

.movies-summary__card span {
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.85rem;
}

.movies-summary__card strong {
  color: var(--font-color);
  font-size: 1.03rem;
  line-height: 1.35;
}

.movies-grid-section {
  display: grid;
  gap: 1rem;
}

.movies-grid-section__head {
  display: grid;
  gap: 0.35rem;
}

.movies-grid-section__head h2 {
  margin: 0;
  font-size: clamp(1.4rem, 1.2rem + 0.8vw, 1.85rem);
}

.movies-grid-section__head p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
}

.movies-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1rem;
}

.movie-card {
  display: grid;
  grid-template-rows: 320px 1fr;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.68);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.55);
}

.movie-card__poster {
  background: rgba(0, 0, 0, 0.3);
}

.movie-card__placeholder {
  height: 100%;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
  font-size: 0.78rem;
}

.movie-card__body {
  display: grid;
  gap: 0.75rem;
  padding: 0.9rem 0.95rem 1rem;
}

.movie-card__title-wrap {
  display: grid;
  gap: 0.2rem;
}

.movie-card__title-wrap h3 {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.3;
}

.movie-card__original-title {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  font-size: 0.92rem;
}

.movie-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.movie-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.25rem 0.62rem;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.78rem;
}

.movie-pill--muted {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
}

.movie-card__cta {
  margin-top: auto;
  width: fit-content;
  display: inline-flex;
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.06);
  padding: 0.4rem 0.72rem;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.movie-card__cta:hover {
  transform: translateY(-1px);
  color: var(--green);
  border-color: rgba(141, 181, 0, 0.7);
  filter: brightness(1.02);
}

.movie-card__cta--disabled {
  color: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
}

.movies-state {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
}

.movies-state--error {
  color: #fecaca;
  border-color: rgba(155, 28, 28, 0.45);
  background: rgba(155, 28, 28, 0.25);
}

.movies-state p {
  margin: 0;
}

.movies-state__retry {
  margin-top: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.32);
  background: transparent;
  color: #fff;
  padding: 0.35rem 0.65rem;
  border-radius: 9px;
  cursor: pointer;
}

.movies-skeleton {
  display: grid;
  gap: 1rem;
}

.movies-skeleton__summary {
  display: grid;
  gap: 0.45rem;
}

.movies-skeleton__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1rem;
}

.movies-skeleton__card {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  padding: 0.75rem;
  display: grid;
  gap: 0.55rem;
}

.movies-skeleton__poster {
  height: 250px;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.08));
  background-size: 220% 100%;
  animation: skeleton-wave 1.35s ease-in-out infinite;
}

.skeleton-line {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08));
  background-size: 220% 100%;
  animation: skeleton-wave 1.35s ease-in-out infinite;
}

.skeleton-line--short {
  width: 45%;
}

.skeleton-line--medium {
  width: 68%;
}

@keyframes skeleton-wave {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -120% 0;
  }
}

@media (max-width: 767px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 0.85rem;
  }

  .movie-card {
    grid-template-rows: 260px 1fr;
  }

  .movie-card__title-wrap h3 {
    font-size: 1rem;
  }
}
</style>
