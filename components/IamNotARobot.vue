<script setup lang="ts">

import iAmNotARobot from "assets/img/IAmNotARobot.svg";
import madeByHuman from "assets/img/MadeByAHuman.svg";
import writtenByHuman from "assets/img/WrittenByAHuman.svg";
import humanContent from "assets/img/HumanContent.svg";
</script>

<template>
  <div style="text-align: center">
    <div class="image-wrapper">
      <img :src="iAmNotARobot" :alt="$t('i_am_not_a_robot.i_am_not_a_robot_alt')"/>
      <img :src="madeByHuman" :alt="$t('i_am_not_a_robot.made_by_human_alt')"/>
    </div>
    <p style="font-size: 16px" v-html="$t('i_am_not_a_robot.text')" />
<p style="margin-bottom: 2rem">
</p>

    <div class="image-wrapper">
      <img :src="writtenByHuman" :alt="$t('i_am_not_a_robot.written_by_human_alt')"/>
      <img :src="humanContent" :alt="$t('i_am_not_a_robot.human_content_alt')"/>
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