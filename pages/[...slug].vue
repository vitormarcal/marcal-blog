<template>
  <div>
    <main-content>
      <template v-if="showCommentArea">
        <hr/>
        <email-me-a-comment :email-address="'oi@marcal.dev'" :page-title="page.title" />
      </template>
      <hr/>
    </main-content>
  </div>

</template>
<style>

</style>
<script setup lang="ts">
import EmailMeAComment from "~/components/EmailMeAComment.vue";

const { page } = useContent()

const showCommentArea = computed(() => {
  return true
})
</script>