<script setup lang="ts">
import type { StoryItem } from '~/types/story'
import { isStoryCatalog } from '~/types/story'

definePageMeta({
  documentDriven: false
})

const title = 'Admin de Stories (JSON)'
const description = 'Edite, valide e exporte o JSON de stories.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const { stories } = useStoriesCatalog()
const jsonText = ref(JSON.stringify(stories, null, 2))
const copied = ref(false)

const parsedStories = computed<StoryItem[] | null>(() => {
  try {
    const parsed = JSON.parse(jsonText.value)
    if (!isStoryCatalog(parsed)) return null
    return parsed
  } catch {
    return null
  }
})

const validationMessage = computed(() => {
  if (parsedStories.value) return `JSON válido (${parsedStories.value.length} stories).`
  return 'JSON inválido para o schema de stories.'
})

const resetToCurrent = () => {
  jsonText.value = JSON.stringify(stories, null, 2)
}

const copyJson = async () => {
  if (!import.meta.client) return
  await navigator.clipboard.writeText(jsonText.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1400)
}

const downloadJson = () => {
  if (!import.meta.client) return
  const blob = new Blob([jsonText.value], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'stories.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
</script>

<template>
  <section class="main-section">
    <main>
      <article class="post-section stories-admin">
        <div class="stories-admin__header">
          <h1>{{ title }}</h1>
          <p>
            Cadastre novos stories apenas editando JSON. Depois salve como
            <code>data/stories.json</code>.
          </p>
        </div>

        <div class="stories-admin__actions">
          <button type="button" @click="resetToCurrent">Resetar para o catálogo atual</button>
          <button type="button" @click="copyJson">{{ copied ? 'Copiado' : 'Copiar JSON' }}</button>
          <button type="button" @click="downloadJson">Baixar stories.json</button>
        </div>

        <p :class="parsedStories ? 'stories-admin__ok' : 'stories-admin__error'">
          {{ validationMessage }}
        </p>

        <label class="stories-admin__label" for="stories-json">Stories JSON</label>
        <textarea id="stories-json" v-model="jsonText" class="stories-admin__editor" spellcheck="false" />

        <section v-if="parsedStories" class="stories-admin__preview">
          <h2>Preview do rail</h2>
          <StoryRail :items="parsedStories" />
        </section>
      </article>
    </main>
  </section>
</template>

<style scoped>
.stories-admin > * {
  grid-column: 3 / span 8;
}

@media (max-width: 767px) {
  .stories-admin > * {
    grid-column: 1 / span 12;
  }
}

.stories-admin__header {
  display: grid;
  gap: 0.7rem;
}

.stories-admin__header h1 {
  margin: 0 !important;
}

.stories-admin__header p {
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
}

.stories-admin__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.stories-admin__actions button {
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  padding: 0.45rem 0.8rem;
  color: #fff;
  cursor: pointer;
}

.stories-admin__ok {
  color: #8db500;
}

.stories-admin__error {
  color: #fca5a5;
}

.stories-admin__label {
  display: inline-block;
  margin-bottom: 0.4rem;
  font-weight: 600;
}

.stories-admin__editor {
  width: 100%;
  min-height: 420px;
  background: #0b0b0b;
  color: #f8f8f8;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  padding: 0.9rem;
  font-family: JetBrains Mono, Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace;
  font-size: 0.88rem;
  line-height: 1.5;
}

.stories-admin__preview h2 {
  margin: 0 !important;
}
</style>

