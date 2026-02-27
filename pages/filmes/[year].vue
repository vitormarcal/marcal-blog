<script setup lang="ts">
import YearMoviesFromApi from '~/components/YearMoviesFromApi.vue'
import type { MediaPulseMoviesStatsResponse } from '~/types/media-pulse-movies'

definePageMeta({
  documentDriven: false
})

const route = useRoute()
const { apiUrl } = useMediaPulseApi()
const currentYear = new Date().getFullYear()

const yearParam = Array.isArray(route.params.year) ? route.params.year[0] : route.params.year
const year = Number.parseInt(String(yearParam || ''), 10)

if (!Number.isInteger(year) || year < 1900 || year > currentYear) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Ano inválido'
  })
}

const title = `Filmes de ${year}`
const description = `Acompanhe os filmes assistidos em ${year} e o que ainda falta assistir.`

const {
  data: moviesStats,
  pending: statsPending
} = useAsyncData(
  'movies-stats-years',
  () => $fetch<MediaPulseMoviesStatsResponse>(apiUrl('/api/movies/stats')),
  {
    server: false
  }
)

const yearsFromApi = computed(() => {
  return (moviesStats.value?.years || [])
    .filter((item) => Number.isInteger(item.year) && item.year >= 1900 && item.year <= currentYear)
})

const yearLinks = computed(() => {
  const years = yearsFromApi.value.map((item) => item.year)

  const merged = Array.from(new Set([...years, year]))
  return merged.sort((a, b) => b - a)
})

const yearStatsByYear = computed(() => {
  const map = new Map<number, (typeof yearsFromApi.value)[number]>()
  yearsFromApi.value.forEach((item) => map.set(item.year, item))
  return map
})

const selectedYearStats = computed(() => yearStatsByYear.value.get(year) || null)
const globalUnwatchedCount = computed(() => moviesStats.value?.unwatchedCount ?? null)
const olderYear = computed(() => yearLinks.value.find((value) => value < year) || null)
const newerYear = computed(() => yearLinks.value.find((value) => value > year) || null)

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <section class="main-section">
    <main>
      <div class="post-section content-section">
        <header class="movies-year-header">
          <p class="movies-year-header__kicker">Filmes</p>
          <h1>Visão de {{ year }}</h1>
          <p class="movies-year-header__description">
            Um painel anual com assistidos, pendentes e acesso rápido para os detalhes de cada filme.
          </p>

          <div class="movies-global-summary" aria-label="Resumo geral da filmoteca">
            <div class="movies-global-summary__item">
              <span class="movies-global-summary__label">Sessões em {{ year }}</span>
              <strong class="movies-global-summary__value">{{ selectedYearStats?.watchesCount ?? '—' }}</strong>
            </div>
            <div class="movies-global-summary__item">
              <span class="movies-global-summary__label">Filmes únicos no ano</span>
              <strong class="movies-global-summary__value">{{ selectedYearStats?.uniqueMoviesCount ?? '—' }}</strong>
            </div>
            <div class="movies-global-summary__item">
              <span class="movies-global-summary__label">Reassistidos no ano</span>
              <strong class="movies-global-summary__value">{{ selectedYearStats?.rewatchesCount ?? '—' }}</strong>
            </div>
            <div class="movies-global-summary__item">
              <span class="movies-global-summary__label">Pendentes na biblioteca</span>
              <strong class="movies-global-summary__value">{{ globalUnwatchedCount ?? '—' }}</strong>
            </div>
          </div>

          <nav class="movies-years-nav" aria-label="Selecionar ano de filmes">
            <NuxtLink
              v-for="yearLink in yearLinks"
              :key="yearLink"
              :to="`/filmes/${yearLink}`"
              :class="['movies-years-nav__link', { 'movies-years-nav__link--active': yearLink === year }]"
              :aria-current="yearLink === year ? 'page' : undefined"
            >
              <span>{{ yearLink }}</span>
              <small v-if="yearStatsByYear.get(yearLink)" class="movies-years-nav__count">
                {{ yearStatsByYear.get(yearLink)?.watchesCount }} sessões
              </small>
            </NuxtLink>
          </nav>

          <div class="movies-year-jump" aria-label="Navegação entre anos">
            <NuxtLink v-if="newerYear" :to="`/filmes/${newerYear}`" class="movies-year-jump__link">
              Ano mais recente: {{ newerYear }}
            </NuxtLink>
            <NuxtLink v-if="olderYear" :to="`/filmes/${olderYear}`" class="movies-year-jump__link">
              Ano anterior: {{ olderYear }}
            </NuxtLink>
            <span v-if="statsPending" class="movies-year-jump__loading">Atualizando estatísticas...</span>
          </div>
        </header>

        <YearMoviesFromApi :year="year" />
      </div>
    </main>
  </section>
</template>

<style scoped>
.movies-year-header {
  grid-column: 1 / span 12;
  display: grid;
  gap: 0.95rem;
  margin-bottom: 1.25rem;
}

.movies-year-header h1 {
  margin: 0 !important;
}

.movies-year-header__kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.movies-year-header__description {
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  line-height: 1.55;
  max-width: 70ch;
}

.movies-global-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
}

.movies-global-summary__item {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.78rem 0.88rem;
  display: grid;
  gap: 0.25rem;
}

.movies-global-summary__label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
}

.movies-global-summary__value {
  font-size: 1.15rem;
  color: var(--font-color);
}

.movies-years-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.movies-years-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  text-decoration: none;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.88);
  padding: 0.35rem 0.72rem;
  font-size: 0.88rem;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.movies-years-nav__count {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.64);
}

.movies-years-nav__link:hover {
  border-color: rgba(141, 181, 0, 0.68);
  color: var(--green);
}

.movies-years-nav__link--active {
  border-color: rgba(141, 181, 0, 0.75);
  background: rgba(141, 181, 0, 0.16);
  color: var(--font-color);
}

.movies-years-nav__link--active .movies-years-nav__count {
  color: rgba(255, 255, 255, 0.82);
}

.movies-year-jump {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}

.movies-year-jump__link {
  color: var(--font-color);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  padding-bottom: 0.08rem;
  font-size: 0.92rem;
}

.movies-year-jump__link:hover {
  color: var(--green);
  border-bottom-color: var(--green);
}

.movies-year-jump__loading {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.88rem;
}

@media (max-width: 600px) {
  .movies-global-summary {
    grid-template-columns: repeat(2, minmax(130px, 1fr));
  }

  .movies-years-nav__link {
    font-size: 0.84rem;
  }
}
</style>
