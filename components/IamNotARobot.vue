<script setup lang="ts">

import iAmNotARobot from "assets/img/IAmNotARobot.svg";
import madeByHuman from "assets/img/MadeByAHuman.svg";
import writtenByHuman from "assets/img/WrittenByAHuman.svg";
import humanContent from "assets/img/HumanContent.svg";

const textHtml = "<b>Este texto é orgânico</b>,<br/>\n" +
  "      criado de forma natural por um humano.<br/>\n" +
  "      Pode ter passado por correções gramaticais,<br/>\n" +
  "      com ou sem o auxílio de IA, <br/>\n" +
  "      mas <b>a essência original permanece intacta</b>."
</script>

<template>
  <div class="text-center">
    <div class="image-wrapper">
      <img :src="iAmNotARobot" alt="Eu não sou um robô 😁"/>
      <img :src="madeByHuman" alt="Feito por um humano 😉"/>
    </div>

    <p class="description" v-html="textHtml"></p>

    <div class="image-wrapper">
      <img :src="writtenByHuman" alt="Escrito por um humano 🙂"/>
      <img :src="humanContent" alt="Conteúdo humano 😄"/>
    </div>
  </div>

</template>

<style scoped>

.text-center {
  text-align: center;
}

.description {
  font-size: 16px;
  margin-bottom: 1rem;
}

.image-wrapper {
  display: flex;
  justify-content: center;
  padding-left: 2rem;
}

.image-wrapper img {
  margin-right: 1rem;
  margin-bottom: 1rem;
  width: 100px;
  max-width: 100%;
  height: auto;
}

</style>
