<script setup lang="ts">
useHead({
  script: [
    {
      src: 'https://isso.marcal.dev/js/embed.min.js',
      'data-isso': 'https://isso.marcal.dev/',
      'data-isso-avatar': 'true',
      'data-isso-page-author-hashes':  'c87cd8fc107c',
      'data-isso-vote': 'true',
      'data-isso-vote-levels': "-5,5"
    }
  ]
})
</script>

<template>
  <section class="article-comments gh-comments gh-canvas">
    <section id="isso-thread"></section>
  </section>
</template>

<style scoped>

</style>