<script setup lang="ts">
import type { MediaPulseReadCard } from '~/types/media-pulse-books'

const props = defineProps<{ item: MediaPulseReadCard; status: string }>()
const { assetUrl } = useMediaPulseApi()
const { isMinimalistaEscuro } = useVisualDesign()
const edition = computed(() => props.item.edition)
const title = computed(() => edition.value?.title?.trim() || props.item.book.title)
const cover = computed(() => edition.value?.coverUrl || props.item.book.coverUrl || '')
const authors = computed(() => props.item.book.authors?.map((author) => author.name).filter(Boolean).join(', ') || '')
const dateLabel = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}
const progress = computed(() => {
  const percent = typeof props.item.progressPct === 'number' ? Math.max(0, Math.min(100, props.item.progressPct)) : null
  const pages = typeof props.item.progressPages === 'number' ? props.item.progressPages : null
  return { percent, pages }
})
const legacyProgress = computed(() => [
  typeof props.item.progressPct === 'number' ? `${props.item.progressPct.toFixed(1)}%` : '',
  typeof props.item.progressPages === 'number' ? `${props.item.progressPages} pág.` : ''
].filter(Boolean).join(' · '))
const editionMeta = computed(() => [
  edition.value?.publisher,
  edition.value?.pages ? `${edition.value.pages} páginas` : null,
  edition.value?.format,
  edition.value?.language
].filter(Boolean))
const rating = computed(() => props.item.book.rating)
</script>

<template>
  <li :class="['reads-item', 'reads-item--publication', { 'reads-item--minimalista-escuro': isMinimalistaEscuro }]">
    <ExpandableImage
      v-if="cover"
      :src="assetUrl(cover)"
      :alt="`Capa de ${title}`"
      :expand-label="`Ampliar capa de ${title}`"
      gallery="year-reads-covers"
      :thumb-width="isMinimalistaEscuro ? '68px' : '100%'"
      :thumb-height="isMinimalistaEscuro ? '102px' : '100%'"
      :mobile-thumb-width="isMinimalistaEscuro ? '54px' : '100%'"
      :mobile-thumb-height="isMinimalistaEscuro ? '81px' : '100%'"
      :thumb-radius="isMinimalistaEscuro ? '8px' : '0'"
      thumb-fit="cover"
      :trigger-width="isMinimalistaEscuro ? 'fit-content' : '100%'"
      :trigger-height="isMinimalistaEscuro ? 'fit-content' : '100%'"
    />
    <div v-else class="reads-item__cover reads-item__cover--placeholder" aria-hidden="true">sem capa</div>
    <div class="reads-item__content">
      <span v-if="!isMinimalistaEscuro" class="reads-item__status">{{ status }}</span>
      <NuxtLink :to="`/livros/${item.book.slug}`" class="reads-item__title-link"><strong class="reads-item__title">{{ title }}</strong></NuxtLink>
      <span v-if="authors" class="reads-item__authors">{{ authors }}</span>
      <span v-if="!isMinimalistaEscuro && editionMeta.length" class="reads-item__edition">{{ editionMeta.join(' · ') }}</span>
      <span v-if="!isMinimalistaEscuro && typeof rating === 'number'" class="reads-item__rating" :aria-label="`Minha nota: ${rating} de 5`">{{ '★'.repeat(Math.max(0, Math.min(5, Math.round(rating)))) }}<small> {{ rating.toLocaleString('pt-BR') }}/5</small></span>
      <span v-if="isMinimalistaEscuro && status === 'Lendo' && legacyProgress" class="reads-item__progress">{{ legacyProgress }}</span>
      <div v-if="!isMinimalistaEscuro && status === 'Lendo' && (progress.percent !== null || progress.pages !== null)" class="reads-item__progress-block">
        <span>{{ progress.pages !== null ? `${progress.pages} páginas lidas` : '' }}<small v-if="progress.percent !== null">{{ progress.percent.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) }}%</small></span>
        <div v-if="progress.percent !== null" class="reads-item__progress-track"><i :style="{ width: `${progress.percent}%` }" /></div>
      </div>
      <time v-if="item.finishedAt" class="reads-item__date">{{ isMinimalistaEscuro ? dateLabel(item.finishedAt) : `Terminado em ${dateLabel(item.finishedAt)}` }}</time>
      <time v-else-if="item.startedAt" class="reads-item__date">{{ isMinimalistaEscuro ? dateLabel(item.startedAt) : `${status === 'Lendo' ? 'Comecei em' : 'Registro em'} ${dateLabel(item.startedAt)}` }}</time>
      <NuxtLink :to="`/livros/${item.book.slug}`" class="reads-item__details-link">{{ isMinimalistaEscuro ? 'Ver detalhes' : 'Abrir registro ↗' }}</NuxtLink>
    </div>
  </li>
</template>

<style scoped>
.reads-item--minimalista-escuro {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
  min-width: 0;
  padding: 1.1rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.68);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.6);
}

.reads-item--minimalista-escuro > .expandable-image__trigger {
  display: block;
  width: 68px;
  height: 102px;
  border-radius: 8px;
}

.reads-item--minimalista-escuro :deep(.expandable-image__thumb),
.reads-item--minimalista-escuro > .reads-item__cover {
  display: block;
  width: 68px;
  height: 102px;
  border-radius: 8px;
  object-fit: cover;
}

.reads-item--minimalista-escuro .reads-item__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
}

.reads-item--minimalista-escuro .reads-item__title-link {
  max-width: 100%;
  color: inherit;
  text-decoration: none;
}

.reads-item--minimalista-escuro .reads-item__title {
  font-weight: 600;
}

.reads-item--minimalista-escuro .reads-item__authors,
.reads-item--minimalista-escuro .reads-item__date {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.reads-item--minimalista-escuro .reads-item__progress {
  color: rgba(141, 181, 0, 0.9);
  font-size: 0.88rem;
}

.reads-item--minimalista-escuro .reads-item__details-link {
  width: fit-content;
  margin-top: 0.2rem;
  color: var(--font-color);
  font-size: 0.86rem;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .reads-item--minimalista-escuro {
    grid-template-columns: 54px minmax(0, 1fr);
    gap: 0.75rem;
    padding: 0.8rem;
  }

  .reads-item--minimalista-escuro > .expandable-image__trigger,
  .reads-item--minimalista-escuro :deep(.expandable-image__thumb),
  .reads-item--minimalista-escuro > .reads-item__cover {
    width: 54px;
    height: 81px;
  }
}
</style>
