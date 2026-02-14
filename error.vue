<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const isNotFound = computed(() => props.error?.statusCode === 404)
const emailAddress = 'eu@marcal.dev'

const contactLink = computed(() => {
  const subject = isNotFound.value
    ? 'Página não encontrada no blog'
    : 'Erro ao acessar o blog'

  return `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}`
})

const pageTitle = computed(() => {
  return isNotFound.value ? 'Essa página saiu para passear' : 'Algo deu errado'
})

const pageDescription = computed(() => {
  return isNotFound.value
    ? 'Talvez o link tenha mudado ou o conteúdo não esteja mais disponível.'
    : 'Não consegui carregar esta página agora.'
})
</script>

<template>
  <NuxtLayout name="default">
    <section class="main-section">
      <main class="error-page post-section">
        <h1>{{ pageTitle }}</h1>
        <p>{{ pageDescription }}</p>
        <p v-if="isNotFound">
          Se você estava procurando algo específico, me envie um e-mail e eu tento ajudar.
        </p>
        <p v-else>
          Código do erro: <strong>{{ error?.statusCode || 500 }}</strong>
        </p>
        <p class="error-page__actions">
          <NuxtLink to="/">Início</NuxtLink>
          ·
          <NuxtLink to="/publicacoes">Publicações</NuxtLink>
          ·
          <NuxtLink to="/random">Aleatório</NuxtLink>
        </p>
        <p>
          <a :href="contactLink">Falar por e-mail</a>
        </p>
        <p>
          <button type="button" @click="clearError({ redirect: '/' })">
            Voltar para o início
          </button>
        </p>
      </main>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error-page {
  text-align: center;
}

.error-page > * {
  grid-column: 3 / span 8;
}

@media (max-width: 767px) {
  .error-page > * {
    grid-column: 1 / span 12;
  }
}

.error-page__actions {
  margin-top: 1.5rem;
}

button {
  background: transparent;
  border: 1px solid var(--font-color);
  color: var(--font-color);
  cursor: pointer;
  font: inherit;
  padding: 0.45rem 0.9rem;
}
</style>
