<script setup lang="ts">
import type {
  MediaPulseYearMovieUnwatchedCard,
  MediaPulseYearMovieWatchedCard,
  MediaPulseYearMoviesResponse
} from '~/types/media-pulse-movies'

const props = defineProps<{
  year: number
}>()

const { apiUrl, assetUrl } = useMediaPulseApi()

const {
  data,
  pending,
  error,
  refresh
} = useAsyncData(
  () => `year-movies-${props.year}`,
  () => $fetch<MediaPulseYearMoviesResponse>(apiUrl(`/api/movies/year/${props.year}`)),
  {
    server: false,
    watch: [() => props.year]
  }
)

const watched = computed(() => data.value?.watched || [])
const unwatched = computed(() => data.value?.unwatched || [])

const watchedSorted = computed(() => {
  return [...watched.value].sort((a, b) => {
    const aDate = new Date(a.lastWatchedAt || a.firstWatchedAt || 0).getTime()
    const bDate = new Date(b.lastWatchedAt || b.firstWatchedAt || 0).getTime()
    return bDate - aDate
  })
})

const unwatchedSorted = computed(() => {
  return [...unwatched.value].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
})

const detailsLink = (slug?: string | null) => {
  if (!slug?.trim()) return ''
  return `/filmes/detalhe/${slug}`
}

const coverSrc = (coverUrl?: string | null) => {
  if (!coverUrl) return ''
  return assetUrl(coverUrl)
}

const formatDate = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const hasOriginalTitleDiff = (movie: MediaPulseYearMovieWatchedCard | MediaPulseYearMovieUnwatchedCard) => {
  const original = movie.originalTitle?.trim()
  const title = movie.title?.trim()
  if (!original || !title) return false
  return original.toLowerCase() !== title.toLowerCase()
}

const watchedLabel = (item: MediaPulseYearMovieWatchedCard) => {
  const count = Number(item.watchCountInYear || 0)
  if (!count) return ''
  if (count === 1) return '1 sessão no ano'
  return `${count} sessões no ano`
}

const firstLastLabel = (item: MediaPulseYearMovieWatchedCard) => {
  const first = formatDate(item.firstWatchedAt)
  const last = formatDate(item.lastWatchedAt)
  if (!first && !last) return ''
  if (first && last && first !== last) return `Primeira: ${first} · Última: ${last}`
  return `Sessão registrada em ${last || first}`
}

const errorMessage = computed(() => {
  if (!error.value) return ''
  return 'Não foi possível carregar os filmes do ano agora.'
})
</script>

