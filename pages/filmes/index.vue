<script setup lang="ts">
import MoviesCatalog from '~/components/MoviesCatalog.vue'

definePageMeta({
  documentDriven: false
})

const title = 'Filmes assistidos'
const description = 'Veja os filmes que andei assistindo e abra os detalhes de cada um.'

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
        <MoviesCatalog />
      </div>
    </main>
  </section>
</template>
