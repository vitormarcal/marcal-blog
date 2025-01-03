<script setup lang="ts">

import iAmNotARobot from "assets/img/IAmNotARobot.svg";
import madeByHuman from "assets/img/MadeByAHuman.svg";
import writtenByHuman from "assets/img/WrittenByAHuman.svg";
import humanContent from "assets/img/HumanContent.svg";
</script>

<template>
  <div class="text-center">
    <div class="image-wrapper">
      <img :src="iAmNotARobot" :alt="$t('i_am_not_a_robot.i_am_not_a_robot_alt')"/>
      <img :src="madeByHuman" :alt="$t('i_am_not_a_robot.made_by_human_alt')"/>
    </div>

    <p class="description" v-html="$t('i_am_not_a_robot.text')"></p>

    <div class="image-wrapper">
      <img :src="writtenByHuman" :alt="$t('i_am_not_a_robot.written_by_human_alt')"/>
      <img :src="humanContent" :alt="$t('i_am_not_a_robot.human_content_alt')"/>
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