<script setup lang="ts">
type ArtworkCard = {
  id: number
  title: string
  artist?: { name?: string | null } | null
  year?: number | null
  type?: string | null
  imageUrl?: string | null
}
type ArtworkPage = { items: ArtworkCard[] }

const route = useRoute()
const { apiUrl, assetUrl } = useMediaPulseApi()
const { data } = await useAsyncData('media-pulse-artworks-sidebar', () =>
  $fetch<ArtworkPage>(apiUrl('/api/artworks?limit=24&sort=recent')).catch(() => ({ items: [] })),
  { server: false }
)

const fallbacks: ArtworkCard[] = [
  { id: 0, title: 'Judith I', artist: { name: 'Gustav Klimt' }, year: 1901, imageUrl: 'https://visu.marcal.dev/shared-images/RjYaeJi2F4ImgalM18ity_vjF64iTDMfVvfSh-dWxoU' },
  { id: 0, title: 'Adele Bloch-Bauer I', artist: { name: 'Gustav Klimt' }, year: 1907, imageUrl: 'https://visu.marcal.dev/shared-images/qTbWWmLJ9fJJBZhbPw9YuGcMtk-cNU79oQn8fifWe7Q' },
  { id: 0, title: 'Danaë', artist: { name: 'Gustav Klimt' }, year: 1907, imageUrl: 'https://visu.marcal.dev/shared-images/VRD6_RbdhlZOw5nzUi8WEJ6U3GG2awZgurE8W4XHQ54' },
  { id: 0, title: 'Serpentes d’água II', artist: { name: 'Gustav Klimt' }, year: 1907, imageUrl: 'https://visu.marcal.dev/shared-images/w1k0KRbkm0Wr_Oq5hHIbjiCnBLPHcJ7kYeUd3E-W-T8' },
  { id: 0, title: 'Retrato de Mada', artist: { name: 'Gustav Klimt' }, year: 1916, imageUrl: 'https://visu.marcal.dev/shared-images/HDrAr_-xt5gsh0LyfkSv5Q8nRSYqFik5OqxUutP9wf0' }
]
const artworks = computed(() => {
  const withImages = (data.value?.items || []).filter((artwork) => artwork.imageUrl)
  return withImages.length ? withImages : fallbacks
})
const artworkIndex = ref(0)
const isPaused = ref(false)
const manuallyPaused = ref(false)
const isLoading = ref(false)
const imageReady = ref(false)
let rotationTimer: ReturnType<typeof setInterval> | undefined

function nextArtwork() {
  const count = artworks.value.length
  if (count < 2 || isLoading.value) return
  const current = artworkIndex.value % count
  artworkIndex.value = (current + 1) % count
}

function moveArtwork(direction: number) {
  manuallyPaused.value = true
  const count = artworks.value.length
  if (count < 2 || isLoading.value) return
  artworkIndex.value = (displayedIndex.value + direction + count) % count
}

onMounted(() => {
  watch(selectedArtwork, async (candidate, _previous, onCleanup) => {
    let cancelled = false
    onCleanup(() => { cancelled = true })
    isLoading.value = true
    const image = new Image()
    image.src = resolveArtworkSrc(candidate)
    try {
      // decode() waits for both download and decoding before the fade starts.
      await image.decode()
      if (cancelled) return
      artwork.value = candidate
      displayedIndex.value = artworkIndex.value
      imageReady.value = true
    } catch {
      // Keep the current artwork visible if the next image cannot be loaded.
    } finally {
      if (!cancelled) isLoading.value = false
    }
  }, { immediate: true })
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  rotationTimer = setInterval(() => {
    if (!isPaused.value && !manuallyPaused.value && !document.hidden && !reducedMotion.matches) nextArtwork()
  }, 7000)
})
onBeforeUnmount(() => clearInterval(rotationTimer))
watch(() => route.path, (path, previousPath) => {
  if (previousPath) {
    nextArtwork()
    return
  }
  artworkIndex.value = [...(path || '/')].reduce((value, char) => value + char.charCodeAt(0), 0) % artworks.value.length
}, { immediate: true })
const selectedArtwork = computed(() => artworks.value[artworkIndex.value % artworks.value.length] || fallbacks[0])
const artwork = shallowRef(selectedArtwork.value)
const displayedIndex = ref(artworkIndex.value)
const resolveArtworkSrc = (item: ArtworkCard) => item.imageUrl?.startsWith('/img/') ? item.imageUrl : assetUrl(item.imageUrl)
const imageAlt = computed(() => `${artwork.value.title}${artwork.value.artist?.name ? `, de ${artwork.value.artist.name}` : ''}`)
const artworkLink = computed(() => artwork.value.id ? `/artes/${artwork.value.id}` : '/gustav-klimt-e-elfen-lied')
const artworkSrc = computed(() => resolveArtworkSrc(artwork.value))
const artworkNote = computed(() => [artwork.value.artist?.name, artwork.value.year, artwork.value.type].filter(Boolean).join(' · '))
const artworkPosition = computed(() => `${String((displayedIndex.value % artworks.value.length) + 1).padStart(2, '0')} / ${String(artworks.value.length).padStart(2, '0')}`)
</script>

