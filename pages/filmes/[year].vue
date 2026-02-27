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

const { data: moviesStats } = useAsyncData(
  'movies-stats-years',
  () => $fetch<MediaPulseMoviesStatsResponse>(apiUrl('/api/movies/stats')),
  {
    server: false
  }
)

const yearLinks = computed(() => {
  const yearsFromApi = (moviesStats.value?.years || [])
    .map((item) => item.year)
    .filter((value) => Number.isInteger(value) && value >= 1900 && value <= currentYear)

  const merged = Array.from(new Set([...yearsFromApi, year]))
  return merged.sort((a, b) => b - a)
})

const totalStats = computed(() => moviesStats.value?.total || null)
const globalUnwatchedCount = computed(() => moviesStats.value?.unwatchedCount ?? null)

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
        <section v-if="totalStats" class="movies-global-summary" aria-label="Resumo geral da filmoteca">
          <div class="movies-global-summary__item">
            <span class="movies-global-summary__label">Sessões totais</span>
            <strong class="movies-global-summary__value">{{ totalStats.watchesCount }}</strong>
          </div>
          <div class="movies-global-summary__item">
            <span class="movies-global-summary__label">Filmes únicos</span>
            <strong class="movies-global-summary__value">{{ totalStats.uniqueMoviesCount }}</strong>
          </div>
          <div class="movies-global-summary__item">
            <span class="movies-global-summary__label">Ainda não assistidos</span>
            <strong class="movies-global-summary__value">{{ globalUnwatchedCount ?? 0 }}</strong>
          </div>
        </section>

        <nav class="movies-years-nav" aria-label="Selecionar ano de filmes">
          <NuxtLink
            v-for="yearLink in yearLinks"
            :key="yearLink"
            :to="`/filmes/${yearLink}`"
            :class="['movies-years-nav__link', { 'movies-years-nav__link--active': yearLink === year }]"
            :aria-current="yearLink === year ? 'page' : undefined"
          >
            {{ yearLink }}
          </NuxtLink>
        </nav>
        <YearMoviesFromApi :year="year" />
      </div>
    </main>
  </section>
</template>

<style scoped>
.movies-global-summary {
  grid-column: 1 / span 12;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.movies-global-summary__item {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.55);
  padding: 0.7rem 0.8rem;
  display: grid;
  gap: 0.2rem;
}

.movies-global-summary__label {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.68);
}

.movies-global-summary__value {
  font-size: 1.03rem;
  color: var(--font-color);
}

.movies-years-nav {
  grid-column: 1 / span 12;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-bottom: 0.85rem;
}

.movies-years-nav__link {
  text-decoration: none;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(0, 0, 0, 0.62);
  color: rgba(255, 255, 255, 0.88);
  padding: 0.35rem 0.76rem;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.movies-years-nav__link:hover {
  border-color: rgba(141, 181, 0, 0.68);
  color: var(--green);
  transform: translateY(-1px);
}

.movies-years-nav__link--active {
  border-color: rgba(141, 181, 0, 0.75);
  background: rgba(141, 181, 0, 0.2);
  color: var(--font-color);
}

</style>
