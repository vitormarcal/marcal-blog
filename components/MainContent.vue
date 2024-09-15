<script setup lang="ts">
defineProps(['path'])
const {page} = useContent()

</script>

<template>
  <main>
    <div>


      <ContentDoc class="post-section" :path="path" v-slot="{ doc }">

        <post-head
            :title="page.title"
            :description="page.description"
            :created_at="page.created_at"
            :updated_at="page.updated_at"
            :tags="page.tags"
            :localized_post_paths="page.localized_post_paths"
            :has_localized_posts="page.has_localized_posts"
        />

        <ContentRenderer :value="doc" class="post-section content-section"/>
      </ContentDoc>
      <div class="post-section">
        <slot/>
      </div>

    </div>
  </main>
</template>

<style>

</style>