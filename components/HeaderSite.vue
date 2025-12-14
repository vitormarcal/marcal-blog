<script setup lang="ts">

const localePath = useLocalePath()
const emits = defineEmits(['is-head-open'])

const navigationLinks = [
  { label: 'header.home', path: localePath('index'), delay: 0.03 },
  { label: 'header.about', path: '/sobre', delay: 0.06 },
  { label: 'header.posts', path: localePath('posts'), delay: 0.15 },
  { label: 'header.tags', path: '/tags/mdc', delay: 0.2 },
  { label: 'header.readings', path: '/leituras-de-2025', delay: 0.25 },
  { label: 'header.slashes', path: '/slashes', delay: 0.35 },
];

function toggleHead() {
  emits('is-head-open')
}
</script>

<template>
  <header id="head">
    <div class="header-inner">
      <div class="head-brand">
        <div class="head-brand-wrapper">
          <NuxtLink :to="localePath('index')" class="head-logo"> Marçal </NuxtLink>
        </div>
        <localization-menu />
        <button class="head-burger" @click="toggleHead" aria-label="Toggle menu">

        </button>
      </div>
      <nav class="head-menu" aria-label="Main menu">
        <ul class="nav" @click="toggleHead">

          <li v-for="(link, index) in navigationLinks" :key="index" :style="{ transitionDelay: `${link.delay}s` }">
            <NuxtLink :to="link.path"> {{ $t(link.label) }} </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

  </header>
</template>

<style scoped>
header {
  height: auto;
  position: relative;
  background-color: transparent;
  font-size: 1.6rem;
  padding-left: clamp(24px, 1.032rem + 1.9355vw, 48px);
  padding-right: clamp(24px, 1.032rem + 1.9355vw, 48px);

  a {
    text-decoration: none;
    text-align: center;
  }

  ul {
    list-style: none;
  }

}

.header-inner {
  padding: 0;
  display: grid;
  grid-auto-flow: row dense;
  height: 100%;
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

.head-burger {
  appearance: none;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  display: none;
  height: 30px;
  margin-right: -3px;
  padding: 0;
  position: relative;
  width: 30px;
}

.head-burger::after,
.head-burger::before {
  background-color: #fff;
  content: "";
  height: 1px;
  left: 3px;
  position: absolute;
  transition: all .2s cubic-bezier(.04, .04, .12, .96) .1008s;
  width: 24px;
}

.head-burger::after {
  bottom: 11px;
}

.head-burger::before {
  top: 11px;
}

.is-head-open .head-burger::after {
  bottom: 14px;
  transform: rotate(-45deg);
}

.is-head-open .head-burger::before {
  top: 15px;
  transform: rotate(45deg);
}

.head-menu::after, .head-menu::before {
  background-color: hsla(0, 0%, 100%, 0.2);
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

@media (max-width: 991px) {
  .is-head-open #head {
    background-color:var(--bg-color);
  }
}

@media (min-width: 992px) {
  .header-inner {
    grid-template-columns: 1fr 1fr;
  }

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

  .is-head-open #head {
    height: 100%;
    inset: 0;
    overflow-y: scroll;
    position: fixed;
    z-index: 3999999;
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

  .head-burger {
    display: block;
  }

  .head-menu {
    transform: translateY(0);
    transition: none;
    justify-content: center;
    flex-direction: column;
    opacity: 0;
    position: fixed;
    visibility: hidden;
  }

  .is-head-open header .head-menu {
    opacity: 1;
    position: static;
    visibility: visible;
  }

  .nav {
    align-items: center;
    gap: 20px;
    line-height: 1.4;
  }

  .is-head-open .nav {
    display: flex;
    flex-direction: column;
  }


  .nav li {
    opacity: 0;
    transform: translateY(-4px);
  }

  .is-head-open .nav li {
    opacity: 1;
    transform: translateY(0);
    transition: transform .2s, opacity .2s;
    transition-delay: 0s, 0s;
  }

  .nav a {
    font-weight: 600;
    text-transform: none
  }
}


</style>