<script setup lang="ts">
definePageMeta({
  documentDriven: false,
  alias: ['/gouts']
})

await navigateTo('/stories/gostos', { redirectCode: 301, replace: true })
</script>
