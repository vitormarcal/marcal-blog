<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const props = defineProps(['pageTitle'])
const { t } = useI18n()


const emailLink = computed(() => {
  return `mailto:${t('email_me_a_comment.address')}?subject=${encodeURIComponent(props.pageTitle)}`;

});
</script>

<template>
  <div class="email-me-a-comment">
    <h3>{{ $t('email_me_a_comment.title') }}</h3>
    <a :aria-label="$t('email_me_a_comment.call_to_action')" :href="emailLink">{{ $t('email_me_a_comment.call_to_action') }}</a>
  </div>
</template>

<style scoped>

.email-me-a-comment {
  text-align: center;
  line-height: 1.7;
}

.email-me-a-comment h3 {
  font-size: 20px;
  margin-bottom: 1rem;
}

</style>