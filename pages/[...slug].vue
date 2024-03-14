<template>
  <div>
    <main-content>
      <comment-area v-if="isPost"/>
    </main-content>
  </div>

</template>
<style>
.isso-comment.isso-is-page-author > .isso-text-wrapper {
  background: #1b344d;
}

.isso-comment > .isso-text-wrapper > .isso-comment-header > .isso-author {
  color: white;
}

.isso-comment.isso-is-page-author > .isso-text-wrapper > .isso-comment-header > .isso-author, .isso-page-author-suffix {
  color: #8DB500;
}

.isso-auth-section > .isso-post-action > input {
  background: #8DB500;
  border-color: #8DB500;
}

span.marcal_email b {
  display: none;
}
</style>
<script setup lang="ts">
const { page } = useContent()

const isPost = computed(() => {
  return !!(page?.value?.is_post)
})
</script>