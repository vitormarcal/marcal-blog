<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  expandLabel?: string
  loading?: 'lazy' | 'eager'
  thumbWidth?: string
  thumbHeight?: string
  mobileThumbWidth?: string
  mobileThumbHeight?: string
  thumbRadius?: string
  maxLightboxWidth?: string
  triggerWidth?: string
  triggerHeight?: string
  thumbFit?: 'cover' | 'contain'
  gallery?: string
  showCounter?: boolean
}>(), {
  expandLabel: 'Expandir imagem',
  loading: 'lazy',
  thumbWidth: '68px',
  thumbHeight: '102px',
  thumbRadius: '10px',
  maxLightboxWidth: '1100px',
  triggerWidth: 'fit-content',
  triggerHeight: 'fit-content',
  thumbFit: 'cover',
  gallery: '',
  showCounter: true
})

const isExpanded = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)
const galleryItems = ref<Array<{ src: string, alt: string }>>([])
const galleryIndex = ref(0)
let touchStartX = 0
let touchStartY = 0
let hasTouchStarted = false

const thumbStyle = computed(() => ({
  '--thumb-width': props.thumbWidth,
  '--thumb-height': props.thumbHeight,
  '--thumb-width-mobile': props.mobileThumbWidth || props.thumbWidth,
  '--thumb-height-mobile': props.mobileThumbHeight || props.thumbHeight,
  '--thumb-radius': props.thumbRadius,
  '--thumb-fit': props.thumbFit,
  '--trigger-width': props.triggerWidth,
  '--trigger-height': props.triggerHeight
}))

const lightboxImageStyle = computed(() => ({
  '--lightbox-max-width': props.maxLightboxWidth
}))

const hasGallery = computed(() => Boolean(props.gallery))
const hasGalleryNavigation = computed(() => galleryItems.value.length > 1)
const currentItem = computed(() => galleryItems.value[galleryIndex.value] || { src: props.src, alt: props.alt })

const syncGallery = () => {
  if (!import.meta.client || !hasGallery.value) {
    galleryItems.value = [{ src: props.src, alt: props.alt }]
    galleryIndex.value = 0
    return
  }

  const group = CSS.escape(props.gallery)
  const elements = Array.from(
    document.querySelectorAll<HTMLButtonElement>(`button[data-expand-group="${group}"]`)
  )

  const items = elements
    .map((element) => ({
      src: element.dataset.expandSrc || '',
      alt: element.dataset.expandAlt || 'Imagem'
    }))
    .filter((item) => item.src)

  galleryItems.value = items.length ? items : [{ src: props.src, alt: props.alt }]

  const triggerIndex = elements.findIndex((element) => element === triggerRef.value)
  if (triggerIndex >= 0 && triggerIndex < galleryItems.value.length) {
    galleryIndex.value = triggerIndex
    return
  }

  galleryIndex.value = Math.max(0, galleryItems.value.findIndex((item) => item.src === props.src))
}

const goNext = () => {
  if (!hasGalleryNavigation.value) return
  galleryIndex.value = (galleryIndex.value + 1) % galleryItems.value.length
}

const goPrevious = () => {
  if (!hasGalleryNavigation.value) return
  galleryIndex.value = (galleryIndex.value - 1 + galleryItems.value.length) % galleryItems.value.length
}

const onTouchStart = (event: TouchEvent) => {
  if (!hasGalleryNavigation.value) return

  const touch = event.changedTouches?.[0]
  if (!touch) return

  touchStartX = touch.clientX
  touchStartY = touch.clientY
  hasTouchStarted = true
}

const onTouchEnd = (event: TouchEvent) => {
  if (!hasGalleryNavigation.value || !hasTouchStarted) return

  const touch = event.changedTouches?.[0]
  hasTouchStarted = false
  if (!touch) return

  const deltaX = touch.clientX - touchStartX
  const deltaY = touch.clientY - touchStartY
  const threshold = 32

  if (Math.abs(deltaX) < threshold || Math.abs(deltaX) <= Math.abs(deltaY)) return

  if (deltaX < 0) {
    goNext()
    return
  }

  goPrevious()
}