<template>
  <section class="rail-muse" aria-label="Obras de arte do acervo"
    @mouseenter="isPaused = true" @mouseleave="isPaused = false"
    @focusin="isPaused = true" @focusout="isPaused = false">
    <div class="rail-muse-heading"><span>Do acervo de arte</span><span aria-hidden="true">✦</span></div>
    <div class="muse-presentation">
      <Transition name="muse-fade" mode="out-in">
        <NuxtLink v-if="imageReady" :key="`${artwork.id}-${artwork.imageUrl}`"
          class="muse-frame" :to="artworkLink" :aria-label="`Ver ${artwork.title} no acervo`">
          <img :src="artworkSrc" :alt="imageAlt" />
        </NuxtLink>
        <div v-else key="loading" class="muse-frame" aria-label="Carregando obra de arte" aria-busy="true" />
      </Transition>
      <div v-if="imageReady" class="muse-navigation" role="group" aria-label="Navegação das obras">
        <button v-if="artworks.length > 1" type="button" :disabled="isLoading"
          aria-label="Obra anterior" title="Obra anterior" @click="moveArtwork(-1)">‹</button>
        <span class="muse-position" aria-live="polite" aria-atomic="true">{{ artworkPosition }}</span>
        <button v-if="artworks.length > 1" type="button" :disabled="isLoading"
          aria-label="Próxima obra" title="Próxima obra" @click="moveArtwork(1)">›</button>
      </div>
    </div>
    <template v-if="imageReady">
      <p class="muse-name">{{ artwork.title }}</p>
      <p v-if="artworkNote" class="muse-note">{{ artworkNote }}</p>
    </template>
  </section>
</template>

<style scoped>
.muse-presentation {
  position: relative;
}
.muse-navigation {
  position: absolute;
  bottom: 7px;
  right: 7px;
  display: flex;
  align-items: center;
  color: #111619;
  background: #e6f066;
}
.muse-position {
  padding: 4px 6px;
  font: 10px ui-monospace, monospace;
  white-space: nowrap;
}
.muse-navigation button {
  display: grid;
  place-items: center;
  width: 24px;
  min-height: 22px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: 16px/1 Georgia, serif;
  cursor: pointer;
}
.muse-navigation button:hover:not(:disabled) {
  background: rgb(17 22 25 / 12%);
}
.muse-navigation button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -3px;
}
.muse-navigation button:disabled {
  opacity: .35;
  cursor: wait;
}
@media (hover: hover) and (pointer: fine) {
  .muse-navigation button {
    width: 0;
    overflow: hidden;
    opacity: 0;
  }
  .muse-presentation:hover .muse-navigation button,
  .muse-presentation:focus-within .muse-navigation button {
    width: 24px;
    opacity: 1;
  }
  .muse-presentation:hover .muse-navigation button:disabled,
  .muse-presentation:focus-within .muse-navigation button:disabled {
    opacity: .35;
  }
}
@media (pointer: coarse), (hover: none) {
  .muse-navigation button {
    width: 32px;
    min-height: 32px;
  }
}
.muse-fade-enter-active,
.muse-fade-leave-active {
  transition: opacity .45s ease;
}
.muse-fade-enter-from,
.muse-fade-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .muse-fade-enter-active,
  .muse-fade-leave-active {
    transition: none;
  }
}
</style>
