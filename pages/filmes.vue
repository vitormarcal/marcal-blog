<script setup lang="ts">
definePageMeta({
  documentDriven: false
})

const route = useRoute()

if (route.path === '/filmes') {
  await navigateTo('/filmes/2026', { redirectCode: 301, replace: true })
}
</script>

<template>
  <NuxtPage />
</template>
