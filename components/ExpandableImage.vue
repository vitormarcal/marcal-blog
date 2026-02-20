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
}>(), {
  expandLabel: 'Expandir imagem',
  loading: 'lazy',
  thumbWidth: '68px',
  thumbHeight: '102px',
  thumbRadius: '10px',
  maxLightboxWidth: '1100px'
})

const isExpanded = ref(false)

const thumbStyle = computed(() => ({
  '--thumb-width': props.thumbWidth,
  '--thumb-height': props.thumbHeight,
  '--thumb-width-mobile': props.mobileThumbWidth || props.thumbWidth,
  '--thumb-height-mobile': props.mobileThumbHeight || props.thumbHeight,
  '--thumb-radius': props.thumbRadius
}))

const lightboxImageStyle = computed(() => ({
  '--lightbox-max-width': props.maxLightboxWidth
}))

const open = () => {
  if (!props.src) return
  isExpanded.value = true
}

const close = () => {
  isExpanded.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
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
    type="button"
    class="expandable-image__trigger"
    :aria-label="expandLabel"
    :style="thumbStyle"
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
        :src="src"
        :alt="alt"
        :style="lightboxImageStyle"
        class="expandable-image__lightbox-image"
      />
    </div>
  </Transition>
</template>

<style scoped>
.expandable-image__trigger {
  padding: 0;
  border: 0;
  background: transparent;
  width: fit-content;
  height: fit-content;
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
  object-fit: cover;
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
}
</style>
