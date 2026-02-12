<script setup lang="ts">
import FooterSite from "~/components/FooterSite.vue";

const route = useRoute()
const config = useAppConfig()

const headOpen = ref(false)
const headerClass = computed(() => {
  return {
    'is-head-open': headOpen.value
  }
})
const pageUrl = computed(() => {
  return config.site.baseUrl + route.path
})

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
    <FooterSite/>
  </div>
</template>

<style>

body.default {
  --bg-color: #000;
  --font-color: #fff;
  --green: #8DB500;
  --link_color_visited: #6A8A38;
  --link_color: var(--green);

  --blockquote-border-color: var(--green);
  --inline-code-color: var(--green);

  --title-large: 2.875em;
  --title-medium: 2.5em;
  --title-small: 1.8em;
  --title-small-2: 1.5em;

  --title-line-height: 1.15;
  --title-letter-spacing: -0.02em;

  --text-regular: 1.6rem;
  --text-line-height: 1.6;
  --text-letter-spacing: -0.02em;
}

/* Base styles */
.font-family,
.text-style,
body.default,
body.default :is(h1, h2, h3, h4, h5, h6) {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial,
  "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
  "Segoe UI Symbol", "Noto Color Emoji";
}

.text-style,
body.default {
  font-weight: 400;
  line-height: var(--text-line-height);
  letter-spacing: var(--text-letter-spacing);
  font-size: var(--text-regular);
}

/* Typography */
body.default :is(h1, h2, h3, h4, h5, h6) {
  color: var(--font-color);
  font-weight: 400;
  line-height: var(--title-line-height);
  letter-spacing: var(--title-letter-spacing);
}

body.default h1 { font-size: var(--title-large); }
body.default h2 { font-size: var(--title-medium); }
body.default h3 { font-size: var(--title-small); }
body.default :is(h4, h5, h6) { font-size: var(--title-small-2); }

/* Responsive typography */
@media (max-width: 767px) {
  body.default h1 { font-size: var(--title-medium); }
  body.default h2 { font-size: var(--title-small); }
  body.default h3 { font-size: var(--title-small-2); }
}

/* YouTube figure */
figure.youtube {
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
}

figure.youtube .inner-figure {
  position: relative;
  width: 100%;
  padding-top: 56.5%;
}

figure.youtube .inner > * {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

figure.youtube figcaption {
  margin-top: 0.6rem;
  font-size: 0.8rem;
}

/* Layout */
body.default {
  background-color: var(--bg-color);
  color: var(--font-color);
  min-height: 100vh;
  text-rendering: optimizespeed;
  margin: 0;
}

body.default .site {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

body.default .main-section {
  flex-grow: 1;
  padding: clamp(2.8rem, 2.8rem + 1.5vw, 4rem)
  clamp(24px, 1.032rem + 1.9355vw, 48px)
  0rem;
}

body.default .main-section main {
  margin: 0 auto;
  max-width: 1440px;
}

/* Cafeteria list */
body.default .cafeteria li {
  list-style-type: none;
  padding-left: 0;
}

body.default .cafeteria li::before {
  content: "☕";
  margin-right: 8px;
  color: brown;
  font-size: 1.2em;
}

/* Post section */
body.default .post-section {
  margin-top: 10px;
  line-height: 1.7;
  position: relative;

  font-size: 20px;
  letter-spacing: 0;
  word-break: break-word;

  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

body.default .post-section > :is(p, ul, ol) {
  font-weight: 480;
}

body.default .post-section:not(.content-section) > p:first-of-type {
  margin-top: 2rem;
  color: hsla(0, 0%, 100%, 0.64);
  font-size: 24px;
  font-weight: 500;
  line-height: 1.45;
  max-width: 840px;
}

body.default .post-section > * {
  grid-column: 4 / span 6;
}

@media (max-width: 767px) {
  body.default .post-section > * {
    grid-column: 1 / span 12;
  }
}

.post-section > * + * {
  margin-bottom: 0;
  margin-top: calc(1.6em * 1.5);
}


</style>
