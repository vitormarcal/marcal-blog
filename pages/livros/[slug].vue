<script setup lang="ts">
import type { MediaPulseBookDetailsResponse, MediaPulseRead } from '~/types/media-pulse-books'

definePageMeta({
  documentDriven: false
})

const route = useRoute()
const { apiUrl, assetUrl } = useMediaPulseApi()

const slugParam = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const bookSlug = String(slugParam || '').trim()

if (!bookSlug) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Livro não encontrado'
  })
}

const { data: book, pending, error } = useAsyncData(
  `book-details-${bookSlug}`,
  () => $fetch<MediaPulseBookDetailsResponse>(apiUrl(`/api/books/slug/${encodeURIComponent(bookSlug)}`)),
  {
    server: false
  }
)

const selectedReadEdition = computed(() => {
  const reads = book.value?.reads || []
  if (!reads.length) return null

  const sortedReads = [...reads].sort((a, b) => {
    const aDate = new Date(a.finishedAt || a.startedAt || 0).getTime()
    const bDate = new Date(b.finishedAt || b.startedAt || 0).getTime()
    return bDate - aDate
  })

  const latestWithEdition = sortedReads.find((read) => read.edition?.title?.trim())
  return latestWithEdition?.edition || null
})

const pageName = computed(() => {
  if (selectedReadEdition.value?.title) return selectedReadEdition.value.title
  const fromEdition = book.value?.editions?.find((edition) => edition.title?.trim())?.title?.trim()
  if (fromEdition) return fromEdition
  return book.value?.title || 'Livro'
})

watch(book, async (value) => {
  if (!value) return

  const routeSlug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
  if (routeSlug !== value.slug) {
    await navigateTo(`/livros/${value.slug}`, { redirectCode: 301, replace: true })
  }
}, { immediate: true })

const title = computed(() => {
  if (!book.value) return 'Livro'
  return `${pageName.value} | Leituras`
})

const description = computed(() => {
  if (!book.value) return 'Detalhes de leitura.'
  return book.value.description?.trim() || 'Detalhes de leitura.'
})

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const authorsLabel = computed(() => {
  if (!book.value?.authors?.length) return ''
  return book.value.authors.map((author) => author.name).join(', ')
})

const reviewText = computed(() => book.value?.reviewRaw?.trim() || '')

const reviewParagraphs = computed(() => {
  if (!reviewText.value) return []

  return reviewText.value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
})

const coverSrc = computed(() => {
  if (!book.value?.coverUrl) return ''
  return assetUrl(book.value.coverUrl)
})

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

const statusLabel = (status: string) => {
  const normalized = status.toUpperCase()
  if (normalized === 'READ') return 'Finalizado'
  if (normalized === 'CURRENTLY_READING') return 'Lendo'
  if (normalized === 'DID_NOT_FINISH') return 'Abandonado'
  if (normalized === 'WANT_TO_READ') return 'Quero ler'
  return status
}

const readProgress = (read: MediaPulseRead) => {
  const parts: string[] = []
  if (typeof read.progressPct === 'number') {
    parts.push(`${read.progressPct.toFixed(1)}%`)
  }
  if (typeof read.progressPages === 'number') {
    parts.push(`${read.progressPages} pág.`)
  }
  return parts.join(' · ')
}
</script>

