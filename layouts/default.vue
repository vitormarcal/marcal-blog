<script setup lang="ts">
import OriginalLayout from '~/components/editions/original/OriginalLayout.vue'
import RevistaLayout from '~/components/editions/revista2026/RevistaLayout.vue'
const { isOriginal } = useVisualEdition()
// SSR writes the initial classes; the browser owns subsequent theme switches.
// This also removes classes inherited from a prerendered page with another edition.
if (import.meta.server) {
  useHead(() => ({
    htmlAttrs: { lang: 'pt-BR', class: isOriginal.value ? 'default' : 'default editorial' },
    bodyAttrs: { class: isOriginal.value ? 'default' : 'default editorial' }
  }))
}
onMounted(() => {
  watch(isOriginal, (original) => {
    for (const element of [document.documentElement, document.body]) {
      element.classList.add('default')
      element.classList.toggle('editorial', !original)
    }
  }, { immediate: true, flush: 'post' })
})
</script>

<template>
  <OriginalLayout v-if="isOriginal"><slot /></OriginalLayout>
  <RevistaLayout v-else><slot /></RevistaLayout>
</template>
