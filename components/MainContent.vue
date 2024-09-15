<script setup lang="ts">
defineProps(['path'])
const {page} = useContent()

</script>

<template>
  <main>
    <div>


      <ContentDoc class="post-section" :path="path" v-slot="{ doc }">

        <post-head
            :title="page.title"
            :description="page.description"
            :created_at="page.created_at"
            :updated_at="page.updated_at"
            :tags="page.tags"
            :localized_post_paths="page.localized_post_paths"
            :has_localized_posts="page.has_localized_posts"
        />

        <ContentRenderer :value="doc" class="post-section content-section"/>
      </ContentDoc>
      <div class="post-section">
        <slot/>
      </div>

    </div>
  </main>
</template>

<style>
main {
  flex-grow: 1;
  padding: clamp(2.8rem, 2.8rem + 1.5vw, 4rem) clamp(24px, 1.032rem + 1.9355vw, 48px) 8rem
}

main div {
  margin: 0 auto;
  max-width: 1440px;
}

.post-section {
  margin-top: 10px;

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

.post-section:not(.content-section)  > p:first-of-type {
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