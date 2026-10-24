<script setup lang="ts">
import {formatDate} from "~/utils/date-utils";

const props = withDefaults(defineProps<{
  post: Record<string, any>
  showImage?: boolean
}>(), {
  showImage: false
})

const formattedDate = computed(() => {
  return formatDate(props.post.created_at)
})

const imageUrl = computed(() => {
  const image = typeof props.post.image === 'string' ? props.post.image.trim() : ''
  if (!image) return ''
  return /^(https?:\/\/|\/)/.test(image) ? image : `/${image}`
})
</script>

<template>
  <article class="post-item">
    <NuxtLink class="post-item__link" :class="{ 'post-item__link--with-image': showImage && imageUrl }" :to="post['_path']">
      <h4>{{ post.title }}</h4>
      <time>{{ formattedDate }}</time>
      <p>{{ post.description }}</p>
      <img v-if="showImage && imageUrl" class="post-item__image" :src="imageUrl" :alt="`Imagem de ${post.title}`" loading="lazy" />
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
