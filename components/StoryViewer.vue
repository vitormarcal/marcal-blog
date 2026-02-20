<script setup lang="ts">
import type { StoryItem } from '~/types/story'

const props = withDefaults(defineProps<{
  story: StoryItem
  closeTo?: string
  autoPlay?: boolean
  autoPlayMs?: number
}>(), {
  closeTo: '/',
  autoPlay: true,
  autoPlayMs: 4500
})

const route = useRoute()
const router = useRouter()
const current = ref(0)
const isPaused = ref(false)
const isImageExpanded = ref(false)
const progressPct = ref(0)
const remainingMs = ref(props.autoPlayMs)
let autoplayTimer: ReturnType<typeof setTimeout> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null
let tickStartedAt: number | null = null
let touchStartX = 0
let touchStartY = 0
let hasTouchStarted = false

const activeSlide = computed(() => props.story.slides[current.value])
const isLastSlide = computed(() => current.value >= props.story.slides.length - 1)
const hasSlides = computed(() => props.story.slides.length > 0)

const clampIndex = (idx: number) => {
  if (!hasSlides.value) return 0
  return Math.min(Math.max(idx, 0), props.story.slides.length - 1)
}

const indexFromQuerySlide = (value: unknown) => {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)
  if (!Number.isInteger(parsed)) return null
  if (parsed < 1) return 0
  return clampIndex(parsed - 1)
}

const setCurrent = (idx: number) => {
  current.value = clampIndex(idx)
}

const next = () => {
  if (!hasSlides.value) return
  setCurrent(current.value + 1)
}

const previous = () => {
  if (!hasSlides.value) return
  setCurrent(current.value - 1)
}

const close = async () => {
  await navigateTo(props.closeTo)
}

const openExpandedImage = () => {
  isImageExpanded.value = true
  pauseAutoplay()
}

const closeExpandedImage = () => {
  isImageExpanded.value = false
  resumeAutoplay()
}

const clearAutoplay = () => {
  if (autoplayTimer) {
    clearTimeout(autoplayTimer)
    autoplayTimer = null
  }
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
  tickStartedAt = null
}

const applyElapsed = () => {
  if (tickStartedAt === null) return
  const now = Date.now()
  const elapsed = Math.max(0, now - tickStartedAt)
  tickStartedAt = now
  remainingMs.value = Math.max(0, remainingMs.value - elapsed)
  progressPct.value = Math.min(100, ((props.autoPlayMs - remainingMs.value) / props.autoPlayMs) * 100)
}

const resetProgress = () => {
  remainingMs.value = props.autoPlayMs
  progressPct.value = isLastSlide.value ? 100 : 0
}

const scheduleAutoplay = () => {
  if (!props.autoPlay) return
  if (isImageExpanded.value) return
  if (isPaused.value) return
  if (!hasSlides.value) return
  if (isLastSlide.value) return
  if (remainingMs.value <= 0) return

  clearAutoplay()
  tickStartedAt = Date.now()
  autoplayTimer = setTimeout(() => {
    next()
  }, remainingMs.value)

  progressTimer = setInterval(() => {
    applyElapsed()
  }, 50)
}

const pauseAutoplay = () => {
  if (isPaused.value) return
  applyElapsed()
  isPaused.value = true
  clearAutoplay()
}

