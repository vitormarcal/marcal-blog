<script setup lang="ts">
import {useI18n} from "vue-i18n";

const { availableLocales, locale} = useI18n()

</script>

<template>
  <div class="head-set-locale-wrapper">
    <select v-model="locale" aria-label="Select site language">
      <option v-for="item in availableLocales" :key="item" :value="item">
        {{ item.toUpperCase() }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.head-set-locale-wrapper {
  margin-left: auto;
  display: flex;
  align-items: center;
  padding: 1rem;
  select {
    font-weight: 700;
    font-size: 1rem;
  }
}
</style>