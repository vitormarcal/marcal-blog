<script setup lang="ts">
defineProps(["iframe", "src"])
</script>

<template>
  <figure>
    <div class="inner-figure">
      <div>
        <iframe v-if="iframe"
                width="200" height="113"
                :src="src">
        </iframe>
      </div>
    </div>
    <figcaption>
      <slot name="description"/>
    </figcaption>

  </figure>
</template>

<style scoped>

figure {
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.inner-figure {
  position: relative;
  width: 100%;
  padding-top: 56.5%;
}

.inner > * {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
}

figcaption {
  margin-top: 0.6rem;
  font-size: 0.8rem;
}
</style>