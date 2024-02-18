<template>
  <div>
    <NuxtPage />
  </div>
</template>
<style>
*, ::after, ::before {
  box-sizing: border-box;
}

body {
  background-color: #12283d;
  color: #fff;
  font-size: 1.6rem;
  line-height: 1.6;

  min-height: 100vh;
  text-rendering: optimizespeed;
  margin: 0;
  font-family: Manrope,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;;
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
  font-size: 3.5em;
}

h3 {
  font-size: 1.8em;
}

h4,h5,h6 {
  font-size: 1.5em;
}

blockquote, body, dd, dl, figure, h1, h2, h3, h4, h5, h6, p {
  margin: 0;
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

</style>
