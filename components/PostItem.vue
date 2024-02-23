<script setup lang="ts">
import {formatDate} from "~/utils/date-utils";

const props = defineProps(['post'])

const formattedDate = computed(() => {
  return formatDate(props.post.created_at)
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