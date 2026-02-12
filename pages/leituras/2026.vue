<script setup lang="ts">
import YearReadsFromApi from "~/components/YearReadsFromApi.vue";

definePageMeta({
  documentDriven: false
})

const title = "Leituras de 2026"
const description = "Acompanhe as leituras do ano de 2026."

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
          <year-reads-from-api :year="2026" />
        </div>
      </main>
    </section>
  </div>
</template>

<style scoped>

</style>
