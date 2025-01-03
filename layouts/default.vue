<script setup lang="ts">
import FooterSite from "~/components/FooterSite.vue";

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
  bodyAttrs: {
    class: 'default'
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
      href: '/favicon.ico'
    }
  ]
})

</script>

<template>
  <div class="site" :class="headerClass">
    <HeaderSite @is-head-open="() => headOpen = !headOpen"/>
    <slot/>
    <FooterSite />
  </div>
</template>

<style lang="scss">

body.default {
  background-color: $bg-color;
  color: $font-color;
  min-height: 100vh;
  text-rendering: optimizespeed;
  margin: 0;

  .site {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-section {
    flex-grow: 1;
    padding: clamp(2.8rem, 2.8rem + 1.5vw, 4rem) clamp(24px, 1.032rem + 1.9355vw, 48px) 0rem;

    main {
      margin: 0 auto;
      max-width: 1440px;
    }
  }

}
</style>