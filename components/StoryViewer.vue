<script setup lang="ts">
import type { StoryItem } from '~/data/stories'

const props = withDefaults(defineProps<{
  story: StoryItem
  closeTo?: string
}>(), {
  closeTo: '/'
})

const current = ref(0)

const activeSlide = computed(() => props.story.slides[current.value])

const next = () => {
  if (!props.story.slides.length) return
  current.value = Math.min(current.value + 1, props.story.slides.length - 1)
}

const previous = () => {
  if (!props.story.slides.length) return
  current.value = Math.max(current.value - 1, 0)
}

const close = async () => {
  await navigateTo(props.closeTo)
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }
  if (event.key === 'ArrowRight' || event.key === ' ') {
    event.preventDefault()
    next()
    return
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    previous()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <section class="story-viewer">
    <header class="story-viewer__top">
      <div class="story-viewer__progress" aria-hidden="true">
        <span
          v-for="(_, idx) in story.slides"
          :key="`${story.slug}-${idx}`"
          :class="{ active: idx <= current }"
        />
      </div>
      <button type="button" class="story-viewer__close" aria-label="Fechar stories" @click="close">
        Fechar
      </button>
    </header>

    <article
      v-if="activeSlide"
      class="story-viewer__frame"
      :style="{ backgroundImage: `url(${activeSlide.image})` }"
      :aria-label="`${story.title}: slide ${current + 1} de ${story.slides.length}`"
    >
      <button
        type="button"
        class="story-viewer__nav story-viewer__nav--left"
        aria-label="Slide anterior"
        @click="previous"
      />
      <button
        type="button"
        class="story-viewer__nav story-viewer__nav--right"
        aria-label="Próximo slide"
        @click="next"
      />

      <div class="story-viewer__caption">
        <p>
          <strong>{{ activeSlide.strong }}</strong>
          {{ activeSlide.text }}
        </p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.story-viewer {
  width: min(100%, var(--frame-max-width));
}

.story-viewer__top {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
  right: 0.8rem;
  z-index: 3;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.story-viewer__progress {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8px, 1fr));
  gap: 0.3rem;
  flex: 1;
}

.story-viewer__progress span {
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4);
}

.story-viewer__progress span.active {
  background: #fff;
}

.story-viewer__close {
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: #fff;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 999px;
  padding: 0.2rem 0.75rem;
  cursor: pointer;
  font-size: 0.8rem;
}

.story-viewer__frame {
  position: relative;
  min-height: var(--frame-height);
  background-size: cover;
  background-position: center;
  border: var(--frame-border);
  overflow: hidden;
}

.story-viewer__nav {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  z-index: 1;
  cursor: pointer;
}

.story-viewer__nav--left {
  left: 0;
}

.story-viewer__nav--right {
  right: 0;
}

.story-viewer__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 20px;
  background: var(--frame-bg);
  backdrop-filter: var(--frame-blur);
}

.story-viewer__caption p {
  margin: 0;
}

.story-viewer__caption strong {
  font-size: 30px;
}
</style>

