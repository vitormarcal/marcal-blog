<script setup lang="ts">
import YearMoviesFromApi from '~/components/YearMoviesFromApi.vue'
import type { MediaPulseMoviesStatsResponse } from '~/types/media-pulse-movies'

definePageMeta({
  documentDriven: false
})

const route = useRoute()
const { apiUrl } = useMediaPulseApi()
const { isMinimalistaEscuro } = useVisualDesign()
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
          <p class="movies-year-header__kicker">{{ isMinimalistaEscuro ? 'Filmes' : `Caderno de cinema · ${year}` }}</p>
          <h1>{{ isMinimalistaEscuro ? `Visão de ${year}` : `Meu cinema em ${year}` }}</h1>
          <p class="movies-year-header__description">
            {{ isMinimalistaEscuro ? 'Um painel anual com assistidos, pendentes e acesso rápido para os detalhes de cada filme.' : 'Filmes que assisti, revi e deixei na fila.' }}
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
              <span class="movies-global-summary__label">{{ isMinimalistaEscuro ? 'Pendentes na biblioteca' : 'Na fila' }}</span>
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

<style scoped src="~/assets/css/media/catalog-header.css"></style>
