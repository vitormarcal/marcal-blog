<script setup lang="ts">
const props = defineProps(['paths'])

const languages = computed(() => {
  if (props.paths == undefined || props.paths.length == 0) {
    return []
  }
  return props.paths.map(it => it.replace(/^\[\[|\]\]$/g, '')).map(it => {
    if (it.startsWith('en/')) {
      return {text: 'To read in English,', textLink: 'click here', link: `/${it}`}
    } else if (it.startsWith('fr/')) {
      return {text: 'Pour lire en français,', textLink: 'cliquez ici', link: `/${it}`}
    } else {
      return {text: 'Para ler em português,', textLink: 'clique aqui', link: `/${it}`}
    }
  })
})
</script>

<template>
  <ul class="localized-post-paths">
    <li v-for="lang in languages" :key="lang.link">
      {{ lang.text }}
      <NuxtLink :aria-label="`${lang.text} ${lang.textLink}`" :to="lang.link">{{ lang.textLink }}</NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    margin-bottom: 0.5rem;
  }
}
</style>