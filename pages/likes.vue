<script setup lang="ts">

import {useI18n} from 'vue-i18n'

const {t} = useI18n()

definePageMeta({
  layout: 'slide'
})

const frames = ref([
  {
    img: '/img/gostos-e-desgostos/img-ipe-jaune.jpg',
    strong: "Salut! Je suis Vitor",
    text: "et voici les choses que j'aime (et que je n'aime pas).",
  },
  {img: '/img/gostos-e-desgostos/img-vin.jpg', strong: "J'aime", text: "le vin 🍷."},
  {img: '/img/gostos-e-desgostos/img-biere.jpg', strong: "Je n'aime pas", text: "la bière. 🍺"},
  {
    img: '/img/gostos-e-desgostos/img-lecture.jpg',
    strong: "J'aime",
    text: "la lecture, les livres et les bandes dessinées 📚.",
  },
  {
    img: '/img/gostos-e-desgostos/img-chocolat.jpg',
    strong: "J'aime",
    text: "les gâteaux au chocolat et les bonbons 🍫🎂🤤.",
  },
  {
    img: '/img/gostos-e-desgostos/img-cigarettes.jpg',
    strong: "Je n'aime pas",
    text: "les cigarettes ni leur odeur. 🚬 🤢",
  },
  {
    img: '/img/gostos-e-desgostos/img-echecs.jpg',
    strong: "J'aime",
    text: "le jeu d'échecs. J'aime pratiquer les échecs ♟️♔.",
  },
  {
    img: '/img/gostos-e-desgostos/img-ordinateurs.jpg',
    strong: "J'aime",
    text: "jouer avec des ordinateurs. 💻",
  },
  {
    img: '/img/gostos-e-desgostos/img-bruit.jpg',
    strong: "Je n'aime pas",
    text: "le bruit, les voitures et les gens bruyants. 🔊 🙉️",
  },
  {
    img: '/img/gostos-e-desgostos/img-region-boisee.jpg',
    strong: "J'aime",
    text: "visiter les régions de l'intérieur. J'aime visiter les régions boisées. 🌳",
  },
  {
    img: '/img/gostos-e-desgostos/img-ma-petite-fille.jpg',
    strong: "J'aime",
    text: "ma petite fille.👧",
  },
  {img: '/img/gostos-e-desgostos/img-ipe-jaune.jpg', strong: "C'est tout,", text: "à bientôt !"},
])

function turnPageForward() {
  const container = document.querySelector(".container")
  container.scrollLeft = container.scrollLeft + 200;
}

function turnPageBack() {
  const container = document.querySelector(".container")
  container.scrollLeft = container.scrollLeft - 200;
}

function handleKeydown(e) {
  if (e.keyCode === 37) {
    e.preventDefault();
    turnPageBack();
  }
  if (e.keyCode === 39 || e.keyCode === 32) {
    e.preventDefault();
    turnPageForward();
  }
}

function handleClick(e) {
  if (e.clientX > window.innerWidth / 2) {
    turnPageForward();
  } else {
    turnPageBack();
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", handleClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("click", handleClick);
});


</script>

<template>
  <div class="container">
    <div class="frame" v-for="frame in frames">
      <img :src="frame.img" alt=""/>
      <div class="frame-text center">
        <p>
          <strong>{{ frame.strong }}</strong>
          {{ frame.text }}
        </p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: calc(var(--frame-width) + 8px);
  min-height: 100vh;
  overflow: scroll;
  scroll-snap-type: x mandatory;
  gap: 5px;
  margin: 0 0 0 -3px;
  border: var(--frame-border);
  background: black;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media screen and (min-width: 360px) {
  .container {
    max-width: var(--frame-max-width);
    margin: 0 auto;
  }
}

.container:after {
  content: "";
  z-index: -1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.2;
  background: url('/img/gostos-e-desgostos/noise.png');
}

.container::-webkit-scrollbar {
  display: none;
}

.frame {
  scroll-snap-align: start;
  display: grid;
  place-items: start;
  position: relative;
  min-width: var(--frame-width);
  min-height: 100vh;
}

.frame img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  object-fit: cover;
  z-index: 0;
  height: 100%;
  width: 100%;
}

.frame-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100px;
  min-width: 100%;
  z-index: 1;
  padding: 20px;
  position: relative;
  background: var(--frame-bg);
  backdrop-filter: var(--frame-blur);
}



.frame-text-welcome svg {
  max-width: 100px;
  margin: 0 auto 20px auto;
}

.frame-text p {
  margin-top: 0;
}

.frame-text p:only-child {
  margin: 0;
}


.center {
  text-align: unset;
}

strong {
  font-size: 30px;
}

</style>