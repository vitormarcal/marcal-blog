<script setup lang="ts">
definePageMeta({
  documentDriven: false,
  layout: 'slide-layout'
})

const route = useRoute()
const { stories, getBySlug } = useStoriesCatalog()
const storySlug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const story = computed(() => getBySlug(String(storySlug || '').trim()))
const currentIndex = computed(() => {
  if (!story.value) return -1
  return stories.findIndex((item) => item.slug === story.value?.slug)
})
const fromQuery = computed(() => {
  const raw = Array.isArray(route.query.from) ? route.query.from[0] : route.query.from
  return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : null
})
const nextStoryUrl = computed(() => {
  if (currentIndex.value < 0 || currentIndex.value >= stories.length - 1) return null
  const nextStory = stories[currentIndex.value + 1]
  if (!nextStory) return null
  const baseUrl = `/stories/${nextStory.slug}`
  if (!fromQuery.value) return baseUrl
  return `${baseUrl}?from=${encodeURIComponent(fromQuery.value)}`
})

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
  <StoryViewer
    v-if="story"
    :story="story"
    close-to="/"
    :next-story-url="nextStoryUrl || undefined"
  />
</template>
