<script setup lang="ts">
import LocalizedPostPaths from "~/components/LocalizedPostPaths.vue";

interface PostHead {
  title: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  localized_post_paths?: string[];
  has_localized_posts?: boolean;
}
defineProps<PostHead>();
</script>

<template>
  <article class="post-section">
    <h1>
      {{ title }}
    </h1>
    <p>
      {{ description }}

    </p>
    <post-times :created-at="created_at" :updated-at="updated_at"/>
    <post-tags v-if="tags" :tags="tags"/>
    <template v-if="has_localized_posts">
      <br/>
      <localized-post-paths   :paths="localized_post_paths"/>
    </template>
  </article>
</template>

<style scoped>

</style>