<template>
  <section id="year-movies-top" class="year-movies" aria-labelledby="year-movies-title">
    <div v-if="pending" class="year-movies__skeleton" aria-busy="true">
      <div class="skeleton-line skeleton-line--title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>

    <div v-else-if="errorMessage" class="year-movies__error" role="status">
      <p>{{ errorMessage }}</p>
      <button type="button" @click="refresh()">Tentar novamente</button>
    </div>

    <div v-else-if="data" class="year-movies__content">
      <header class="year-movies__summary">
        <div class="summary-head">
          <p class="summary-kicker">Filmes de {{ props.year }}</p>
          <h2 id="year-movies-title">Resumo do ano</h2>
          <p class="summary-subtitle">Tudo que entrou em cena neste ano e o que ainda está na fila.</p>
        </div>

        <nav class="summary-nav" aria-label="Navegação de seções">
          <a href="#section-assistidos">Assistidos ({{ watchedSorted.length }})</a>
          <a href="#section-nao-assistidos">Ainda não assistidos ({{ unwatchedSorted.length }})</a>
        </nav>
      </header>

      <section id="section-assistidos" class="year-movies__section" data-accent="watched">
        <div class="section-head">
          <h3>Assistidos</h3>
          <p>
            <strong>{{ watchedSorted.length }}</strong>
            filmes com sessão registrada em {{ props.year }}.
          </p>
        </div>

        <ul v-if="watchedSorted.length" class="movies-list">
          <li v-for="item in watchedSorted" :key="`watched-${item.movieId}`" class="movies-item">
            <ExpandableImage
              v-if="item.coverUrl"
              :src="coverSrc(item.coverUrl)"
              :alt="`Pôster de ${item.title}`"
              :expand-label="`Expandir pôster de ${item.title}`"
              gallery="year-movies-covers"
              thumb-width="72px"
              thumb-height="106px"
              mobile-thumb-width="58px"
              mobile-thumb-height="86px"
              thumb-radius="8px"
            />
            <div v-else class="movies-item__cover movies-item__cover--placeholder" aria-hidden="true">
              sem pôster
            </div>

            <div class="movies-item__content">
              <div class="movies-item__head">
                <div class="movies-item__titles">
                  <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__title-link">
                    <strong class="movies-item__title">{{ item.title }}</strong>
                  </NuxtLink>
                  <strong v-else class="movies-item__title">{{ item.title }}</strong>
                  <span v-if="hasOriginalTitleDiff(item)" class="movies-item__original-title">{{ item.originalTitle }}</span>
                </div>

                <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__details-link">
                  Ver detalhes
                </NuxtLink>
              </div>

              <div class="movies-item__meta-row">
                <span v-if="item.year" class="movies-item__meta-pill">{{ item.year }}</span>
                <span v-if="watchedLabel(item)" class="movies-item__meta-pill movies-item__meta-pill--highlight">
                  {{ watchedLabel(item) }}
                </span>
              </div>

              <span v-if="firstLastLabel(item)" class="movies-item__date">{{ firstLastLabel(item) }}</span>
            </div>
          </li>
        </ul>

        <p v-else class="movies-empty">Sem filmes assistidos neste ano.</p>
        <a class="back-to-top" href="#year-movies-top">Voltar ao topo</a>
      </section>

      <section id="section-nao-assistidos" class="year-movies__section" data-accent="unwatched">
        <div class="section-head">
          <h3>Ainda não assistidos</h3>
          <p>
            <strong>{{ unwatchedSorted.length }}</strong>
            filmes sem sessão registrada.
          </p>
        </div>

        <ul v-if="unwatchedSorted.length" class="movies-list">
          <li v-for="item in unwatchedSorted" :key="`unwatched-${item.movieId}`" class="movies-item">
            <ExpandableImage
              v-if="item.coverUrl"
              :src="coverSrc(item.coverUrl)"
              :alt="`Pôster de ${item.title}`"
              :expand-label="`Expandir pôster de ${item.title}`"
              gallery="year-movies-covers"
              thumb-width="72px"
              thumb-height="106px"
              mobile-thumb-width="58px"
              mobile-thumb-height="86px"
              thumb-radius="8px"
            />
            <div v-else class="movies-item__cover movies-item__cover--placeholder" aria-hidden="true">
              sem pôster
            </div>

            <div class="movies-item__content">
              <div class="movies-item__head">
                <div class="movies-item__titles">
                  <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__title-link">
                    <strong class="movies-item__title">{{ item.title }}</strong>
                  </NuxtLink>
                  <strong v-else class="movies-item__title">{{ item.title }}</strong>
                  <span v-if="hasOriginalTitleDiff(item)" class="movies-item__original-title">{{ item.originalTitle }}</span>
                </div>

                <NuxtLink v-if="detailsLink(item.slug)" :to="detailsLink(item.slug)" class="movies-item__details-link">
                  Ver detalhes
                </NuxtLink>
              </div>

              <div class="movies-item__meta-row">
                <span v-if="item.year" class="movies-item__meta-pill">{{ item.year }}</span>
                <span class="movies-item__meta-pill">na fila</span>
              </div>
            </div>
          </li>
        </ul>

        <p v-else class="movies-empty">Nenhum filme pendente na biblioteca.</p>
        <a class="back-to-top" href="#year-movies-top">Voltar ao topo</a>
      </section>
    </div>
  </section>
</template>

<style scoped src="~/assets/css/media/catalog-entries.css"></style>
