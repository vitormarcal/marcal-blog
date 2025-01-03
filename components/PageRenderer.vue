<script setup lang="ts">


interface PostProps {
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  localized_post_paths?: string[];
  has_localized_posts?: boolean;
}

defineProps<PostProps>();
</script>

<template>
  <section class="main-section">
    <main>
      <post-head
          :title="title"
          :description="description"
          :created_at="created_at"
          :updated_at="updated_at"
          :tags="tags"
          :localized_post_paths="localized_post_paths"
          :has_localized_posts="has_localized_posts"
      />
      <div class="post-section content-section">
        <hr/>
      </div>

      <div class="post-section">
        <slot/>
      </div>
    </main>
  </section>
</template>

<style scoped>

</style>