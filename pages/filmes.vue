<script setup lang="ts">
import type { MediaPulseMoviesStatsResponse } from '~/types/media-pulse-movies'

definePageMeta({
  documentDriven: false
})

const route = useRoute()
const { apiUrl } = useMediaPulseApi()

if (route.path === '/filmes') {
  let targetYear = new Date().getFullYear()

  try {
    const stats = await $fetch<MediaPulseMoviesStatsResponse>(apiUrl('/api/movies/stats'))
    const latestYear = stats.years?.[0]?.year
    if (Number.isInteger(latestYear)) {
      targetYear = latestYear
    }
  } catch {
    // Fallback local when API is temporarily unavailable.
  }

  await navigateTo(`/filmes/${targetYear}`, { redirectCode: 301, replace: true })
}
</script>

<template>
  <NuxtPage />
</template>
