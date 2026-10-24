<script setup lang="ts">
definePageMeta({
  alias: ['/posts']
})

const { page } = useContent()
const { isMinimalistaEscuro } = useVisualDesign()
const posts = await queryContent()
    .where({is_post: true, _partial: false})
    .sort({ created_at: -1})
    .without(['body'])
    .find()
</script>

<template>
  <div>
    <main-content :path="page.path">
      <div class="publications-list">
        <template v-for="post in posts" :key="post['_id']">
          <post-item :post="post" :show-image="!isMinimalistaEscuro" />
        </template>
      </div>
    </main-content>

  </div>
</template>

<style scoped>

</style>
