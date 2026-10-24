<script setup lang="ts">
import MinimalistaEscuroLayout from '~/components/designs/minimalista-escuro/Layout.vue'
import FanzinePessoalLayout from '~/components/designs/fanzine-pessoal/Layout.vue'
const { isMinimalistaEscuro } = useVisualDesign()
// SSR writes the initial design class; the browser owns subsequent design switches.
// This removes classes inherited from a prerendered page with another design.
if (import.meta.server) {
  useHead(() => ({
    htmlAttrs: { lang: 'pt-BR', class: isMinimalistaEscuro.value ? 'design-minimalista-escuro' : 'design-fanzine-pessoal' },
    bodyAttrs: { class: isMinimalistaEscuro.value ? 'design-minimalista-escuro' : 'design-fanzine-pessoal' }
  }))
}
onMounted(() => {
  watch(isMinimalistaEscuro, (minimalistaEscuro) => {
    for (const element of [document.documentElement, document.body]) {
      element.classList.remove('design-minimalista-escuro', 'design-fanzine-pessoal')
      element.classList.add(minimalistaEscuro ? 'design-minimalista-escuro' : 'design-fanzine-pessoal')
    }
  }, { immediate: true, flush: 'post' })
})
</script>

<template>
  <MinimalistaEscuroLayout v-if="isMinimalistaEscuro"><slot /></MinimalistaEscuroLayout>
  <FanzinePessoalLayout v-else><slot /></FanzinePessoalLayout>
</template>
