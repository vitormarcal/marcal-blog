<script setup lang="ts">
import { formatDate } from '~/utils/date-utils'
const { data: posts } = await useAsyncData('revista-2026-home', () => queryContent()
  .where({ is_post: true, _partial: false }).sort({ created_at: -1 }).limit(8).without(['body']).find())
const postImage = (post: any) => {
  if (!post.image || typeof post.image !== 'string') return undefined
  if (/^(https?:\/\/|\/)/.test(post.image)) return post.image
  return '/' + post.image
}
const { stories } = useStoriesCatalog()
useSeoMeta({ title: 'Vítor Marçal', description: 'Essa é a minha página pessoal, onde eu escrevo principalmente para mim mesmo.' })
</script>

<template>
  <main class="editorial-home">
    <div class="edition-line"><span>Notas · cultura · curiosidades</span><span>Brasília, Brasil <i aria-hidden="true">✳</i></span></div>
    <section class="home-intro"><span class="home-kicker"><i aria-hidden="true">●</i> Uma página pessoal</span><h1>Anoto aqui o que eu<br />leio, vejo e <em>ouço.</em></h1><p>Às vezes escrevo sobre essas coisas. Às vezes só deixo uma referência para não esquecer.</p><span class="home-coordinate">15°47′ S · 47°52′ W&nbsp; / &nbsp;desde 2019</span></section>
    <div class="front-page-grid">
      <section class="lead-story" aria-labelledby="latest-title">
        <div class="section-rule"><h2 id="latest-title">Últimas anotações</h2><span>do caderno</span></div>
        <article v-for="(post, index) in posts" :key="post._path" class="pulp-post" :class="{ 'pulp-post--lead': index === 0 }">
          <div class="pulp-post-meta"><span><i aria-hidden="true">✳</i> {{ post.tags?.[0]?.replaceAll('-', ' ') || 'Caderno pessoal' }}</span><time :datetime="post.created_at">{{ formatDate(post.created_at) }}</time></div>
          <h2><NuxtLink :to="post._path">{{ post.title }}</NuxtLink></h2>
          <p v-if="post.description" class="pulp-deck">{{ post.description }}</p>
          <NuxtLink v-if="postImage(post)" :to="post._path" class="pulp-post-image" :aria-label="post.title"><img :src="postImage(post)" :alt="post.title" :loading="index === 0 ? 'eager' : 'lazy'" /></NuxtLink>
          <NuxtLink class="pulp-read" :to="post._path">Abrir anotação <span aria-hidden="true">↗</span></NuxtLink>
        </article>
        <p v-if="!posts?.length" class="empty-notes">Nenhuma publicação por enquanto.</p>
        <NuxtLink class="archive-link" to="/publicacoes">Percorrer o caderno inteiro <span>↗</span></NuxtLink>
      </section>
    </div>
    <section v-if="stories.length" class="editorial-stories"><div class="section-rule"><h2>Stories</h2></div><StoryRail :items="stories" /></section>
  </main>
</template>
