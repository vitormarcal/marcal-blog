<script setup lang="ts">

import EmailMeAComment from "~/components/EmailMeAComment.vue";
import FollowViaFeed from "~/components/FollowViaFeed.vue";
import IamNotARobot from "~/components/IamNotARobot.vue";
import { formatDate } from "~/utils/date-utils";

interface AdjacentPost {
  _path: string;
  title: string;
  created_at?: string;
}

const { page } = useContent()
const route = useRoute()

if (!unref(page)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Página não encontrada',
    data: {
      path: route.path
    }
  })
}

const { data: orderedPosts } = await useAsyncData(`post-navigation-${route.path}`, () =>
  queryContent()
    .where({ is_post: true, _partial: false })
    .sort({ created_at: -1 })
    .without(['body'])
    .find()
)

const adjacentPosts = computed(() => {
  if (!page.value?.is_post || !orderedPosts.value?.length) {
    return { previous: null, next: null }
  }

  const currentPostIndex = orderedPosts.value.findIndex((post) => post._path === page.value._path)
  if (currentPostIndex === -1) {
    return { previous: null, next: null }
  }

  return {
    previous: (orderedPosts.value[currentPostIndex + 1] as AdjacentPost | undefined) ?? null,
    next: (orderedPosts.value[currentPostIndex - 1] as AdjacentPost | undefined) ?? null
  }
})

const hasAdjacentPosts = computed(() => {
  return Boolean(adjacentPosts.value.previous || adjacentPosts.value.next)
})

const showCommentArea = computed(() => {
  return true
})


</script>

<template>
  <div>
    <main-content v-if="page">
      <nav
        v-if="page.is_post && hasAdjacentPosts"
        class="post-navigation"
        aria-label="Navegação entre publicações"
      >
        <NuxtLink
          v-if="adjacentPosts.previous"
          :to="adjacentPosts.previous._path"
          class="post-navigation-link"
        >
          <span>← Publicação anterior</span>
          <strong>{{ adjacentPosts.previous.title }}</strong>
          <time v-if="adjacentPosts.previous.created_at">{{ formatDate(adjacentPosts.previous.created_at) }}</time>
        </NuxtLink>
        <NuxtLink
          v-if="adjacentPosts.next"
          :to="adjacentPosts.next._path"
          class="post-navigation-link is-next"
        >
          <span>Próxima publicação →</span>
          <strong>{{ adjacentPosts.next.title }}</strong>
          <time v-if="adjacentPosts.next.created_at">{{ formatDate(adjacentPosts.next.created_at) }}</time>
        </NuxtLink>
      </nav>

      <template v-if="showCommentArea">
        <hr style="margin-top: 5rem"/>
        <email-me-a-comment :page-title="page.title"  />
        <hr style="margin-top: 5rem"/>
        <follow-via-feed/>
        <hr style="margin-top: 5rem"/>
        <iam-not-a-robot/>
      </template>
    </main-content>
  </div>
</template>

<style scoped>
.post-navigation {
  margin-top: 4rem;
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .post-navigation {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.post-navigation-link {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border: 1px solid hsla(0, 0%, 100%, 0.2);
  padding: 1rem;
  text-decoration: none;
}

.post-navigation-link.is-next {
  text-align: right;
}

.post-navigation-link span {
  font-size: 0.95rem;
  color: hsla(0, 0%, 100%, 0.74);
}

.post-navigation-link strong {
  line-height: 1.4;
}

.post-navigation-link time {
  font-size: 0.9rem;
  color: hsla(0, 0%, 100%, 0.64);
}

</style>
