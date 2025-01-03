<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'pt-BR'
  },
  bodyAttrs: {
    class: 'slide-layout'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico'
    }
  ]
})
</script>

<template>
  <main class="slide">
    <slot/>
  </main>
</template>

<style scoped>

.slide-layout {
  *, *:before, *:after {
    box-sizing: border-box;
  }

  @font-face {
    font-family: "Hex Franklin";
    font-weight: 1 999;
    font-stretch: 0% 100%;
  }

  main.slide {
    --font-family: "Hex Franklin", ui-sans-serif;
    --body-bg: #eee;
    --frame-border: 5px solid black;
    --frame-bg: rgba(255, 255, 255, 1);
    --frame-blur: blur(10px);
    --color-text: #111;
    --color-text-inverse: #fff;
    --color-text-copy-inverse: rgba(255, 255, 255, 0.7);
    --color-subtext: #777;
    --space-1: 20px;
    --font: clamp(1.4rem, 3vw, 1.4rem)/1.35 var(--font-family);
    --frame-width: 100%;
    --frame-max-width: 100%;
    --frame-height: calc(100vh);
    --noise: url('/images/noise.png');
  }

  @media screen and (min-width: 360px) {
    main.slide {
      --frame-max-width: 373px;
      --frame-height: calc(100vh - 80px);
    }
  }

  main.slide {
    background: var(--body-bg);
    background: linear-gradient(-139deg, #111 -6%, #999 100%);
    font: var(--font);
    position: relative;
    color: var(--color-text);
    overflow: hidden;
    min-height: -webkit-fill-available;
    display: grid;
    place-items: center;
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }

}

@media screen and (min-width: 360px) {
  .slide-layout {
    main.slide {
      padding-top: var(--space-1);
      padding-left: var(--space-1);
      padding-right: var(--space-1);
      padding-bottom: var(--space-1);
    }
  }
}

</style>