<script setup lang="ts">
const props = defineProps(['pageTitle', 'emailAddress'])

const emailLink = computed(() => {
  return `mailto:${props.emailAddress}?subject=${encodeURIComponent(props.pageTitle)}`;

});
</script>

<template>
  <div class="email-me-a-comment">
    <p>Blogues são conversas</p>
    <a :href="emailLink">Entre na conversa via e-mail</a>
  </div>
</template>

<style scoped>

.email-me-a-comment {
  text-align: center;
  margin-top: 20px;
}

</style>