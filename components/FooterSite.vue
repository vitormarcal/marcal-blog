<script setup lang="ts">
const thisYear = computed(() => new Date().getFullYear())

</script>

<template>
  <footer>
    <hr/>
    <span>© 2019-{{thisYear}} {{ $t('footer.made_with') }}  </span>
  </footer>

</template>

<style scoped>
footer {
  text-align: center;
  color: hsla(0, 0%, 100%, .64);
  font-size: 16px;
}
hr  {
  height: 1px;
}
</style>