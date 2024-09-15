<script setup lang="ts">
const { page } = useContent()
const posts = await queryContent()
    .where({is_post: true, _partial: false})
    .sort({ created_at: -1})
    .without(['body'])
    .find()
</script>

<template>
  <div>
    <main-content :path="page.path">
      <template v-for="post in posts" :key="post['_id']">
        <post-item :post="post"/>
      </template>
    </main-content>

  </div>
</template>

<style scoped>

</style>