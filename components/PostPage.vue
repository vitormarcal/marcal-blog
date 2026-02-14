<script setup lang="ts">

import EmailMeAComment from "~/components/EmailMeAComment.vue";
import FollowViaFeed from "~/components/FollowViaFeed.vue";
import IamNotARobot from "~/components/IamNotARobot.vue";

const { page } = useContent()

const showCommentArea = computed(() => {
  return true
})


</script>

<template>
  <div>
    <main-content v-if="page">
      <template v-if="showCommentArea">
        <hr style="margin-top: 5rem"/>
        <email-me-a-comment :page-title="page.title"  />
        <hr style="margin-top: 5rem"/>
        <follow-via-feed/>
        <hr style="margin-top: 5rem"/>
        <iam-not-a-robot/>
      </template>
    </main-content>
  </div>
</template>

<style scoped>

</style>
