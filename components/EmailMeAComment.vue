<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const props = defineProps(['pageTitle'])
const { t } = useI18n()

const emailLink = computed(() => {
  //const value = t('email_me_a_comment.email')
  return `mailto:oi@marcal.dev?subject=${encodeURIComponent(props.pageTitle)}`;

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