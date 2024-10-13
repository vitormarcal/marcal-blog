<script setup lang="ts">
const thisYear = computed(() => new Date().getFullYear())

</script>

<template>
  <footer>
    <hr aria-hidden="true"/>
    <span>© 2019-{{thisYear}} {{ $t('footer.made_with') }}  </span>
  </footer>

</template>

<style scoped>
footer {
  text-align: center;
  color: hsla(0, 0%, 100%, .64);
  font-size: 16px;
  padding: 1rem 0;
}
hr  {
  height: 1px;
}
</style>