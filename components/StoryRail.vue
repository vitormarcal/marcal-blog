<script setup lang="ts">
import type { StoryItem } from '~/types/story'

withDefaults(defineProps<{
  items: StoryItem[]
  placement?: 'inline' | 'sidebar'
}>(), { placement: 'inline' })
</script>

<template>
  <section class="story-rail" :class="`story-rail--${placement}`" aria-labelledby="stories-title">
    <h3 id="stories-title">Destaques</h3>
    <div class="story-rail__list" role="list">
      <NuxtLink
        v-for="story in items"
        :key="story.slug"
        :to="`/stories/${story.slug}?from=home`"
        class="story-rail__item"
        role="listitem"
        :aria-label="`Abrir story ${story.title}`"
        :style="{
          '--story-ring-start': story.theme?.ringStart || '#8db500',
          '--story-ring-end': story.theme?.ringEnd || '#d1ff57'
        }"
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
  width: 96px;
  min-width: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.story-rail__ring {
  display: block;
  width: 74px;
  height: 74px;
  border-radius: 999px;
  padding: 3px;
  background: linear-gradient(135deg, var(--story-ring-start), var(--story-ring-end));
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
  width: 100%;
  line-height: 1.2;
  text-wrap: balance;
}

.story-rail--sidebar {
  grid-column: 1 / -1;
  margin: 12px 0 13px;
  padding: 11px 0 8px;
  border-top: 1px solid #394448;
  border-bottom: 1px solid #394448;
}

.story-rail--sidebar h3 {
  margin: 0 0 9px;
  color: #e6f066;
  font: 9px ui-monospace, SFMono-Regular, Consolas, monospace;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.story-rail--sidebar .story-rail__list {
  gap: 10px;
  padding: 0 0 3px;
}

.story-rail--sidebar .story-rail__item {
  width: 80px;
  min-width: 80px;
}

.story-rail--sidebar .story-rail__ring {
  width: 58px;
  height: 58px;
}

.story-rail--sidebar .story-rail__title {
  margin-top: 5px;
  color: #b9c2b9;
  font: 10px/1.2 Arial, sans-serif;
}
</style>
