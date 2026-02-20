<script setup lang="ts">
definePageMeta({
  documentDriven: false,
  layout: 'slide-layout'
})

const route = useRoute()
const { getBySlug } = useStoriesCatalog()
const storySlug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const story = computed(() => getBySlug(String(storySlug || '').trim()))

if (!story.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Story não encontrado'
  })
}

const title = computed(() => `${story.value?.title || 'Story'} | Stories`)
const description = computed(() => story.value?.subtitle || 'Story visual')

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <StoryViewer v-if="story" :story="story" close-to="/" />
</template>
