<script setup lang="ts">
import type { MediaPulseArtworkLibrary } from '~/types/media-pulse-artworks'

definePageMeta({ documentDriven: false })

const { apiUrl, assetUrl } = useMediaPulseApi()
const route = useRoute()
const searchInput = ref('')
const searchTerm = ref('')
const page = ref(0)
const sort = ref<'recent' | 'year'>('recent')
const artistIdFilter = computed(() => {
  const artistId = Number(route.query.artistId)
  return Number.isInteger(artistId) && artistId > 0 ? artistId : null
})
const requestUrl = computed(() => {
  const params = new URLSearchParams({ page: String(page.value), limit: '24', sort: sort.value })
  if (searchTerm.value) params.set('q', searchTerm.value)
  if (artistIdFilter.value) params.set('artistId', String(artistIdFilter.value))
  return apiUrl(`/api/artworks?${params.toString()}`)
})
const { data, pending, error, refresh } = useAsyncData(
  () => `artworks-library-${page.value}-${sort.value}-${searchTerm.value}-${artistIdFilter.value || 'all'}`,
  () => $fetch<MediaPulseArtworkLibrary>(requestUrl.value),
  { server: false, watch: [page, sort, searchTerm, artistIdFilter] }
)
const artworks = computed(() => data.value?.items || [])
const imageSrc = (url?: string | null) => url?.startsWith('/img/') ? url : assetUrl(url)
const submitSearch = () => {
  page.value = 0
  searchTerm.value = searchInput.value.trim()
}
const errorMessage = computed(() => error.value ? 'Não foi possível carregar o acervo de arte agora.' : '')
useSeoMeta({
  title: 'Artes — Marçal',
  description: 'Obras de arte que encontrei e registrei no meu acervo pessoal.'
})
</script>

<template>
  <main class="artworks-library" id="artworks-top">
    <header class="artworks-library__intro">
      <p class="artworks-library__kicker">Acervo pessoal</p>
      <h1>Artes</h1>
      <p>Obras que encontrei pelo caminho e quis guardar por aqui.</p>
    </header>

    <form class="artworks-tools" role="search" @submit.prevent="submitSearch">
      <label class="sr-only" for="artworks-search">Buscar obra ou artista</label>
      <input id="artworks-search" v-model="searchInput" type="search" placeholder="Buscar obra ou artista" />
      <button type="submit">Buscar</button>
      <label class="sr-only" for="artworks-sort">Ordenar obras</label>
      <select id="artworks-sort" v-model="sort" @change="page = 0">
        <option value="recent">Adicionadas recentemente</option>
        <option value="year">Por ano</option>
      </select>
    </form>

    <div v-if="pending && !data" class="artworks-state" aria-busy="true">Carregando o acervo…</div>
    <div v-else-if="errorMessage" class="artworks-state" role="status">
      <p>{{ errorMessage }}</p>
      <button type="button" @click="refresh()">Tentar novamente</button>
    </div>
    <div v-else-if="!artworks.length" class="artworks-state">Nenhuma obra encontrada.</div>

    <template v-else>
      <ul class="artworks-grid">
        <li v-for="artwork in artworks" :key="artwork.id" class="artwork-card">
          <NuxtLink :to="`/artes/${artwork.id}`" class="artwork-card__image" :aria-label="`Ver ${artwork.title}`">
            <img v-if="artwork.imageUrl" :src="imageSrc(artwork.imageUrl)" :alt="artwork.title" loading="lazy" />
            <span v-else class="artwork-card__empty">Sem imagem</span>
            <span v-if="artwork.favorite" class="artwork-card__favorite" aria-label="Favorita">★</span>
          </NuxtLink>
          <div class="artwork-card__body">
            <p v-if="artwork.type" class="artwork-card__type">{{ artwork.type }}</p>
            <h2><NuxtLink :to="`/artes/${artwork.id}`">{{ artwork.title }}</NuxtLink></h2>
            <p class="artwork-card__artist">{{ artwork.artist?.name || 'Artista desconhecido' }}</p>
            <p class="artwork-card__meta"><span v-if="artwork.year">{{ artwork.year }}</span><span v-for="movement in artwork.movements" :key="movement">{{ movement }}</span></p>
          </div>
        </li>
      </ul>
      <nav v-if="data?.nextPage !== null && data?.nextPage !== undefined || page > 0" class="artworks-pagination" aria-label="Paginação do acervo">
        <button type="button" :disabled="page === 0 || pending" @click="page = Math.max(0, page - 1)">← Anteriores</button>
        <span>Página {{ page + 1 }}</span>
        <button type="button" :disabled="data?.nextPage == null || pending" @click="page = data!.nextPage!">Próxima →</button>
      </nav>
    </template>
  </main>
</template>
