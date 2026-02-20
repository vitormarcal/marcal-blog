<script setup lang="ts">
import type { StoryItem } from '~/data/stories'

defineProps<{
  items: StoryItem[]
}>()
</script>

<template>
  <section class="story-rail" aria-labelledby="stories-title">
    <h3 id="stories-title">Stories</h3>
    <div class="story-rail__list" role="list">
      <NuxtLink
        v-for="story in items"
        :key="story.slug"
        :to="`/stories/${story.slug}?from=home`"
        class="story-rail__item"
        role="listitem"
        :aria-label="`Abrir story ${story.title}`"
      >
        <span class="story-rail__ring">
          <img :src="story.cover" :alt="`Capa do story ${story.title}`" />
        </span>
        <span class="story-rail__title">{{ story.title }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.story-rail {
  margin: 1.25rem 0 2rem;
}

.story-rail h3 {
  margin-bottom: 0.85rem;
}

.story-rail__list {
  display: flex;
  gap: 0.95rem;
  overflow-x: auto;
  padding-bottom: 0.4rem;
}

.story-rail__item {
  min-width: 84px;
  text-decoration: none;
  color: inherit;
}

.story-rail__ring {
  display: block;
  width: 74px;
  height: 74px;
  border-radius: 999px;
  padding: 3px;
  background: linear-gradient(135deg, #8db500, #d1ff57);
}

.story-rail__ring img {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
}

.story-rail__title {
  display: block;
  margin-top: 0.45rem;
  font-size: 0.8rem;
  text-align: center;
}
</style>

