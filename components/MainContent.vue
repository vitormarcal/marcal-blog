<script setup lang="ts">
defineProps(['path'])
const {page} = useContent()

</script>

<template>
  <main>
    <div>
      <ContentDoc class="post-section" :path="path"/>
      <div class="post-section">
        <slot />
      </div>

    </div>
  </main>
</template>

<style>
main {
  flex-grow: 1;
  padding: clamp(4.8rem, 4rem + 2.5vw, 8rem) clamp(24px, 1.7032rem + 1.9355vw, 48px) 8rem;
}

main div {
  margin: 0 auto;
  max-width: 1440px;
}

.post-section {
  margin-top: 80px;

  line-height: 1.7;
  position: relative;

  font-size: 20px;
  letter-spacing: 0;
  word-break: break-word;

  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.post-section > :is(p, ul, ol) {
  font-weight: 480;
}

.post-section > p:first-of-type {
  margin-top: 2rem;
  color: hsla(0, 0%, 100%, .64);
  font-size: 24px;
  font-weight: 500;
  line-height: 1.45;
  max-width: 840px;
}

.post-section > * {
  grid-column: 4/span 6;
}

@media (max-width: 767px) {
  .post-section > * {
    grid-column: 1/span 12;
  }
}

.post-section > * + * {
  margin-bottom: 0;
  margin-top: calc(1.6em * 1.5);
}
</style>