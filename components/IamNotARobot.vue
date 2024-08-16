<script setup lang="ts">

import iAmNotARobot from "assets/img/IAmNotARobot.svg";
import madeByHuman from "assets/img/MadeByAHuman.svg";
import writtenByHuman from "assets/img/WrittenByAHuman.svg";
import humanContent from "assets/img/HumanContent.svg";
</script>

<template>
  <div class="image-wrapper">
    <img  :src="iAmNotARobot" alt="I am not a Robot" />
    <img  :src="madeByHuman" alt="Made by human" />
    <img  :src="writtenByHuman" alt="Written by Human" />
    <img  :src="humanContent" alt="Human content" />
  </div>
</template>

<style scoped>

.image-wrapper {
  display: grid;
  grid-auto-flow: row dense;
  padding-left: 2rem;
  grid-template-columns: 2fr  2fr ;
}

.image-wrapper img {
  margin-right: 1rem;
  margin-bottom:  1rem;
  width: 100px;
}

</style>