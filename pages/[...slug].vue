<template>
  <div class="site">
    <header>
      <a href="/"> Marçal </a>
    </header>
   <main-content />
  </div>

</template>
<style>

.site {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

</style>
<script setup lang="ts">
const { page } = useContent()
</script>