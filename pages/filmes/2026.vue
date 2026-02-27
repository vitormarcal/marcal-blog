<script setup lang="ts">
import YearMoviesFromApi from '~/components/YearMoviesFromApi.vue'

definePageMeta({
  documentDriven: false
})

const title = 'Filmes de 2026'
const description = 'Acompanhe os filmes assistidos em 2026 e o que ainda falta assistir.'

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
        <YearMoviesFromApi :year="2026" />
      </div>
    </main>
  </section>
</template>

<style scoped>

</style>
