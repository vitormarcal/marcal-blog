<script setup lang="ts">
import {formatDate} from "~/utils/date-utils";

const props = defineProps(['post'])

const formattedDate = computed(() => {
  return formatDate(props.post.created_at)
})
</script>

<template>
  <article>
    <NuxtLink :to="`${post['_path']}`">

      <h4>{{ post.title }}</h4>
      <time>{{ formattedDate }}</time>
      <p>
        {{ post.description }}
      </p>
    </NuxtLink>
  </article>
</template>

<style scoped>

a {
  text-decoration: none;

  p {
    color: var(--font-color);
  }
}

article {
  margin-top: 3rem;
}

time {
  font-size: 16px;
  color: hsla(0, 0%, 100%, .64);
}


</style>