<template>
  <section class="main-section">
    <main>
      <article class="post-section book-page">
        <div class="book-page__header">
          <p class="book-page__kicker">Livro</p>
          <h1>{{ pageName }}</h1>
          <p v-if="book?.description" class="book-page__description">{{ book.description }}</p>
        </div>

        <div v-if="pending" class="book-page__state" aria-busy="true">
          Carregando detalhes do livro...
        </div>

        <div v-else-if="error" class="book-page__state book-page__state--error">
          Não foi possível carregar o livro agora. Tente novamente em instantes.
        </div>

        <template v-else-if="book">
          <section class="book-page__summary">
            <img
              v-if="coverSrc"
              :src="coverSrc"
              :alt="`Capa de ${pageName}`"
              class="book-cover"
            />
            <div v-else class="book-cover book-cover--placeholder" aria-hidden="true">
              Sem capa
            </div>

            <dl class="book-meta">
              <div>
                <dt>Título</dt>
                <dd>{{ book.title }}</dd>
              </div>
              <div v-if="authorsLabel">
                <dt>Autor(es)</dt>
                <dd>{{ authorsLabel }}</dd>
              </div>
              <div v-if="book.releaseDate">
                <dt>Lançamento</dt>
                <dd>{{ formatDate(book.releaseDate) }}</dd>
              </div>
              <div v-if="typeof book.rating === 'number'">
                <dt>Nota</dt>
                <dd>{{ book.rating.toFixed(1) }}</dd>
              </div>
              <div v-if="book.reviewedAt">
                <dt>Review atualizada em</dt>
                <dd>{{ formatDate(book.reviewedAt) }}</dd>
              </div>
            </dl>
          </section>

          <section class="book-page__section">
            <h2>Review</h2>
            <div v-if="reviewParagraphs.length" class="book-review">
              <p v-for="(paragraph, index) in reviewParagraphs" :key="`${index}-${paragraph.slice(0, 18)}`">
                {{ paragraph }}
              </p>
            </div>
            <p v-else class="book-page__empty">Sem review para este livro.</p>
          </section>

          <section class="book-page__section">
            <h2>Edições</h2>
            <ul v-if="book.editions.length" class="book-list">
              <li v-for="edition in book.editions" :key="edition.id" class="book-list__item">
                <strong>{{ edition.title }}</strong>
                <span v-if="edition.publisher">{{ edition.publisher }}</span>
                <span v-if="edition.format">{{ edition.format }}</span>
                <span v-if="edition.pages">{{ edition.pages }} páginas</span>
                <span v-if="edition.language">Idioma: {{ edition.language }}</span>
                <span v-if="edition.isbn13">ISBN-13: {{ edition.isbn13 }}</span>
                <span v-else-if="edition.isbn10">ISBN-10: {{ edition.isbn10 }}</span>
              </li>
            </ul>
            <p v-else class="book-page__empty">Sem edições registradas.</p>
          </section>

          <section class="book-page__section">
            <h2>Histórico de leitura</h2>
            <ul v-if="book.reads.length" class="book-list">
              <li v-for="read in book.reads" :key="read.readId" class="book-list__item">
                <strong>{{ statusLabel(read.status) }}</strong>
                <span v-if="read.startedAt">Início: {{ formatDate(read.startedAt) }}</span>
                <span v-if="read.finishedAt">Fim: {{ formatDate(read.finishedAt) }}</span>
                <span v-if="readProgress(read)">Progresso: {{ readProgress(read) }}</span>
                <span v-if="read.source">Fonte: {{ read.source }}</span>
              </li>
            </ul>
            <p v-else class="book-page__empty">Sem leituras registradas para este livro.</p>
          </section>
        </template>
      </article>
    </main>
  </section>
</template>

<style scoped>
.book-page > * {
  grid-column: 4 / span 6;
}

@media (max-width: 767px) {
  .book-page > * {
    grid-column: 1 / span 12;
  }
}

.book-page {
  row-gap: 2rem;
}

.book-page__header {
  display: grid;
  gap: 0.8rem;
}

.book-page__header h1 {
  margin: 0 !important;
}

.book-page__kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.book-page__description {
  color: rgba(255, 255, 255, 0.74);
}

.book-page__state {
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
}

.book-page__state--error {
  color: #fecaca;
  background: rgba(155, 28, 28, 0.25);
  border: 1px solid rgba(155, 28, 28, 0.45);
}

.book-page__summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  align-items: start;
}

@media (max-width: 767px) {
  .book-page__summary {
    grid-template-columns: 1fr;
  }
}

.book-cover {
  width: 140px;
  height: 210px;
  border-radius: 10px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.15);
}

.book-cover--placeholder {
  display: grid;
  place-items: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.book-meta {
  display: grid;
  gap: 0.8rem;
  margin: 0;
}

.book-meta dt {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.book-meta dd {
  margin: 0.2rem 0 0;
}

.book-page__section {
  display: grid;
  gap: 0.8rem;
}

.book-page__section h2 {
  margin: 0 !important;
  font-size: 1.5rem;
}

.book-page__empty {
  color: rgba(255, 255, 255, 0.64);
}

.book-review {
  display: grid;
  gap: 1rem;
}

.book-review p {
  white-space: pre-wrap;
}

.book-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.8rem;
}

.book-list__item {
  display: grid;
  gap: 0.2rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
}

.book-list__item span {
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.94rem;
}
</style>
