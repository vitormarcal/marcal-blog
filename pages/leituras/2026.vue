<script setup lang="ts">
import YearReadsFromApi from "~/components/YearReadsFromApi.vue";

definePageMeta({
  documentDriven: false
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
