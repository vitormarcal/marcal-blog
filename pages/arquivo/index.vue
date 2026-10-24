<script setup lang="ts">
definePageMeta({ documentDriven: false })
useSeoMeta({ title: 'História do site — Marçal', description: 'As edições visuais do site de Vítor Marçal, preservadas ao longo do tempo.' })
</script>

<template>
  <main class="editions-page">
    
    <h1>História do site</h1>
    <p>Os visuais que o site já teve.</p>
    <p>As edições mostram o conteúdo atual. Os arquivos para download guardam o código da época, sem duplicar as imagens.</p>
    <article class="edition-card">
      <div class="edition-swatch revista" aria-hidden="true">Marçal. ◆</div>
      <h2>02 — Revista pessoal</h2>
      <p>Outubro de 2026 · Fundo claro, títulos serifados e capas de livros.</p>
      <NuxtLink to="/arquivo/revista-2026">Visitar esta edição ↗</NuxtLink>
      <a href="/arquivo/revista-2026.tar.gz" download>Baixar o código preservado ↓</a>
    </article>
    <article class="edition-card">
      <div class="edition-swatch original" aria-hidden="true">Marçal</div>
      <h2>01 — Preto & verde</h2>
      <p>Até outubro de 2026 · Fundo preto e links verdes.</p>
      <NuxtLink to="/arquivo/original">Visitar esta edição ↗</NuxtLink>
      <a href="/arquivo/original-2026-10-24.tar.gz" download>Baixar o código preservado ↓</a>
    </article>
  </main>
</template>
