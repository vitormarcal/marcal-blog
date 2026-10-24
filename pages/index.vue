<script setup lang="ts">
import MinimalistaEscuroHome from '~/components/designs/minimalista-escuro/Home.vue'
import FanzinePessoalHome from '~/components/designs/fanzine-pessoal/Home.vue'
const { isMinimalistaEscuro } = useVisualDesign()
</script>

<template>
  <MinimalistaEscuroHome v-if="isMinimalistaEscuro" />
  <FanzinePessoalHome v-else />
</template>
