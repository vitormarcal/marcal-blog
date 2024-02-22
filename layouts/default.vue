<script setup lang="ts">
const headOpen = ref(false)
const headerClass = computed(() => {
  return {
    'is-head-open': headOpen.value
  }
})
</script>

<template>
  <div class="site" :class="headerClass">
    <HeaderSite @is-head-open="() => headOpen = !headOpen"/>
    <slot/>
  </div>
</template>

<style scoped>

</style>