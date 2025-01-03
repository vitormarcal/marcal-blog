<script setup lang="ts">
defineProps(['tags', 'groupedTags'])
</script>

<template>
  <ul class="post-tags">
    <li v-for="tag in tags">
      <NuxtLink :to="'/tags/' + tag">
        #{{ tag }}
      </NuxtLink>
    </li>


    <li v-for="(count, tag) in groupedTags">
      <NuxtLink :to="'/tags/' + tag">
        #{{ tag }} ({{ count }})
      </NuxtLink>
    </li>
  </ul>

</template>

<style scoped>

.post-tags {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin-top: 0;
  padding: 0;

  li {
    margin: 1rem 1rem 1rem 0;
    border: 2px solid hsla(0, 0%, 100%, .2);
    border-radius: 24px;
    color: #fff;
    font-size: 1.0rem;
    font-weight: 700;
    letter-spacing: -.01em;
    padding: 2px 12px;
    text-decoration: none !important;
    width: fit-content;
  }

  li:hover {
    opacity: .8;
    color: #8DB500;
  }

  a {
    text-decoration: none;
  }

}



</style>