const resumeAutoplay = () => {
  if (isImageExpanded.value) return
  isPaused.value = false
  scheduleAutoplay()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    if (isImageExpanded.value) {
      closeExpandedImage()
      return
    }
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

const progressWidth = (idx: number) => {
  if (idx < current.value) return 100
  if (idx > current.value) return 0
  return progressPct.value
}

const syncSlideFromQuery = () => {
  const idx = indexFromQuerySlide(route.query.slide)
  if (idx === null) return
  if (idx === current.value) return
  setCurrent(idx)
}

const syncQueryFromSlide = () => {
  const nextSlide = String(current.value + 1)
  const currentQuerySlide = Array.isArray(route.query.slide) ? route.query.slide[0] : route.query.slide
  if (currentQuerySlide === nextSlide) return

  router.replace({
    query: {
      ...route.query,
      slide: nextSlide
    }
  })
}

const onTouchStart = (event: TouchEvent) => {
  pauseAutoplay()
  const touch = event.changedTouches?.[0]
  if (!touch) return
  hasTouchStarted = true
  touchStartX = touch.clientX
  touchStartY = touch.clientY
}

const onTouchEnd = (event: TouchEvent) => {
  const touch = event.changedTouches?.[0]
  if (!touch || !hasTouchStarted) {
    resumeAutoplay()
    return
  }

  const diffX = touch.clientX - touchStartX
  const diffY = touch.clientY - touchStartY
  const absX = Math.abs(diffX)
  const absY = Math.abs(diffY)

  if (absX > 36 && absX > absY) {
    if (diffX < 0) {
      next()
    } else {
      previous()
    }
  }

  hasTouchStarted = false
  resumeAutoplay()
}

const onTouchCancel = () => {
  hasTouchStarted = false
  resumeAutoplay()
}

const onVisibilityChange = () => {
  if (document.hidden) {
    pauseAutoplay()
    return
  }
  resumeAutoplay()
}

watch(isImageExpanded, (value) => {
  if (!import.meta.client) return
  document.body.style.overflow = value ? 'hidden' : ''
})

onMounted(() => {
  syncSlideFromQuery()
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('visibilitychange', onVisibilityChange)
  resetProgress()
  scheduleAutoplay()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  clearAutoplay()
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

watch(current, () => {
  syncQueryFromSlide()
  clearAutoplay()
  resetProgress()
  scheduleAutoplay()
})

watch(() => route.query.slide, () => {
  syncSlideFromQuery()
})
</script>

<template>
  <section class="story-viewer">
    <header class="story-viewer__top">
      <div class="story-viewer__progress" aria-hidden="true">
        <span
          v-for="(_, idx) in story.slides"
          :key="`${story.slug}-${idx}`"
          class="story-viewer__progress-track"
        >
          <span class="story-viewer__progress-fill" :style="{ width: `${progressWidth(idx)}%` }" />
        </span>
      </div>
      <button type="button" class="story-viewer__close" aria-label="Fechar stories" @click="close">
        Fechar
      </button>
    </header>

    <article
      v-if="activeSlide"
      class="story-viewer__frame"
      :aria-label="`${story.title}: slide ${current + 1} de ${story.slides.length}`"
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancel="onTouchCancel"
    >
      <img
        :src="activeSlide.image"
        :alt="activeSlide.strong"
        class="story-viewer__image"
      />

      <button
        type="button"
        class="story-viewer__expand"
        aria-label="Expandir imagem do slide"
        @click.stop="openExpandedImage"
      >
        Expandir
      </button>

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
        <NuxtLink
          v-if="story.sourcePost"
          class="story-viewer__source-link"
          :to="story.sourcePost.url"
          :aria-label="`Abrir post ${story.sourcePost.title}`"
        >
          Ver post completo: {{ story.sourcePost.title }}
        </NuxtLink>
      </div>
    </article>

    <Transition name="story-viewer-modal-fade">
      <div
        v-if="activeSlide && isImageExpanded"
        class="story-viewer__modal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Imagem ampliada do slide ${current + 1}`"
        @click.self="closeExpandedImage"
      >
        <button
          type="button"
          class="story-viewer__modal-close"
          aria-label="Fechar imagem ampliada"
          @click="closeExpandedImage"
        >
          Fechar
        </button>
        <img
          :src="activeSlide.image"
          :alt="activeSlide.strong"
          class="story-viewer__modal-image"
        />
      </div>
    </Transition>
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

.story-viewer__progress-track {
  position: relative;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4);
  overflow: hidden;
}

.story-viewer__progress-fill {
  display: block;
  height: 100%;
  width: 0%;
  border-radius: inherit;
  background: #fff;
  transition: width 0.08s linear;
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
  border: var(--frame-border);
  overflow: hidden;
  background: #000;
}

.story-viewer__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.story-viewer__expand {
  position: absolute;
  top: 3rem;
  right: 0.75rem;
  z-index: 3;
  border: 1px solid rgba(255, 255, 255, 0.7);
  color: #fff;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 999px;
  padding: 0.2rem 0.75rem;
  cursor: pointer;
  font-size: 0.8rem;
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

.story-viewer__source-link {
  display: inline-flex;
  margin-top: 0.55rem;
  font-size: 0.86rem;
  line-height: 1.2;
  color: inherit;
  text-decoration: underline;
}

.story-viewer__modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.88);
  padding: 1rem;
}

.story-viewer__modal-image {
  max-width: 96vw;
  max-height: 92vh;
  width: auto;
  height: auto;
  object-fit: contain;
}

.story-viewer__modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.75);
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  cursor: pointer;
  font-size: 0.84rem;
}

.story-viewer-modal-fade-enter-active,
.story-viewer-modal-fade-leave-active {
  transition: opacity 0.18s ease;
}

.story-viewer-modal-fade-enter-from,
.story-viewer-modal-fade-leave-to {
  opacity: 0;
}
</style>
