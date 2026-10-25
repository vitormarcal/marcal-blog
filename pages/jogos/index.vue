<script setup lang="ts">
import type { GamesLibraryResponse, GamesStatsResponse } from '~/types/media-pulse-games'
import { gameStatusLabel } from '~/types/media-pulse-games'

definePageMeta({ documentDriven: false })
useSeoMeta({ title: 'Jogos', description: 'Minha biblioteca de jogos: o que estou jogando, concluí e quero jogar.' })
const { apiUrl, assetUrl } = useMediaPulseApi()
const { data, pending, error, refresh } = useAsyncData('games-library', () =>
  $fetch<GamesLibraryResponse>(apiUrl('/api/games/library'), { query: { limit: 24 } }), { server: false })
const { data: stats } = useAsyncData('games-stats', () =>
  $fetch<GamesStatsResponse>(apiUrl('/api/games/stats')), { server: false })
const loadingMore = ref(false)
const moreError = ref(false)
const loadMore = async () => {
  if (!data.value?.nextCursor || loadingMore.value) return
  loadingMore.value = true
  moreError.value = false
  try {
    const page = await $fetch<GamesLibraryResponse>(apiUrl('/api/games/library'), {
      query: { limit: 24, cursor: data.value.nextCursor }
    })
    const known = new Set(data.value.items.map(item => item.gameId))
    data.value = { items: [...data.value.items, ...page.items.filter(item => !known.has(item.gameId))], nextCursor: page.nextCursor }
  } catch {
    moreError.value = true
  } finally {
    loadingMore.value = false
  }
}
const summaries = computed(() => [
  ['Jogos na biblioteca', stats.value?.totalGamesCount], ['Sessões', stats.value?.sessionsCount],
  ['Jogando', stats.value?.activeCount], ['Na fila', stats.value?.backlogCount],
  ['Concluídos', stats.value?.completedCount], ['Abandonados', stats.value?.abandonedCount]
])
</script>

<template>
  <section class="main-section"><main><div class="post-section content-section games-page">
    <header class="games-year-header">
      <p class="games-year-header__kicker">Caderno de jogos</p><h1>Minha biblioteca de jogos</h1>
      <p class="games-year-header__description">Campanhas em curso, histórias concluídas e os próximos da fila.</p>
      <dl class="games-global-summary"><div v-for="[label, value] in summaries" :key="String(label)" class="games-global-summary__item"><dt class="games-global-summary__label">{{ label }}</dt><dd class="games-global-summary__value">{{ value ?? '—' }}</dd></div></dl>
    </header>
    <p v-if="pending" role="status" aria-busy="true">Carregando jogos...</p>
    <div v-else-if="error" role="status"><p>Não foi possível carregar os jogos agora.</p><button type="button" @click="refresh()">Tentar novamente</button></div>
    <template v-else-if="data">
      <ul v-if="data.items.length" class="games-list">
        <li v-for="game in data.items" :key="game.gameId" class="games-item">
          <ExpandableImage v-if="game.coverUrl" :src="assetUrl(game.coverUrl)" :alt="`Capa de ${game.title}`" gallery="games-covers" thumb-width="72px" thumb-height="106px" thumb-radius="8px" />
          <div v-else class="games-item__cover games-item__cover--placeholder" aria-hidden="true">sem capa</div>
          <div class="games-item__content">
            <NuxtLink class="games-item__title-link" v-if="game.slug" :to="`/jogos/detalhe/${game.slug}`"><strong class="games-item__title">{{ game.title }}</strong></NuxtLink>
            <strong v-else class="games-item__title">{{ game.title }}</strong>
            <p class="games-item__original-title" v-if="game.originalTitle && game.originalTitle !== game.title">{{ game.originalTitle }}</p>
            <p class="games-item__meta-pill">{{ [game.year, gameStatusLabel(game.currentStatus)].filter(Boolean).join(' · ') }}</p>
            <small class="games-item__date">{{ game.sessionCount }} {{ game.sessionCount === 1 ? 'sessão registrada' : 'sessões registradas' }}</small>
          </div>
        </li>
      </ul>
      <p v-else>Nenhum jogo na biblioteca por enquanto.</p>
      <p v-if="moreError" role="status">Não foi possível carregar mais jogos. Tente novamente.</p>
      <button v-if="data.nextCursor" type="button" :disabled="loadingMore" @click="loadMore">{{ loadingMore ? 'Carregando...' : 'Carregar mais jogos' }}</button>
    </template>
  </div></main></section>
</template>

<style scoped src="~/assets/css/media/catalog-header.css"></style>
<style scoped src="~/assets/css/media/catalog-entries.css"></style>
<style scoped>
.games-page > * { grid-column: 1 / span 12; }
.games-item__content p { margin: 0; }
.games-global-summary dd { margin: 0; }
</style>
