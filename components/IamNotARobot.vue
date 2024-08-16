<script setup lang="ts">

import iAmNotARobot from "assets/img/IAmNotARobot.svg";
import madeByHuman from "assets/img/MadeByAHuman.svg";
import writtenByHuman from "assets/img/WrittenByAHuman.svg";
import humanContent from "assets/img/HumanContent.svg";
</script>

<template>
  <div style="text-align: center">
    <div class="image-wrapper">
      <img :src="iAmNotARobot" alt="I am not a Robot"/>
      <img :src="madeByHuman" alt="Made by human"/>
    </div>
    <p style="font-size: 16px">
      <b>Este texto é orgânico</b>,<br/>
      criado de forma natural por um humano.<br/>
      Pode ter passado por correções gramaticais,<br/>
      com ou sem o auxílio de IA, <br/>
      mas <b>a essência original permanece intacta</b>.
    </p>
<p style="margin-bottom: 2rem">
</p>

    <div class="image-wrapper">
      <img :src="writtenByHuman" alt="Written by Human"/>
      <img :src="humanContent" alt="Human content"/>
    </div>
  </div>

</template>

<style scoped>

.image-wrapper {
  display: grid;
  grid-auto-flow: row dense;
  padding-left: 2rem;
  grid-template-columns: 2fr  2fr;
}

.image-wrapper img {
  margin-right: 1rem;
  margin-bottom: 1rem;
  width: 100px;
}

</style>