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
    lang: 'pt-BR',
    class: 'default'
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

@import "~/assets/css/main.scss";

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

  .cafeteria {
    li {
      list-style-type: none;
      padding-left: 0;
      &::before {
        content: "☕";
        margin-right: 8px;
        color: brown;
        font-size: 1.2em;
      }
    }
  }

  .post-section {
    margin-top: 10px;

    line-height: 1.7;
    position: relative;

    font-size: 20px;
    letter-spacing: 0;
    word-break: break-word;

    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .post-section > :is(p, ul, ol) {
    font-weight: 480;
  }

  .post-section:not(.content-section)  > p:first-of-type {
    margin-top: 2rem;
    color: hsla(0, 0%, 100%, .64);
    font-size: 24px;
    font-weight: 500;
    line-height: 1.45;
    max-width: 840px;
  }

  .post-section > * {
    grid-column: 4/span 6;
  }
}

@media (max-width: 767px) {
  body.default {
    .post-section > * {
      grid-column: 1/span 12;
    }
  }
}

.post-section > * + * {
  margin-bottom: 0;
  margin-top: calc(1.6em * 1.5);
}

</style>