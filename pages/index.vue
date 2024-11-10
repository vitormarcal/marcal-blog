<script setup lang="ts">
import {useI18n} from "vue-i18n";
const localePath = useLocalePath()

const { locale } = useI18n()

const { data: posts } = await useAsyncData(`home`, () => queryContent()
    .where({is_post: true, _partial: false})
    .sort({ created_at: -1})
    .limit(3)
    .without(['body'])
    .find(),
    {
      watch: [locale]
    }
)

</script>

<template>
  <div>
    <page-renderer :title="$t('home.title')" :description="$t('home.description')">
      <h3>{{ $t('latest_posts') }}</h3>
      <ul class="latest-posts">
        <li v-for="post in posts" :key="post['_id']">
          <post-item :post="post"/>
        </li>
      </ul>
      <NuxtLink :to="localePath('posts')"> {{ $t('previous_publications') }} →</NuxtLink>
      <hr style="margin-top: 5rem"  aria-hidden="true"/>
      <iam-not-a-robot/>
    </page-renderer>
  </div>
</template>

<style scoped>
.latest-posts {
  padding: 0;
  margin: 0;
  li {
    list-style-type: none;
  }
}
</style>