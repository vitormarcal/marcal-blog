<script setup lang="ts">
import {useI18n} from "vue-i18n";

const { locale } = useI18n()

const { data: posts } = await useAsyncData(`home`, () => queryContent()
    .where({is_post: true, _partial: false, language: { $eq: locale.value }})
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
    <main-content path="/">
      <h3>{{ $t('latest_posts') }}</h3>
      <template v-for="post in posts" :key="post['_id']">
        <post-item :post="post"/>
      </template>
      <NuxtLink to="/posts"> {{ $t('previous_publications') }} →</NuxtLink>
      <hr style="margin-top: 5rem"/>
      <iam-not-a-robot/>
      <hr/>
    </main-content>

  </div>
</template>

<style scoped>

</style>