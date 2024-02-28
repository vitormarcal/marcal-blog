<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>
<script setup lang="ts">
</script>
<style>
*, ::after, ::before {
  box-sizing: border-box;
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

body {
  background-color: #12283d;
  color: #fff;
  font-size: 1.6rem;
  line-height: 1.6;

  min-height: 100vh;
  text-rendering: optimizespeed;
  margin: 0;
  font-family: Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;;
}

h1, h2, h3, h4, h5, h6 {
  color: #fff;;
  letter-spacing: -.02em;
  line-height: 1.15;
}

h1 {
  font-size: 4.6rem;
}

h2 {
  font-size: 2.5rem;
}

h3 {
  font-size: 1.8em;
}

h4, h5, h6 {
  font-size: 1.5em;
}

@media (max-width: 767px) {
  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.6em;
  }
}

blockquote, body, dd, dl, figure, h1, h2, h3, h4, h5, h6, p {
  margin: 0;
}

figcaption {
  color: hsla(0,0%,100%,.64);;
  line-height: 1.4;
  margin-top: 1.6rem;
  text-align: center;
  font-size: 1.3rem;
}

figcaption p {
  white-space: pre-wrap;
}

a {
  text-decoration: underline;
  color: #8DB500;
  word-break: break-word;
}

a:hover {
  opacity: .8;
}

:is(h1,h2, h3, h4,h5,h6) a {
  text-decoration: none;
  color: #fff;
}

span.obfuscated_email b {
  display: none;
}

img {
  height: auto;
  width: 100%;
  display: block;
  max-width: 100%;
}

hr {
  color: hsla(0, 0%, 100%, .2);
  height: 1px;
  width: 100%;
}

blockquote {
  border-left: 4px solid #8DB500;
  padding-left: 1rem;
  margin-top: calc(2.4em*1.5);
}

pre {
  background: #2d2d2d;
  padding: 1em;
  margin: .5em 0;
  overflow: auto;
}

code {
  font-size: 15px;
  font-family: JetBrains Mono,Menlo,Consolas,Monaco,Liberation Mono,Lucida Console,monospace;
}

:not(pre) > code {
  background-color: rgba(0,0,0,.1);;
  border-radius: 3px;
  color: #8DB500;
  padding: .4rem;
}


.audio-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 96px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px rgba(124,139,154,.25);
  padding: 1rem;
}

.audio-card audio {
  background-color: #12283d;
  color: #8DB500;
}

.site {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

</style>
