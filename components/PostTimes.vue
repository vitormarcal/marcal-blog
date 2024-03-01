<script setup lang="ts">
import {formatDate} from "~/utils/date-utils";

const props = defineProps(['createdAt', 'updatedAt'])

const createdAt = computed(() => {
  return formatDate(props.createdAt)
})

const updatedAt = computed(() => {
  return formatDate(props.updatedAt)
})

const hasDates = computed(() => {
  return !!props.createdAt || !!props.updatedAt
})

</script>

<template>
  <p class="post-times" v-if="hasDates">
              <span>
              > <time class="created-at">{{ createdAt }}</time>
            </span>

    <span v-if="updatedAt && createdAt != updatedAt">
              <i>(Editado em <time class="updated-at">{{ updatedAt }}</time>)</i>
            </span>
  </p>
</template>

<style scoped>

.post-times {
  font-size: 15px;
  font-weight: bold;
  margin-top: 1rem;
}

.updated-at,
.created-at {
  margin-top: 2rem;
  color: hsla(0, 0%, 100%, .64);

  line-height: 1.45;
  max-width: 840px;
}

span {
  margin-right: 5px;
}

</style>