<script setup lang="ts">
import OriginalHome from '~/components/editions/original/OriginalHome.vue'
import RevistaHome from '~/components/editions/revista2026/RevistaHome.vue'
const { isOriginal } = useVisualEdition()
</script>

<template>
  <OriginalHome v-if="isOriginal" />
  <RevistaHome v-else />
</template>
