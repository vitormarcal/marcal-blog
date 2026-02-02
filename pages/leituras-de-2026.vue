<script setup lang="ts">
import MainContent from "~/components/MainContent.vue";
import YearReadsFromApi from "~/components/YearReadsFromApi.vue";

const { page } = useContent()
</script>

<template>
  <div>
    <main-content :path="page.path">
      <year-reads-from-api :year="2026" />
    </main-content>
  </div>
</template>

<style scoped>

</style>
