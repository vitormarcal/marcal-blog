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




*, ::after, ::before {
  box-sizing: border-box;
}

html.default {
  overflow-x: hidden;
  box-sizing: border-box;
  height: 100%;

  --bg-color: #000;
  --font-color: #fff;
  --green: #8DB500;
  --link_color_visited: #6A8A38;
  --link_color: var(--green);


  // Variables
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

iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  border: 0;
  display: block;
  overflow: hidden;
}

input,
button {
  border: none;
  background-image: none;
  background-color: transparent;
  -webkit-box-shadow: none;
  box-shadow: none;
}

blockquote, body, dd, dl, figure, h1, h2, h3, h4, h5, h6, p {
  margin: 0;
}


// Base styles
.font-family {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial,
  "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
  "Segoe UI Symbol", "Noto Color Emoji";
}

.text-style {
  @extend .font-family;
  font-weight: 400;
  line-height: var(--text-line-height);
  letter-spacing: var(--text-letter-spacing);
  font-size: var(--text-regular);
}

body.default {
  @extend .text-style;
  // Typography
  h1 {
    @extend .font-family;
    color: var(--font-color);
    font-size: var(--title-large);
    font-weight: 400;
    line-height: var(--title-line-height);
    letter-spacing: var(--title-letter-spacing);
  }

  h2 {
    @extend h1;
    font-size: var(--title-medium);
  }

  h3 {
    @extend h1;
    font-size: var(--title-small);
  }

  h4, h5, h6 {
    @extend h1;
    font-size: var(--title-small-2);
  }
}



// Responsive styles
@media (max-width: 767px) {
  body.default {
    h1 {
      font-size: var(--title-medium);
    }

    h2 {
      font-size: var(--title-small);
    }

    h3 {
      font-size: var(--title-small-2);
    }
  }

}

:root {
  interpolate-size: allow-keywords;
}

details {
  height: 1.5rem;
  transition: height 500ms ease;
}

details[open] {
  height: auto;
  overflow: clip;

  p {
    font-size: .95em;
    line-height: 1.5em;
    margin-top: .95em;
    margin-bottom: 0;
    margin-left: 1.2rem;
  }
}

a {
  text-decoration: underline;
  color: var(--link_color);
  word-break: break-word;

  h4 {
    color: inherit;
  }

  &:hover {
    opacity: .8;
  }

  &:visited {
    color: var(--link_color_visited);
  }

  &[href^="http://"]:not([href*="marcal.dev"]),
  &[href^="https://"]:not([href*="marcal.dev"]) {
    &:after {
      content: "";
      display: inline-block;
      width: 11px;
      height: 11px;
      margin-left: 4px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%238DB500' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z'/%3E%3Cpath fill-rule='evenodd' d='M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z'/%3E%3C/svg%3E");
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
}

img {
  height: auto;
  width: 100%;
  display: block;
  max-width: 100%;

  &[src^="/img/profile-image.svg"] {
    width: 75%;
    margin: auto;
  }
}

hr {
  color: hsla(0, 0%, 100%, .2);
  height: 1px;
  width: 100%;
}

blockquote {
  border-left: 4px solid var(--green);
  padding-left: 1rem;
  margin-top: calc(2.4em*1.5);
}

code {
  font-size: 15px;
  font-family: JetBrains Mono, Menlo, Consolas, Monaco, Liberation Mono,
  Lucida Console, monospace;
}

pre {
  background: #2d2d2d;
  padding: 1em;
  margin: .5em 0;
  overflow: auto;
}

:not(pre) > code {
  background-color: rgba(0,0,0,.1);;
  border-radius: 3px;
  color: var(--green);
  padding: .4rem;
}

figure.youtube {
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;

  .inner-figure {
    position: relative;
    width: 100%;
    padding-top: 56.5%;
  }

  .inner > * {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
  }

  figcaption {
    margin-top: 0.6rem;
    font-size: 0.8rem;
  }
}



body.default {
  background-color: var(--bg-color);
  color: var(--font-color);
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