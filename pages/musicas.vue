<script setup lang="ts">
import TimeTunnel from "~/components/content/TimeTunnel.vue";
import MusicJournal from "~/components/designs/fanzine-pessoal/MusicJournal.vue";

definePageMeta({
  documentDriven: false
})

const { isMinimalistaEscuro } = useVisualDesign()
const title = computed(() => isMinimalistaEscuro.value ? 'Linha do Tempo Musical — Marçal' : 'Músicas — Marçal')
const description = computed(() => isMinimalistaEscuro.value
  ? 'Visualize sua linha do tempo musical em tempo quase real.'
  : 'Um caderno de escuta com discos, artistas e faixas que passaram por aqui.')

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <div>
    <section class="main-section">
      <main>
      <div v-if="isMinimalistaEscuro" class="post-section content-section"><TimeTunnel /></div>
      <MusicJournal v-else />
      </main>
    </section>
  </div>
</template>

<style scoped>

</style>
