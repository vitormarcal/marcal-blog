<script setup lang="ts">
import OriginalHome from '~/components/editions/original/OriginalHome.vue'
import Edition02Home from '~/components/editions/edition-02/Home.vue'
const { isOriginal } = useVisualEdition()
</script>

<template>
  <OriginalHome v-if="isOriginal" />
  <Edition02Home v-else />
</template>
