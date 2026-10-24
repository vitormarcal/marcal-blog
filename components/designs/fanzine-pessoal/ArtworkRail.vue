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
  { id: 0, title: 'Judith I', artist: { name: 'Gustav Klimt' }, year: 1901, imageUrl: '/img/gustav-klimt-e-elfen-lied/judith-i-gustav-klimt.jpg' },
  { id: 0, title: 'Adele Bloch-Bauer I', artist: { name: 'Gustav Klimt' }, year: 1907, imageUrl: '/img/gustav-klimt-e-elfen-lied/adele-bloch-bauer-gustav-klimt.jpg' },
  { id: 0, title: 'Danaë', artist: { name: 'Gustav Klimt' }, year: 1907, imageUrl: '/img/gustav-klimt-e-elfen-lied/danae-gustav-klimt.jpg' },
  { id: 0, title: 'Serpentes d’água II', artist: { name: 'Gustav Klimt' }, year: 1907, imageUrl: '/img/gustav-klimt-e-elfen-lied/water-snakes-ii-gustav-klimt.jpg' },
  { id: 0, title: 'Retrato de Mada', artist: { name: 'Gustav Klimt' }, year: 1916, imageUrl: '/img/gustav-klimt-e-elfen-lied/retrato-de-mada-klimt.jpg' }
]
const artworks = computed(() => {
  const withImages = (data.value?.items || []).filter((artwork) => artwork.imageUrl)
  return withImages.length ? withImages : fallbacks
})
const artworkIndex = ref(0)
watch(() => route.path, (path, previousPath) => {
  if (previousPath) {
    artworkIndex.value = (artworkIndex.value + 1) % artworks.value.length
    return
  }
  artworkIndex.value = [...(path || '/')].reduce((value, char) => value + char.charCodeAt(0), 0) % artworks.value.length
}, { immediate: true })
const artwork = computed(() => artworks.value[artworkIndex.value % artworks.value.length] || fallbacks[0])
const imageAlt = computed(() => `${artwork.value.title}${artwork.value.artist?.name ? `, de ${artwork.value.artist.name}` : ''}`)
const artworkLink = computed(() => artwork.value.id ? `/artes/${artwork.value.id}` : '/gustav-klimt-e-elfen-lied')
const artworkSrc = computed(() => artwork.value.imageUrl?.startsWith('/img/') ? artwork.value.imageUrl : assetUrl(artwork.value.imageUrl))
const artworkNote = computed(() => [artwork.value.artist?.name, artwork.value.year, artwork.value.type].filter(Boolean).join(' · '))
const artworkPosition = computed(() => `${String((artworkIndex.value % artworks.value.length) + 1).padStart(2, '0')} / ${String(artworks.value.length).padStart(2, '0')}`)
</script>

<template>
  <section class="rail-muse" aria-label="Obras de arte do acervo">
    <div class="rail-muse-heading"><span>Do acervo de arte</span><span aria-hidden="true">✦</span></div>
    <NuxtLink class="muse-frame" :to="artworkLink" :aria-label="`Ver ${artwork.title} no acervo`">
      <img :src="artworkSrc" :alt="imageAlt" />
      <span class="muse-number">{{ artworkPosition }}</span>
    </NuxtLink>
    <p class="muse-name">{{ artwork.title }}</p>
    <p v-if="artworkNote" class="muse-note">{{ artworkNote }}</p>
  </section>
</template>
