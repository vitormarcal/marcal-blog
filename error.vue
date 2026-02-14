<script setup lang="ts">
import type { NuxtError } from '#app'
import { computed } from 'vue'

const props = defineProps({
  error: Object as () => NuxtError
})

const isNotFound = computed(() => props.error?.statusCode === 404)

const pageTitle = computed(() =>
    isNotFound.value ? 'Essa página saiu para passear' : 'Algo deu errado'
)

const pageDescription = computed(() =>
    isNotFound.value
        ? 'O link pode ter mudado ou a página decidiu se esconder entre as estantes.'
        : 'Não consegui carregar esta página agora.'
)

const notFoundLines = [
  '404: aqui só tem vento e silêncio.',
  'Prometo que não foi de propósito.',
  'Se eu tivesse um mapa, eu também usaria.',
  'Talvez a página esteja lendo algo melhor que nós.',
  'Essa URL parecia uma boa ideia na época.'
]

const randomLine = computed(() => {
  const seed = `${(props.error as any)?.url || ''}|${Date.now()}`
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return notFoundLines[h % notFoundLines.length]
})

const quickLinks = [
  { href: '/', label: 'Voltar ao início', emoji: '🏠' },
  { href: '/publicacoes', label: 'Publicações', emoji: '📚' },
  { href: '/tags/mdc', label: 'Categorias', emoji: '🧭' },
  { href: '/aleatorio', label: 'Me surpreenda', emoji: '🎲' }
]
</script>

<template>
  <NuxtLayout name="default">
    <section class="main-section">
      <main class="error-page post-section">
        <header class="error-hero">
          <p class="error-code" aria-hidden="true">
            {{ isNotFound ? '404' : (error?.statusCode || 500) }}
          </p>

          <h1>{{ pageTitle }}</h1>
          <p class="error-desc">{{ pageDescription }}</p>

          <p v-if="isNotFound" class="error-joke">
            {{ randomLine }}
          </p>
        </header>

        <nav v-if="isNotFound" class="quick-actions" aria-label="Atalhos">
          <a
              v-for="l in quickLinks"
              :key="l.href"
              class="quick-actions__link"
              :href="l.href"
          >
            <span class="quick-actions__emoji" aria-hidden="true">
              {{ l.emoji }}
            </span>
            <span>{{ l.label }}</span>
          </a>
        </nav>
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

.error-hero {
  margin-top: 0.5rem;
}

.error-code {
  font-size: 3.5rem;
  line-height: 1;
  opacity: 0.35;
  margin: 0 0 0.5rem;
  letter-spacing: 0.06em;
}

.error-desc {
  opacity: 0.9;
  margin-top: 0.75rem;
}

.error-joke {
  margin-top: 0.75rem;
  opacity: 0.75;
  font-size: 0.95rem;
}

.quick-actions {
  margin: 2rem auto 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  max-width: 520px;
}

.quick-actions__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.quick-actions__link:hover {
  border-color: rgba(255, 255, 255, 0.28);
  transform: translateY(-1px);
}

.quick-actions__emoji {
  font-size: 1.1rem;
}

@media (max-width: 767px) {
  .error-page > * {
    grid-column: 1 / span 12;
  }

  .error-code {
    font-size: 3rem;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
