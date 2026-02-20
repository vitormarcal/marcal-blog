<script setup lang="ts">
import { stories } from '~/data/stories'

const homeTitle = 'Olá, eu sou o Vítor Marçal. 😉'
const homeDescription = 'Essa é a minha página pessoal, onde eu escrevo principalmente para mim mesmo 🧠!'
const latestPostsTitle = 'Últimas publicações'
const previousPublicationsTitle = 'Publicações anteriores'

const { page } = useContent()
useContentHead(page)

const { data: posts } = await useAsyncData(`home`, () => queryContent()
  .where({is_post: true, _partial: false})
  .sort({ created_at: -1})
  .limit(3)
  .without(['body'])
  .find()
)
</script>

<template>
  <div class="index">
    <page-renderer :title="homeTitle" :description="homeDescription">
      <StoryRail :items="stories" />
      <h3>{{ latestPostsTitle }}</h3>
      <ul class="latest-posts">
        <li v-for="post in posts" :key="post['_id']">
          <post-item :post="post"/>
        </li>
      </ul>
      <NuxtLink to="/publicacoes"> {{ previousPublicationsTitle }} →</NuxtLink>
      <hr style="margin-top: 5rem"  aria-hidden="true"/>
      <iam-not-a-robot/>
    </page-renderer>
  </div>
</template>

<style scoped>

.index {
  .latest-posts {
    padding: 0;
    margin: 0;
    li {
      list-style-type: none;
    }
  }
}

</style>
