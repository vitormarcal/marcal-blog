<script setup lang="ts">
import { formatDate } from '~/utils/date-utils'
const { data: posts } = await useAsyncData('revista-2026-home', () => queryContent()
  .where({ is_post: true, _partial: false }).sort({ created_at: -1 }).limit(5).without(['body']).find())
const featured = computed(() => posts.value?.[0])
const remaining = computed(() => posts.value?.slice(1) || [])
const { stories } = useStoriesCatalog()
useSeoMeta({ title: 'Vítor Marçal', description: 'Essa é a minha página pessoal, onde eu escrevo principalmente para mim mesmo.' })
const shelf = [
  { title: 'Fundação', subtitle: 'Isaac Asimov', image: '/leituras/fundacao/img/fundacao.png', path: '/leituras/fundacao/fundacao' },
  { title: 'O alienista', subtitle: 'Machado de Assis', image: '/leituras/o-alienista/o-alienista.jpg', path: '/leituras/o-alienista/o-alienista' },
  { title: 'O gene egoísta', subtitle: 'Richard Dawkins', image: '/leituras/img/o-gene-egoista-por-richard-dawkins.jpg', path: '/leituras/o-gene-egoista-por-richard-dawkins' }
]
</script>

<template>
  <main class="editorial-home">
    <div class="edition-line"><span>Edição 02</span><span>Por Vítor Marçal</span></div>
    <section class="editorial-intro"><h1>Olá, eu sou o<br /><em>Vítor Marçal.</em></h1><p>Essa é a minha página pessoal, onde eu escrevo principalmente para mim mesmo 🧠!</p></section>
    <div class="front-page-grid">
      <section class="lead-story" aria-labelledby="latest-title"><div class="section-rule"><h2 id="latest-title">Últimas publicações</h2></div>
        <article v-if="featured" class="featured-post"><p class="eyebrow">Mais recente <span>↘</span></p><NuxtLink :to="featured._path"><h3>{{ featured.title }}</h3></NuxtLink><p>{{ featured.description }}</p><div class="post-byline"><time :datetime="featured.created_at">{{ formatDate(featured.created_at) }}</time><NuxtLink :to="featured._path">Ler a publicação ↗</NuxtLink></div></article>
        <p v-else class="empty-notes">Nenhuma publicação por enquanto.</p>
        <div class="short-posts"><article v-for="(post, index) in remaining" :key="post._path"><span class="post-number">0{{ index + 2 }}</span><div><time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time><h3><NuxtLink :to="post._path">{{ post.title }}</NuxtLink></h3><p>{{ post.description }}</p></div></article></div>
        <NuxtLink class="archive-link" to="/publicacoes">Todas as publicações <span>↗</span></NuxtLink>
      </section>
      <aside class="personal-column" aria-label="Leituras e outras páginas"><div class="section-rule"><h2>Livros</h2></div><div class="book-shelf"><NuxtLink v-for="book in shelf" :key="book.path" :to="book.path" class="shelf-book"><div class="book-cover"><img :src="book.image" :alt="'Capa de ' + book.title" width="240" height="360" loading="lazy" /></div><h3>{{ book.title }}</h3><p>{{ book.subtitle }}</p></NuxtLink></div><NuxtLink class="small-link" to="/leituras/2026">Leituras de 2026 ↗</NuxtLink>
      
      <div class="culture-index"><h2>Veja também</h2><NuxtLink to="/filmes">Filmes <span>↗</span></NuxtLink><NuxtLink to="/musicas">Músicas <span>↗</span></NuxtLink><NuxtLink to="/series">Séries <span>↗</span></NuxtLink><NuxtLink to="/gostos">Meus gostos <span>↗</span></NuxtLink></div></aside>
    </div>
    <section v-if="stories.length" class="editorial-stories"><div class="section-rule"><h2>Stories</h2></div><StoryRail :items="stories" /></section>
    <section class="colophon"><span class="colophon-mark" aria-hidden="true">✳</span><div><h2>Versões anteriores</h2><p>Os outros visuais do site estão no histórico.</p></div><NuxtLink to="/arquivo">Ver histórico ↗</NuxtLink></section>
  </main>
</template>
