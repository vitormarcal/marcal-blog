<script setup lang="ts">
const headOpen = ref(false)
const headerClass = computed(() => {
  return {
    'is-head-open': headOpen.value
  }
})
const route = useRoute()
useHead({
  htmlAttrs: {
    lang: 'pt-BR'
  },
  link: [
    {
      rel: 'canonical',
      href: 'https://wwww.marcal.dev' + route.path
    }
  ]
})

</script>

<template>
  <div class="site" :class="headerClass">
    <HeaderSite @is-head-open="() => headOpen = !headOpen"/>
    <slot/>
  </div>
</template>

<style scoped>

@media (max-width: 991px) {
  .is-head-open #head {
    background-color: #12283d;
  }
}

</style>