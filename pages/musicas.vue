<script setup lang="ts">
import TimeTunnel from "~/components/content/TimeTunnel.vue";

definePageMeta({
  documentDriven: false
})

const title = "🎶 Linha do Tempo Musical"
const description = "Visualize sua linha do tempo musical em tempo quase real."

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
        <div class="post-section content-section">
          <TimeTunnel />
        </div>
      </main>
    </section>
  </div>
</template>

<style scoped>

</style>
