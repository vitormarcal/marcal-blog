<script setup lang="ts">
const props = defineProps(['post'])

const formattedDate = computed(() => {
  return new Date(props.post.created_at).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})
</script>

<template>
  <article>
    <a :href="`${post['_path']}`">

      <h4>{{ post.title }}</h4>
      <time>{{ formattedDate }}</time>
      <p>
        {{ post.description }}
      </p>
    </a>
  </article>
</template>

<style scoped>

a {
  color: #fff;
  text-decoration: none;
}

article {
  margin-bottom: 2rem;
}

time {
  font-size: 16px;
  color: hsla(0, 0%, 100%, .64);
}


</style>