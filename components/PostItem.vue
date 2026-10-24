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

const imageFailed = ref(false)

const imageUrl = computed(() => {
  const image = typeof props.post.image === 'string' ? props.post.image.trim() : ''
  if (!image) return ''
  if (/^https?:\/\//i.test(image)) return image
  return `/${image.replace(/^\/+/, '').replace(/\/+/g, '/')}`
})

const categoryLabel = computed(() => {
  const tag = Array.isArray(props.post.tags) ? props.post.tags[0] : ''
  return typeof tag === 'string' && tag.trim() ? tag.replaceAll('-', ' ') : 'Fanzine pessoal'
})
</script>

<template>
  <article class="post-item">
    <NuxtLink class="post-item__link" :class="{ 'post-item__link--fanzine': showImage, 'post-item__link--with-image': showImage && imageUrl && !imageFailed }" :to="post['_path']">
      <div v-if="showImage" class="post-item__meta">
        <span><i aria-hidden="true">✳</i> {{ categoryLabel }}</span>
        <time :datetime="post.created_at">{{ formattedDate }}</time>
      </div>
      <time v-else>{{ formattedDate }}</time>
      <h4>{{ post.title }}</h4>
      <p>{{ post.description }}</p>
      <img v-if="showImage && imageUrl && !imageFailed" class="post-item__image" :src="imageUrl" :alt="`Imagem de ${post.title}`" loading="lazy" @error="imageFailed = true" />
      <span v-if="showImage" class="post-item__read">Abrir anotação <span aria-hidden="true">↗</span></span>
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