const open = () => {
  if (!props.src) return
  syncGallery()
  isExpanded.value = true
}

const close = () => {
  isExpanded.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    goNext()
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    goPrevious()
  }
}

watch(isExpanded, (value) => {
  if (!import.meta.client) return

  if (value) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeydown)
    return
  }

  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <button
    ref="triggerRef"
    type="button"
    class="expandable-image__trigger"
    :aria-label="expandLabel"
    :style="thumbStyle"
    :data-expand-group="gallery || null"
    :data-expand-src="src"
    :data-expand-alt="alt"
    @click="open"
  >
    <img
      :src="src"
      :alt="alt"
      :loading="loading"
      class="expandable-image__thumb"
    />
  </button>

  <Transition name="expandable-image-fade">
    <div
      v-if="isExpanded"
      class="expandable-image__lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="alt"
      @click.self="close"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancel="hasTouchStarted = false"
    >
      <button
        type="button"
        class="expandable-image__close"
        aria-label="Fechar imagem ampliada"
        @click="close"
      >
        Fechar
      </button>
      <img
        :src="currentItem.src"
        :alt="currentItem.alt"
        :style="lightboxImageStyle"
        class="expandable-image__lightbox-image"
      />
      <button
        v-if="hasGalleryNavigation"
        type="button"
        class="expandable-image__nav expandable-image__nav--prev"
        aria-label="Imagem anterior"
        @click.stop="goPrevious"
      >
        ‹
      </button>
      <button
        v-if="hasGalleryNavigation"
        type="button"
        class="expandable-image__nav expandable-image__nav--next"
        aria-label="Próxima imagem"
        @click.stop="goNext"
      >
        ›
      </button>
      <p
        v-if="showCounter && hasGalleryNavigation"
        class="expandable-image__counter"
        aria-live="polite"
      >
        {{ galleryIndex + 1 }}/{{ galleryItems.length }}
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.expandable-image__trigger {
  padding: 0;
  border: 0;
  background: transparent;
  width: var(--trigger-width, fit-content);
  height: var(--trigger-height, fit-content);
  line-height: 0;
  border-radius: calc(var(--thumb-radius, 10px) + 2px);
  cursor: zoom-in;
  transition: transform 0.18s ease;
}

.expandable-image__trigger:hover {
  transform: translateY(-2px);
}

.expandable-image__trigger:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 2px;
}

.expandable-image__thumb {
  width: var(--thumb-width, 68px);
  height: var(--thumb-height, 102px);
  object-fit: var(--thumb-fit, cover);
  border-radius: var(--thumb-radius, 10px);
  background: #efefef;
}

.expandable-image__lightbox {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.82);
  backdrop-filter: blur(3px);
  padding: 1rem;
}

.expandable-image__lightbox-image {
  max-width: min(var(--lightbox-max-width, 1100px), 94vw);
  max-height: 88vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);
}

.expandable-image__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 0.5rem 0.95rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.expandable-image__counter {
  position: absolute;
  top: 1rem;
  left: 1rem;
  margin: 0;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 0.4rem 0.8rem;
  font-size: 0.84rem;
}

.expandable-image__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.62);
  color: #fff;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
}

.expandable-image__nav--prev {
  left: 1rem;
}

.expandable-image__nav--next {
  right: 1rem;
}

.expandable-image__nav:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 2px;
}

.expandable-image-fade-enter-active,
.expandable-image-fade-leave-active {
  transition: opacity 0.2s ease;
}

.expandable-image-fade-enter-from,
.expandable-image-fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .expandable-image__thumb {
    width: var(--thumb-width-mobile, var(--thumb-width, 68px));
    height: var(--thumb-height-mobile, var(--thumb-height, 102px));
  }

  .expandable-image__nav {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1.45rem;
  }
}
</style>
