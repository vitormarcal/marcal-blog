<script setup lang="ts">
import type { GameDetails } from '~/types/media-pulse-games'
import { gameStatusLabel } from '~/types/media-pulse-games'

definePageMeta({ documentDriven: false })
const route = useRoute()
const { apiUrl, assetUrl } = useMediaPulseApi()
const slug = computed(() => String(route.params.slug || ''))
const { data: game, pending, error, refresh } = useAsyncData(() => `game-${slug.value}`, () =>
  $fetch<GameDetails>(apiUrl(`/api/games/slug/${encodeURIComponent(slug.value)}`)), { server: false, watch: [slug] })
useSeoMeta({ title: () => game.value?.title || 'Detalhes do jogo', description: () => game.value?.description || 'Detalhes e histórico de sessões do jogo.' })
const paragraphs = computed(() => game.value?.description?.split(/\n+/).filter(line => line.trim()) || [])
const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
  <section class="main-section"><main><article class="post-section game-page">
    <header class="game-page__hero"><p class="game-page__kicker">Jogo</p><NuxtLink to="/jogos">← Biblioteca de jogos</NuxtLink><h1>{{ game?.title || 'Detalhes do jogo' }}</h1><p class="game-page__original-title" v-if="game?.originalTitle && game.originalTitle !== game.title">{{ game.originalTitle }}</p></header>
    <p v-if="pending" role="status" aria-busy="true">Carregando detalhes do jogo...</p>
    <div v-else-if="error" role="status"><p>{{ error.statusCode === 404 ? 'Jogo não encontrado.' : 'Não foi possível carregar este jogo agora.' }}</p><button type="button" @click="refresh()">Tentar novamente</button></div>
    <template v-else-if="game">
      <section class="game-page__summary">
        <ExpandableImage v-if="game.coverUrl" :src="assetUrl(game.coverUrl)" :alt="`Capa de ${game.title}`" thumb-width="220px" thumb-height="330px" thumb-radius="14px" />
        <dl class="game-meta"><div v-if="game.year"><dt>Ano</dt><dd>{{ game.year }}</dd></div><div><dt>Sessões no histórico</dt><dd>{{ game.sessions.length }}</dd></div><div v-if="game.rating"><dt>Minha nota</dt><dd>{{ game.rating.rating.toLocaleString('pt-BR') }} ★</dd></div></dl>
      </section>
      <section class="game-page__section"><h2>Sobre o jogo</h2><div class="game-description"><p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p></div><p v-if="!paragraphs.length">Sem descrição registrada para este jogo.</p></section>
      <section class="game-page__section" v-if="game.images.length"><h2>Galeria</h2><div class="game-gallery"><ExpandableImage v-for="image in game.images" :key="image.id" :src="assetUrl(image.url)" :alt="`Imagem de ${game.title}`" gallery="game-detail-gallery" thumb-width="140px" thumb-height="200px" thumb-radius="10px" /></div></section>
      <section class="game-page__section"><h2>Histórico de sessões</h2>
        <ul v-if="game.sessions.length" class="game-list"><li v-for="session in game.sessions" :key="session.sessionId" class="game-list__item"><strong>{{ gameStatusLabel(session.status) }}</strong><p>{{ formatDate(session.startedAt) }}<template v-if="session.endedAt"> até {{ formatDate(session.endedAt) }}</template></p><p v-if="session.notes" class="game-notes">{{ session.notes }}</p></li></ul>
        <p v-else>Sem sessões registradas para este jogo.</p>
      </section>
      <section class="game-page__section game-page__comments" v-if="game.comments.length"><h2>Notas pessoais</h2><blockquote v-for="comment in game.comments" :key="comment.id"><p class="game-notes">{{ comment.body }}</p><footer>{{ formatDate(comment.commentedAt) }}</footer></blockquote></section>
    </template>
  </article></main></section>
</template>

<style scoped src="~/assets/css/media/catalog-detail.css"></style>
<style scoped>
.game-gallery { display: flex; flex-wrap: wrap; gap: 1rem; }
.game-notes { white-space: pre-wrap; }
</style>
