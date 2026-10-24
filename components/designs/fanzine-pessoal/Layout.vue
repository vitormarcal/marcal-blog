<script setup lang="ts">
import '~/assets/css/designs/fanzine-pessoal.css'
import ArtworkRail from '~/components/designs/fanzine-pessoal/ArtworkRail.vue'
import MediaPulseRail from '~/components/designs/fanzine-pessoal/MediaPulseRail.vue'
const { stories } = useStoriesCatalog()
const route = useRoute()
const config = useAppConfig()
const year = new Date().getFullYear()
const menuOpen = ref(false)
watch(() => route.fullPath, () => { menuOpen.value = false })
const navigation = [
  ['Publicações', '/publicacoes'], ['Leituras', `/leituras/${year}`],
  ['Músicas', '/musicas'], ['Filmes', `/filmes/${year}`],
  ['Séries', `/series/${year}`], ['Artes', '/artes'], ['Sobre', '/sobre']
]
useHead(() => ({
  link: [
    { rel: 'canonical', href: config.site.baseUrl + route.path },
    { rel: 'alternate', type: 'application/rss+xml', title: 'Feed RSS', href: '/rss.xml' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon-fanzine.svg', sizes: 'any' }
  ]
}))
useSeoMeta({ ogUrl: () => config.site.baseUrl + route.path })
</script>

<template>
  <div class="magazine-site">
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div class="magazine-main">
      <header class="magazine-header">
        <div class="masthead-meta"><span>Página pessoal de Vítor Marçal</span><NuxtLink to="/design">Design do site ↗</NuxtLink></div>
        <div class="masthead"><NuxtLink class="magazine-logo" to="/" aria-label="Marçal — página inicial">Marçal<span>notas pessoais</span></NuxtLink><p>Literatura, cinema, música<br />e coisas do cotidiano.</p></div>
        <button class="magazine-menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="magazine-nav" @click="menuOpen = !menuOpen">{{ menuOpen ? 'Fechar menu −' : 'Abrir navegação +' }}</button>
        <nav id="magazine-nav" class="magazine-nav" :class="{ 'is-open': menuOpen }" aria-label="Navegação principal">
          <NuxtLink v-for="[label, path] in navigation" :key="path" :to="path">{{ label }}</NuxtLink>
          <NuxtLink to="/random" class="surprise-link">Surpreenda-me ↗</NuxtLink>
        </nav>
      </header>
      <div id="conteudo" class="magazine-content" tabindex="-1"><slot /></div>
    </div>
    <aside class="cabinet-rail" aria-label="Índice e curiosidades">
      <NuxtLink class="rail-home" to="/" aria-label="Voltar à página inicial">M<span>✳</span></NuxtLink>
      <div class="rail-caption"><span>Arquivo pessoal</span><span>·</span><span>Brasília, BR</span></div>
      <ArtworkRail />
      <StoryRail v-if="stories.length" :items="stories" placement="sidebar" />
      <MediaPulseRail />
      <section class="rail-findings">
        <span class="rail-label">Explorar</span>
        <NuxtLink to="/tags/mdc">Índice de assuntos <b>↗</b></NuxtLink>
      </section>
      <NuxtLink to="/slashes" class="rail-slashes">
        <img src="/img/slash.jpg" alt="Slash tocando guitarra" />
        <span><strong>Slashes</strong><small>Páginas independentes do site&nbsp; ↗</small></span>
      </NuxtLink>
      <NuxtLink to="/gustav-klimt-e-elfen-lied" class="rail-gif" aria-label="Ler Gustav Klimt e Elfen Lied"><img src="/img/gustav-klimt-e-elfen-lied/elfen-lied-1.gif" alt="Golden Tears, pintura de Anne Marie Zilberman associada à abertura de Elfen Lied" /><span>Golden Tears · Elfen Lied&nbsp; ↗</span></NuxtLink>
      <div class="rail-bottom"><a href="/rss.xml">RSS</a><NuxtLink to="/sobre">Sobre</NuxtLink><span>© {{ year }}</span></div>
    </aside>
    <footer class="magazine-footer"><div><NuxtLink class="footer-name" to="/">Marçal.</NuxtLink></div><div class="footer-links"><NuxtLink to="/design">Design do site</NuxtLink><a href="/rss.xml">RSS</a><NuxtLink to="/sobre">Sobre o autor</NuxtLink><span>Distrito Federal, Brasil · © 2019–{{ year }}</span></div></footer>
  </div>
</template>
