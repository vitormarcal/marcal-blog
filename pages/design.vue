<script setup lang="ts">
definePageMeta({ documentDriven: false })
useSeoMeta({ title: 'Design do site — Marçal', description: 'Os layouts do site de Vítor Marçal.' })
</script>

<template>
  <main class="designs-page">
    
    <h1>Design do site</h1>
    <p>Dois momentos diferentes deste site, preservados para visitar.</p>
    <article class="design-card">
      <div class="design-swatch fanzine-pessoal" aria-hidden="true">Marçal <small>notas pessoais</small></div>
      <h2>Fanzine pessoal</h2>
      <p>Outubro de 2026 · Fundo escuro, recortes de arte e registros do que leio, vejo e ouço.</p>
      <NuxtLink to="/design/fanzine-pessoal">Visitar o layout ↗</NuxtLink>
      <a href="/arquivo/design-fanzine-pessoal-2026.tar.gz" download>Baixar o código preservado ↓</a>
    </article>
    <article class="design-card">
      <div class="design-swatch minimalista-escuro" aria-hidden="true">Marçal</div>
      <h2>Minimalista escuro</h2>
      <p>Até outubro de 2026 · Fundo preto e links verdes.</p>
      <NuxtLink to="/design/minimalista-escuro">Visitar o layout ↗</NuxtLink>
      <a href="/arquivo/design-minimalista-escuro-2026-10-24.tar.gz" download>Baixar o código preservado ↓</a>
    </article>
  </main>
</template>
