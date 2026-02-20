<script setup lang="ts">
const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  title?: string
}>(), {
  src: '',
  alt: '',
  title: ''
})

const imageSrc = computed(() => props.src || '')
const imageAlt = computed(() => props.alt || props.title || 'Imagem do post')
const expandLabel = computed(() => `Expandir imagem: ${imageAlt.value}`)
const route = useRoute()
const galleryId = computed(() => `post-markdown-images-${route.path}`)
</script>

<template>
  <figure v-if="imageSrc" class="prose-expandable-image">
    <ExpandableImage
      :src="imageSrc"
      :alt="imageAlt"
      :expand-label="expandLabel"
      :gallery="galleryId"
      thumb-width="100%"
      thumb-height="auto"
      thumb-radius="8px"
      thumb-fit="contain"
      max-lightbox-width="1200px"
      trigger-width="100%"
      loading="lazy"
    />

    <figcaption v-if="title" class="prose-expandable-image__caption">
      {{ title }}
    </figcaption>
  </figure>
</template>

<style scoped>
.prose-expandable-image {
  margin: 1.2rem 0;
}

.prose-expandable-image__caption {
  margin-top: 0.5rem;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.72);
}
</style>
