<script setup lang="ts">
const props = defineProps(['pageTitle'])
const emailAddress = 'eu@marcal.dev'
const emailTitle = 'Blogues são conversas'
const emailCallToAction = 'Entre na conversa via e-mail'

const emailLink = computed(() => {
  return `mailto:${emailAddress}?subject=${encodeURIComponent(props.pageTitle)}`
})
</script>

<template>
  <div class="email-me-a-comment">
    <h3>{{ emailTitle }}</h3>
    <a :aria-label="emailCallToAction" :href="emailLink">{{ emailCallToAction }}</a>
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
