<script setup lang="ts">
const props = defineProps(['pageTitle', 'emailAddress'])

const emailLink = computed(() => {
  return `mailto:${props.emailAddress}?subject=${encodeURIComponent(props.pageTitle)}`;

});
</script>

<template>
  <div class="email-me-a-comment">
    <p>{{ $t('email_me_a_comment.title') }}</p>
    <a :href="emailLink">{{ $t('email_me_a_comment.call_to_action') }}</a>
  </div>
</template>

<style scoped>

.email-me-a-comment {
  text-align: center;
  margin-top: 20px;
}

</style>