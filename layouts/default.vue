<script setup lang="ts">
const route = useRoute()
const config = useAppConfig()
const {page} = useContent()

const headOpen = ref(false)
const headerClass = computed(() => {
  return {
    'is-head-open': headOpen.value
  }
})
const pageUrl = computed(() => {
  return config.site.baseUrl + route.path
})

useContentHead(page)

useSeoMeta({
  ogUrl: pageUrl
})

useHead({
  htmlAttrs: {
    lang: 'pt-BR'
  },
  link: [
    {
      rel: 'canonical',
      href: pageUrl
    },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Feed RSS',
      href: config.site.baseUrl + '/rss.xml'
    },
    {
      rel: 'alternate',
      type: 'application/atom+xml',
      title: 'Feed Atom',
      href: config.site.baseUrl + '/atom.xml'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
})

</script>

<template>
  <div class="site" :class="headerClass">
    <HeaderSite @is-head-open="() => headOpen = !headOpen"/>
    <slot/>
  </div>
</template>

<style scoped>

@media (max-width: 991px) {
  .is-head-open #head {
    background-color: #12283d;
  }
}

</style>