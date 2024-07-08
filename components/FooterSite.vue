<script setup lang="ts">
const thisYear = computed(() => new Date().getFullYear())

</script>

<template>
  <footer>
    <hr/>
    <span>@ {{thisYear}} <nuxt-link to="/">Vítor Marçal</nuxt-link> </span>
    <hr/>
  </footer>

</template>

<style scoped>
footer {
  text-align: center;
  color: hsla(0, 0%, 100%, .64);
  font-size: 16px;
}
</style>