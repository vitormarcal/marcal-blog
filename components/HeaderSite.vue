<script setup lang="ts">

</script>

<template>
  <header>
    <div class="header-inner">
      <div class="head-brand">
        <div class="head-brand-wrapper">
          <a href="/" class="head-logo"> Marçal </a>
        </div>
      </div>
      <nav class="head-menu">
        <ul class="nav">
          <li><a href="/"><a href="/"> Home </a> </a></li>
          <li><a href="/"><a href="/"> Sobre </a></a></li>
          <li><a href="/"> <a href="/"> Agora </a> </a></li>
          <li><a href="/"> <a href="/"> Leituras de 2024 </a> </a></li>
        </ul>
      </nav>
    </div>

  </header>
</template>

<style scoped>

a {
  text-decoration: none;
  color: #ffffff;
  text-align: center;
}

a:hover {
  opacity: .8;
}

ul {
  list-style: none;
}

header {
  height: auto;
  position: relative;
  background-color: transparent;
  font-size: 1.6rem;
  padding-left: clamp(24px, 1.032rem + 1.9355vw, 48px) ;
  padding-right: clamp(24px, 1.032rem + 1.9355vw, 48px) ;
}

.header-inner {
  padding: 0;
  display: grid;
  grid-auto-flow: row dense;
  height: 100%;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: 32px;
  margin: 0 auto;
  max-width: 1440px;
}


.head-brand {
  display: flex;
  grid-column-start: 2;
  grid-row-start: 1;
  min-height: 80px;

  line-height: 1;
}

.head-brand-wrapper {
  align-items: center;
  display: flex;
}

.head-logo {
  font-weight: 800;
  font-size: 1.6rem;
  letter-spacing: -.02em;
  position: relative;
  white-space: nowrap;
}

.head-menu::after, .head-menu::before {
  background-color: hsla(0,0%, 100%,0.2);
}

.head-menu {
  display: flex;
  font-weight: 700;
  align-items: center;
  gap: 32px;
}

.head-menu .nav {
  display: inline-flex;
  list-style: none;
  margin: 0;
  padding: 0;
  white-space: nowrap;

  align-items: center;
  gap: 32px;
  font-size: 1.3rem;
}


@media (min-width: 992px) {
  .head-brand {
    align-items: center;
    display: flex;
    height: 80px;
  }

  .head-menu {
    grid-column: 1/4;
    grid-row-start: 2;
    height: 56px;
    justify-content: center;
    margin: 0 48px;
  }

  .head-menu::after, .head-menu::before {
    content: "";
    height: 1px;
    left: 0;
    position: absolute;
    top: 80px;
    width: 100%;
  }

  .head-menu::after {
    top: 136px;
  }
}

@media (max-width: 767px) {
  header {
    height: 64px;
  }

  .header-inner {
    gap: 48px;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }

  .head-brand {
    align-items: center;
    display: grid;
    grid-column-start: 1;
    grid-template-columns: 1fr auto auto;
    height: 64px;
    min-height: unset;
  }

  .head-menu {
    transform: translateY(0);
    transition: none;
    justify-content: center;
    opacity: 0;
    position: fixed;
    visibility: hidden;
  }

  .nav {
    align-items: center;
    gap: 20px;
    line-height: 1.4;
  }

  .nav li {
    opacity: 0;
    transform: translateY(-4px);
  }

  .nav a {
    font-size: 2.6rem;
    font-weight: 600;
    text-transform: none
  }
}


</style>