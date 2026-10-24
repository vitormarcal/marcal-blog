<script setup lang="ts">
definePageMeta({ documentDriven: false })
useSeoMeta({ title: 'História do site — Marçal', description: 'As edições visuais do site de Vítor Marçal, preservadas ao longo do tempo.' })
</script>

<template>
  <main class="editions-page">
    
    <h1>História do site</h1>
    <p>Aqui ficam as versões antigas do design deste site.</p>
    <article class="edition-card">
      <div class="edition-swatch caderno" aria-hidden="true">Marçal <small>notas pessoais</small></div>
      <h2>02 — Caderno pessoal</h2>
      <p>Outubro de 2026 · Caderno escuro, arte e registros do que leio, vejo e ouço.</p>
      <NuxtLink to="/">Ver edição atual ↗</NuxtLink>
      <a href="/arquivo/caderno-2026.tar.gz" download>Baixar o código preservado ↓</a>
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
