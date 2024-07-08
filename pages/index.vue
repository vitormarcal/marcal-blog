<script setup lang="ts">
const posts = await queryContent()
    .where({is_post: true, _partial: false})
    .sort({ created_at: -1})
    .limit(3)
    .without(['body'])
    .find()
</script>

<template>
  <div>
    <main-content path="/">
      <h3>Últimas publicações</h3>
      <template v-for="post in posts" :key="post['_id']">
        <post-item :post="post"/>
      </template>
      <NuxtLink to="/posts"> Publicações anteriores →</NuxtLink>
    </main-content>

  </div>
</template>

<style scoped>

</style>