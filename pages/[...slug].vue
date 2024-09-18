<template>
  <div>
    <main-content>
      <template v-if="showCommentArea">
        <hr style="margin-top: 5rem"/>
        <email-me-a-comment :page-title="page.title"  />
        <hr style="margin-top: 5rem"/>
        <iam-not-a-robot/>
      </template>
      <hr/>
    </main-content>
  </div>

</template>
<style>

</style>
<script setup lang="ts">
import EmailMeAComment from "~/components/EmailMeAComment.vue";
import IamNotARobot from "~/components/IamNotARobot.vue";

const { page } = useContent()

const showCommentArea = computed(() => {
  return true
})
</script>