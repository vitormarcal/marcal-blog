<script setup lang="ts">

definePageMeta({
  layout: 'slide-layout',
  alias: ['/likes']
})

const frames = ref([
  {
    img: '/img/gostos-e-desgostos/img-ipe-jaune.jpg',
    strong: "Olá! Eu sou o Vítor",
    text: "e aqui estão as coisas de que eu gosto (e as que eu não gosto).",
  },
  {img: '/img/gostos-e-desgostos/img-vin.jpg', strong: "Gosto", text: "de vinho 🍷."},
  {img: '/img/gostos-e-desgostos/img-biere.jpg', strong: "Não gosto", text: "de cerveja. 🍺"},
  {
    img: '/img/gostos-e-desgostos/img-lecture.jpg',
    strong: "Gosto",
    text: "de leitura, livros e quadrinhos 📚.",
  },
  {
    img: '/img/gostos-e-desgostos/img-chocolat.jpg',
    strong: "Gosto",
    text: "de bolos de chocolate e doces 🍫🎂🤤.",
  },
  {
    img: '/img/gostos-e-desgostos/img-cigarettes.jpg',
    strong: "Não gosto",
    text: "de cigarros nem do cheiro deles. 🚬 🤢",
  },
  {
    img: '/img/gostos-e-desgostos/img-echecs.jpg',
    strong: "Gosto",
    text: "de jogar xadrez. Gosto de praticar xadrez ♟️♔.",
  },
  {
    img: '/img/gostos-e-desgostos/img-ordinateurs.jpg',
    strong: "Gosto",
    text: "de brincar com computadores. 💻",
  },
  {
    img: '/img/gostos-e-desgostos/img-bruit.jpg',
    strong: "Não gosto",
    text: "de barulho, carros e pessoas barulhentas. 🔊 🙉️",
  },
  {
    img: '/img/gostos-e-desgostos/img-region-boisee.jpg',
    strong: "Gosto",
    text: "de visitar regiões do interior. Gosto de visitar áreas arborizadas. 🌳",
  },
  {
    img: '/img/gostos-e-desgostos/img-ma-petite-fille.jpg',
    strong: "Gosto",
    text: "da minha menina.👧",
  },
  {img: '/img/gostos-e-desgostos/img-ipe-jaune.jpg', strong: "É isso,", text: "até breve!"},
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
