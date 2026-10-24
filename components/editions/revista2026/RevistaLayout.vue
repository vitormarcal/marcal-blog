<script setup lang="ts">
import '~/assets/css/editions/revista2026.css'
const route = useRoute()
const config = useAppConfig()
const year = new Date().getFullYear()
const menuOpen = ref(false)
watch(() => route.fullPath, () => { menuOpen.value = false })
const navigation = [
  ['Publicações', '/publicacoes'], ['Leituras', '/leituras/2026'],
  ['Músicas', '/musicas'], ['Filmes', `/filmes/${year}`],
  ['Séries', `/series/${year}`], ['Sobre', '/sobre']
]
useHead(() => ({
  link: [
    { rel: 'canonical', href: config.site.baseUrl + route.path },
    { rel: 'alternate', type: 'application/rss+xml', title: 'Feed RSS', href: '/rss.xml' },
    { rel: 'icon', href: '/favicon.ico' }
  ]
}))
useSeoMeta({ ogUrl: () => config.site.baseUrl + route.path })
</script>

<template>
  <div class="magazine-site">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header class="magazine-header">
      <div class="masthead-meta"><span>Página pessoal de Vítor Marçal</span><NuxtLink to="/arquivo">Histórico do site ↗</NuxtLink></div>
      <div class="masthead"><NuxtLink class="magazine-logo" to="/" aria-label="Marçal — página inicial">Marçal<span>◆</span></NuxtLink><p>Livros, filmes<br />e música.</p></div>
      <button class="magazine-menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="magazine-nav" @click="menuOpen = !menuOpen">{{ menuOpen ? 'Fechar menu −' : 'Menu +' }}</button>
      <nav id="magazine-nav" class="magazine-nav" :class="{ 'is-open': menuOpen }" aria-label="Navegação principal">
        <NuxtLink v-for="[label, path] in navigation" :key="path" :to="path">{{ label }}</NuxtLink>
        <NuxtLink to="/random" class="surprise-link">Aleatório ↗</NuxtLink>
      </nav>
    </header>
    <div id="conteudo" class="magazine-content" tabindex="-1"><slot /></div>
    <footer class="magazine-footer"><div><NuxtLink class="footer-name" to="/">Marçal.</NuxtLink></div><div class="footer-links"><NuxtLink to="/arquivo">História do site</NuxtLink><a href="/rss.xml">RSS</a><NuxtLink to="/sobre">Sobre o autor</NuxtLink><span>Distrito Federal, Brasil · © 2019–{{ year }}</span></div></footer>
  </div>
</template>
