<script setup lang="ts">
definePageMeta({
  documentDriven: false,
  alias: ['/aleatorio']
})

const { data: posts } = await useAsyncData('random-post-paths', () =>
  queryContent()
    .where({ is_post: true, _partial: false })
    .only(['_path'])
    .find()
)

const randomPath = computed(() => {
  const availablePaths = posts.value
    ?.map((post) => post?._path)
    .filter((path): path is string => typeof path === 'string' && path.length > 0) ?? []

  if (availablePaths.length === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * availablePaths.length)
  return availablePaths[randomIndex]
})

if (randomPath.value) {
  await navigateTo(randomPath.value, {
    replace: true,
    redirectCode: 307
  })
}
</script>

<template>
  <section class="main-section">
    <main class="random-page">
      <h1>Nada para sortear agora</h1>
      <p>Não encontrei publicações para redirecionar neste momento.</p>
      <NuxtLink to="/publicacoes">Ver todas as publicações</NuxtLink>
    </main>
  </section>
</template>
