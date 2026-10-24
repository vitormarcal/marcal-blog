<script setup lang="ts">
import type { MediaPulseArtworkDetails } from '~/types/media-pulse-artworks'

definePageMeta({ documentDriven: false })

const route = useRoute()
const { apiUrl, assetUrl } = useMediaPulseApi()
const artworkId = String(route.params.id || '').trim()
if (!/^\d+$/.test(artworkId)) {
  throw createError({ statusCode: 404, statusMessage: 'Obra não encontrada' })
}

const { data, pending, error, refresh } = useAsyncData(
  `artwork-details-${artworkId}`,
  () => $fetch<MediaPulseArtworkDetails>(apiUrl(`/api/artworks/${artworkId}`)),
  { server: false }
)
const images = computed(() => {
  const items = data.value?.images || []
  return [...items].sort((left, right) => Number(right.primary) - Number(left.primary))
})
const selectedImageId = ref<number | null>(null)
watch(images, (items) => {
  if (!items.some((image) => image.id === selectedImageId.value)) {
    selectedImageId.value = items[0]?.id ?? null
  }
}, { immediate: true })
const selectedImage = computed(() => images.value.find((image) => image.id === selectedImageId.value) || images.value[0])
const artwork = computed(() => data.value?.artwork)
const artist = computed(() => data.value?.artist || null)
const pageTitle = computed(() => artwork.value ? `${artwork.value.title} — Artes` : 'Obra — Artes')
const pageDescription = computed(() => artwork.value?.description?.replace(/[#*_`\[\]]/g, '').slice(0, 155) || 'Detalhes de uma obra do meu acervo de arte.')
const experienceType = (value?: string | null) => {
  if (value === 'IN_PERSON') return 'Vi pessoalmente'
  if (value === 'DIGITAL_VIEWING') return 'Vi em formato digital'
  return ''
}
const experienceDate = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(`${value.slice(0, 10)}T12:00:00`)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}
const markdownBlocks = (value?: string | null) => {
  if (!value) return []
  return value.split(/\n\s*\n/).map((block) => block
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*(?:#{1,6}\s*|[-*+]\s+|>\s?)/gm, '')
    .replace(/\*\*|__|\*|_|`/g, '')
    .trim()
  ).filter(Boolean)
}
const extractStatusCode = (value: unknown) => {
  const raw = value as any
  for (const candidate of [raw?.statusCode, raw?.status, raw?.response?.status, raw?.data?.statusCode]) {
    const parsed = Number(candidate)
    if (Number.isInteger(parsed) && parsed > 0) return parsed
  }
  return null
}
watch(error, (value) => {
  if (value && extractStatusCode(value) === 404) {
    showError(createError({ statusCode: 404, statusMessage: 'Obra não encontrada' }))
  }
}, { immediate: true })
useSeoMeta({ title: pageTitle, description: pageDescription })
</script>

<template>
  <main class="artwork-detail">
    <NuxtLink to="/artes" class="artwork-detail__back">← Voltar ao acervo</NuxtLink>

    <div v-if="pending && !data" class="artworks-state" aria-busy="true">Carregando obra…</div>
    <div v-else-if="error" class="artworks-state" role="status">
      <p>Não foi possível carregar esta obra.</p>
      <button type="button" @click="refresh()">Tentar novamente</button>
    </div>
    <template v-else-if="data && artwork">
      <header class="artwork-detail__heading">
        <p class="artworks-library__kicker">{{ artwork.type || 'Obra de arte' }}</p>
        <h1>{{ artwork.title }}</h1>
        <p v-if="artist" class="artwork-detail__artist">{{ artist.name }}<span v-if="artist.countryOfOrigin"> · {{ artist.countryOfOrigin }}</span></p>
      </header>

      <section class="artwork-detail__hero">
        <div class="artwork-detail__visual">
          <ExpandableImage
            v-if="selectedImage"
            :src="assetUrl(selectedImage.url)"
            :alt="selectedImage.caption || `${artwork.title}, de ${artist?.name || 'artista desconhecido'}`"
            :expand-label="`Ampliar ${artwork.title}`"
            :gallery="`artwork-${artwork.id}`"
            thumb-width="100%"
            thumb-height="100%"
            thumb-fit="contain"
            thumb-radius="0"
            trigger-width="100%"
            trigger-height="100%"
            max-lightbox-width="1400px"
          />
          <div v-else class="artwork-detail__no-image">Esta obra ainda não tem imagem.</div>
          <p v-if="selectedImage?.caption" class="artwork-detail__caption">{{ selectedImage.caption }}</p>
          <div v-if="images.length > 1" class="artwork-detail__thumbnails" aria-label="Outras imagens da obra">
            <button v-for="image in images" :key="image.id" type="button" :class="{ 'is-selected': selectedImageId === image.id }" :aria-label="`Mostrar imagem ${image.caption || ''}`" @click="selectedImageId = image.id">
              <img :src="assetUrl(image.url)" :alt="image.caption || artwork.title" loading="lazy" />
            </button>
          </div>
        </div>

        <aside class="artwork-detail__facts" aria-label="Informações da obra">
          <dl>
            <div v-if="artwork.year"><dt>Ano</dt><dd>{{ artwork.year }}</dd></div>
            <div v-if="artwork.technique"><dt>Técnica</dt><dd>{{ artwork.technique }}</dd></div>
            <div v-if="artwork.movements?.length"><dt>Movimentos</dt><dd>{{ artwork.movements.join(' · ') }}</dd></div>
            <div v-if="data.rating"><dt>Minha nota</dt><dd>{{ data.rating.rating }} / 5</dd></div>
          </dl>
          <NuxtLink v-if="artist" :to="`/artes?artistId=${artist.id}`" class="artwork-detail__artist-link">Ver obras de {{ artist.name }} ↗</NuxtLink>
        </aside>
      </section>

      <section v-if="artwork.description" class="artwork-detail__section">
        <h2>Sobre a obra</h2>
        <p v-for="(block, index) in markdownBlocks(artwork.description)" :key="index" class="artwork-copy-block">{{ block }}</p>
      </section>

      <section v-if="data.experiences.length" class="artwork-detail__section">
        <h2>Meu encontro com a obra</h2>
        <article v-for="experience in data.experiences" :key="experience.id" class="artwork-experience">
          <div class="artwork-experience__meta">
            <span v-if="experience.experienceType">{{ experienceType(experience.experienceType) }}</span>
            <time v-if="experience.experiencedAt">{{ experienceDate(experience.experiencedAt) }}</time>
            <span v-if="experience.sourceName">{{ experience.sourceName }}</span>
          </div>
          <p v-for="(block, index) in markdownBlocks(experience.notes)" :key="index" class="artwork-copy-block">{{ block }}</p>
          <a v-if="experience.sourceUrl" :href="experience.sourceUrl" target="_blank" rel="noreferrer">Ver referência ↗</a>
        </article>
      </section>

      <section v-if="artist?.biography" class="artwork-detail__section">
        <h2>Sobre {{ artist.name }}</h2>
        <p v-for="(block, index) in markdownBlocks(artist.biography)" :key="index" class="artwork-copy-block">{{ block }}</p>
      </section>
    </template>
  </main>
</template>
