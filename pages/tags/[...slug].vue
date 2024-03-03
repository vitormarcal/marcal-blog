<script setup lang="ts">
const route = useRoute()
const tag = route.params.slug[0] || 'mdc'
const posts = await queryContent()
    .where({tags: {$contains: tag}, _partial: false})
    .sort({created_at: -1})
    .without(['body'])
    .find()

const tags = await queryContent()
    .where({tags: {$exists: true}, _partial: false})
    .sort({created_at: -1})
    .only(['tags'])
    .find()

const isMdc = computed(() => {
  return tag == 'mdc'
})

const grouped = computed(() => {

  const result: { [key: string]: number } = {};
  tags.forEach((item) => {
    item.tags.forEach((tag: string) => {
      result[tag] = (result[tag] || 0) + 1;
    });
  });
  return result;
})

</script>

<template>
  <div>
    <main-content :path="route.path">
      <div v-if="isMdc">
        <post-tags :grouped-tags="grouped"/>
      </div>


      <template v-for="post in posts" :key="post['_id']" v-else>
        <post-item :post="post"/>
      </template>
    </main-content>

  </div>
</template>

<style scoped>

</style>