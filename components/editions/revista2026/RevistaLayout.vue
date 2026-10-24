<script setup lang="ts">
import '~/assets/css/editions/revista2026.css'
import ArtworkRail from '~/components/editions/revista2026/ArtworkRail.vue'
import MediaPulseRail from '~/components/editions/revista2026/MediaPulseRail.vue'
const route = useRoute()
const config = useAppConfig()
const year = new Date().getFullYear()
const menuOpen = ref(false)
watch(() => route.fullPath, () => { menuOpen.value = false })
const navigation = [
  ['Publicações', '/publicacoes'], ['Leituras', `/leituras/${year}`],
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
    <aside class="cabinet-rail" aria-label="Índice e curiosidades">
      <NuxtLink class="rail-home" to="/" aria-label="Voltar à página inicial">M<span>✳</span></NuxtLink>
      <div class="rail-caption"><span>Arquivo pessoal</span><span>·</span><span>Brasília, BR</span></div>
      <ArtworkRail />
      <MediaPulseRail />
      <nav class="rail-nav" aria-label="Explorar o arquivo">
        <span class="rail-label">Passagens</span>
        <NuxtLink to="/publicacoes"><span>01</span> Caderno</NuxtLink>
        <NuxtLink :to="`/leituras/${year}`"><span>02</span> Estante</NuxtLink>
        <NuxtLink :to="`/filmes/${year}`"><span>03</span> Cinema</NuxtLink>
        <NuxtLink to="/musicas"><span>04</span> Escutas</NuxtLink>
        <NuxtLink to="/series"><span>05</span> Episódios</NuxtLink>
        <NuxtLink to="/gostos"><span>06</span> Pequenos gostos</NuxtLink>
      </nav>
      <section class="rail-findings">
        <span class="rail-label">Mais coisas</span>
        <NuxtLink to="/random">Uma página ao acaso <b>↗</b></NuxtLink>
        <NuxtLink to="/tags/mdc">Índice de assuntos <b>↗</b></NuxtLink>
        <NuxtLink to="/arquivo">Versões anteriores <b>↗</b></NuxtLink>
      </section>
      <NuxtLink to="/gustav-klimt-e-elfen-lied" class="rail-gif" aria-label="Ler Gustav Klimt e Elfen Lied"><img src="/img/gustav-klimt-e-elfen-lied/elfen-lied-1.gif" alt="Golden Tears, pintura de Anne Marie Zilberman associada à abertura de Elfen Lied" /><span>Golden Tears · Elfen Lied&nbsp; ↗</span></NuxtLink>
      <div class="rail-bottom"><a href="/rss.xml">RSS</a><NuxtLink to="/sobre">Sobre</NuxtLink><span>© {{ year }}</span></div>
    </aside>
    <div class="magazine-main">
      <header class="magazine-header">
        <div class="masthead-meta"><span>Página pessoal de Vítor Marçal</span><NuxtLink to="/arquivo">Histórico do site ↗</NuxtLink></div>
        <div class="masthead"><NuxtLink class="magazine-logo" to="/" aria-label="Marçal — página inicial">Marçal<span>notas pessoais</span></NuxtLink><p>Literatura, cinema, música<br />e coisas do cotidiano.</p></div>
        <button class="magazine-menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="magazine-nav" @click="menuOpen = !menuOpen">{{ menuOpen ? 'Fechar menu −' : 'Abrir navegação +' }}</button>
        <nav id="magazine-nav" class="magazine-nav" :class="{ 'is-open': menuOpen }" aria-label="Navegação principal">
          <NuxtLink v-for="[label, path] in navigation" :key="path" :to="path">{{ label }}</NuxtLink>
          <NuxtLink to="/random" class="surprise-link">Surpreenda-me ↗</NuxtLink>
        </nav>
      </header>
      <div id="conteudo" class="magazine-content" tabindex="-1"><slot /></div>
      <footer class="magazine-footer"><div><NuxtLink class="footer-name" to="/">Marçal.</NuxtLink></div><div class="footer-links"><NuxtLink to="/arquivo">História do site</NuxtLink><a href="/rss.xml">RSS</a><NuxtLink to="/sobre">Sobre o autor</NuxtLink><span>Distrito Federal, Brasil · © 2019–{{ year }}</span></div></footer>
    </div>
  </div>
</template>
