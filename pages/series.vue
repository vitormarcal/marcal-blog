<script setup lang="ts">
import type { MediaPulseShowsStatsResponse } from '~/types/media-pulse-shows'

definePageMeta({
  documentDriven: false
})

const route = useRoute()
const { apiUrl } = useMediaPulseApi()

if (route.path === '/series') {
  let targetYear = new Date().getFullYear()

  try {
    const stats = await $fetch<MediaPulseShowsStatsResponse>(apiUrl('/api/shows/stats'))
    const latestYear = stats.years?.[0]?.year
    if (Number.isInteger(latestYear)) {
      targetYear = latestYear
    }
  } catch {
    // Fallback local when API is temporarily unavailable.
  }

  await navigateTo(`/series/${targetYear}`, { redirectCode: 301, replace: true })
}
</script>

<template>
  <NuxtPage />
</template>
