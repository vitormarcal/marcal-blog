<script setup lang="ts">
type AuthorDto = {
  id: number
  name: string
}

type BookCardDto = {
  bookId: number
  title: string
  coverUrl?: string | null
  authors: AuthorDto[]
}

type EditionDto = {
  editionId: number
  title: string
  coverUrl?: string | null
  isbn13?: string | null
  publisher?: string | null
  pages?: number | null
  format?: string | null
}

type ReadCardDto = {
  readId: number
  status: string
  startedAt?: string | null
  finishedAt?: string | null
  progressPct?: number | null
  progressPages?: number | null
  book: BookCardDto
  edition: EditionDto
}

type YearStatsDto = {
  finishedCount: number
  currentlyReadingCount: number
  wantCount: number
}

type YearReadsResponse = {
  year: number
  currentlyReading: ReadCardDto[]
  finished: ReadCardDto[]
  didNotFinish: ReadCardDto[]
  wantToRead: ReadCardDto[]
  stats: YearStatsDto
}

const props = defineProps<{
  year: number
}>()

const data = ref<YearReadsResponse | null>(null)
const loading = ref(true)
const errorMessage = ref<string | null>(null)

const formatDate = (value?: string | null) => {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().slice(0, 10)
}

const coverSrc = (coverUrl?: string | null) => {
  if (!coverUrl) return ""
  if (coverUrl.startsWith("http://") || coverUrl.startsWith("https://")) {
    return coverUrl
  }
  return `https://media-pulse.marcal.dev${coverUrl}`
}

const authorsLabel = (authors: AuthorDto[]) => {
  if (!authors || authors.length === 0) return ""
  return authors.map((author) => author.name).join(", ")
}

const dateForItem = (item: ReadCardDto, section: "finished" | "currentlyReading" | "didNotFinish") => {
  if (section === "finished") return formatDate(item.finishedAt)
  if (section === "currentlyReading") return formatDate(item.startedAt)
  return formatDate(item.finishedAt ?? item.startedAt)
}

const progressLabel = (item: ReadCardDto) => {
  const pct = typeof item.progressPct === "number" ? item.progressPct : null
  const pages = typeof item.progressPages === "number" ? item.progressPages : null
  if (pct === null && pages === null) return ""
  const parts = []
  if (pct !== null) {
    parts.push(`${pct.toFixed(1)}%`)
  }
  if (pages !== null) {
    parts.push(`${pages} pág.`)
  }
  return parts.join(" · ")
}

onMounted(async () => {
  loading.value = true
  errorMessage.value = null
  try {
    const baseUrl = "https://media-pulse.marcal.dev"
    if (!baseUrl) {
      throw new Error("mediaPulseBaseUrl não definido")
    }
    const normalizedBase = baseUrl.replace(/\/$/, "")
    const url = `${normalizedBase}/api/books/year/${props.year}`
    data.value = await $fetch<YearReadsResponse>(url)
  } catch (error) {
    console.error(error)
    errorMessage.value = "Não foi possível carregar os livros deste ano."
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section id="year-reads-top" class="year-reads" aria-labelledby="year-reads-title">
    <div v-if="loading" class="year-reads__skeleton" aria-busy="true">
      <div class="skeleton-line skeleton-line--title"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>

    <p v-else-if="errorMessage" class="year-reads__error">
      {{ errorMessage }}
    </p>

    <div v-else-if="data">
      <header class="year-reads__summary">
        <div class="summary-head">
          <p class="summary-kicker">Leituras do ano de {{year}}</p>
          <h2 id="year-reads-title">Sumário</h2>
          <p class="summary-subtitle">Um panorama rápido antes de mergulhar nas listas.</p>
        </div>
        <ul class="summary-list" aria-label="Resumo de leituras">
          <li class="summary-card">
            <span class="summary-label">Lidos</span>
            <strong class="summary-value">{{ data.stats.finishedCount }}</strong>
          </li>
          <li class="summary-card">
            <span class="summary-label">Lendo</span>
            <strong class="summary-value">{{ data.stats.currentlyReadingCount }}</strong>
          </li>
          <li class="summary-card">
            <span class="summary-label">Quero ler</span>
            <strong class="summary-value">{{ data.stats.wantCount }}</strong>
          </li>
        </ul>
        <nav class="summary-nav" aria-label="Navegação de seções">
          <a href="#section-lendo">Lendo</a>
          <a href="#section-lidos">Lidos</a>
          <a href="#section-abandonados">Abandonados</a>
          <a href="#section-quero-ler">Quero ler</a>
        </nav>
      </header>

      <div id="section-lendo" class="year-reads__section" data-accent="reading">
        <div class="section-head">
          <h3>Lendo</h3>
          <p>Livros em andamento e progresso atual.</p>
        </div>
        <ul v-if="data.currentlyReading.length" class="reads-list">
          <li v-for="item in data.currentlyReading" :key="item.readId" class="reads-item">
            <img
              v-if="item.edition.coverUrl"
              :src="coverSrc(item.edition.coverUrl)"
              :alt="`Capa de ${item.edition.title}`"
              loading="lazy"
              class="reads-item__cover"
            />
            <div class="reads-item__content">
              <strong class="reads-item__title">{{ item.edition.title }}</strong>
              <span v-if="authorsLabel(item.book.authors)" class="reads-item__authors">
                {{ authorsLabel(item.book.authors) }}
              </span>
              <span v-if="progressLabel(item)" class="reads-item__progress">
                {{ progressLabel(item) }}
              </span>
              <time v-if="dateForItem(item, 'currentlyReading')" class="reads-item__date">
                {{ dateForItem(item, "currentlyReading") }}
              </time>
            </div>
          </li>
        </ul>
        <p v-else class="reads-empty">Sem livros em leitura.</p>
        <a class="back-to-top" href="#year-reads-top">Voltar ao topo</a>
      </div>

      <div id="section-lidos" class="year-reads__section" data-accent="finished">
        <div class="section-head">
          <h3>Lidos</h3>
          <p>Finalizados ao longo do ano, com a data de conclusão.</p>
        </div>
        <ul v-if="data.finished.length" class="reads-list">
          <li v-for="item in data.finished" :key="item.readId" class="reads-item">
            <img
              v-if="item.edition.coverUrl"
              :src="coverSrc(item.edition.coverUrl)"
              :alt="`Capa de ${item.edition.title}`"
              loading="lazy"
              class="reads-item__cover"
            />
            <div class="reads-item__content">
              <strong class="reads-item__title">{{ item.edition.title }}</strong>
              <span v-if="authorsLabel(item.book.authors)" class="reads-item__authors">
                {{ authorsLabel(item.book.authors) }}
              </span>
              <time v-if="dateForItem(item, 'finished')" class="reads-item__date">
                {{ dateForItem(item, "finished") }}
              </time>
            </div>
          </li>
        </ul>
        <p v-else class="reads-empty">Sem livros finalizados.</p>
        <a class="back-to-top" href="#year-reads-top">Voltar ao topo</a>
      </div>

      <div id="section-abandonados" class="year-reads__section" data-accent="dnf">
        <div class="section-head">
          <h3>Abandonados</h3>
          <p>Leituras interrompidas durante o ano.</p>
        </div>
        <ul v-if="data.didNotFinish.length" class="reads-list">
          <li v-for="item in data.didNotFinish" :key="item.readId" class="reads-item">
            <img
              v-if="item.edition.coverUrl"
              :src="coverSrc(item.edition.coverUrl)"
              :alt="`Capa de ${item.edition.title}`"
              loading="lazy"
              class="reads-item__cover"
            />
            <div class="reads-item__content">
              <strong class="reads-item__title">{{ item.edition.title }}</strong>
              <span v-if="authorsLabel(item.book.authors)" class="reads-item__authors">
                {{ authorsLabel(item.book.authors) }}
              </span>
              <time v-if="dateForItem(item, 'didNotFinish')" class="reads-item__date">
                {{ dateForItem(item, "didNotFinish") }}
              </time>
            </div>
          </li>
        </ul>
        <p v-else class="reads-empty">Sem livros abandonados.</p>
        <a class="back-to-top" href="#year-reads-top">Voltar ao topo</a>
      </div>

      <div id="section-quero-ler" class="year-reads__section" data-accent="want">
        <div class="section-head">
          <h3>Quero ler</h3>
          <p>Itens que desejo ler futuramente.</p>
        </div>
        <ul v-if="data.wantToRead.length" class="reads-list">
          <li v-for="item in data.wantToRead" :key="item.readId" class="reads-item">
            <img
              v-if="item.edition.coverUrl"
              :src="coverSrc(item.edition.coverUrl)"
              :alt="`Capa de ${item.edition.title}`"
              loading="lazy"
              class="reads-item__cover"
            />
            <div class="reads-item__content">
              <strong class="reads-item__title">{{ item.edition.title }}</strong>
              <span v-if="authorsLabel(item.book.authors)" class="reads-item__authors">
                {{ authorsLabel(item.book.authors) }}
              </span>
            </div>
          </li>
        </ul>
        <p v-else class="reads-empty">Nenhum livro na fila.</p>
        <a class="back-to-top" href="#year-reads-top">Voltar ao topo</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.year-reads {
  display: grid;
  gap: 3.5rem;
  padding: 2.5rem 0 4rem;
}

.year-reads__summary {
  display: grid;
  gap: 1.75rem;
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 40px rgba(0, 0, 0, 0.45);
}

.summary-head {
  display: grid;
  gap: 0.4rem;
}

.summary-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.year-reads__summary h2 {
  margin: 0;
  font-size: clamp(1.4rem, 1.1rem + 1.2vw, 2rem);
}

.summary-subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.summary-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.summary-card {
  background: rgba(0, 0, 0, 0.65);
  border-radius: 16px;
  padding: 1rem 1.2rem;
  display: grid;
  gap: 0.35rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.5);
}

.summary-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
}

.summary-value {
  font-size: 1.6rem;
  color: var(--font-color);
}

.summary-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  font-size: 0.95rem;
}

.summary-nav a {
  color: var(--font-color);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  padding-bottom: 0.1rem;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.summary-nav a:hover {
  border-bottom-color: var(--green);
  color: var(--green);
}

.year-reads__section {
  display: grid;
  gap: 1.5rem;
  padding: 0.5rem 0;
  margin-top: 1rem;
}

.section-head {
  display: grid;
  gap: 0.35rem;
  padding-left: 1rem;
  border-left: 3px solid transparent;
}

.year-reads__section[data-accent="reading"] .section-head {
  border-left-color: rgba(141, 181, 0, 0.6);
}

.year-reads__section[data-accent="finished"] .section-head {
  border-left-color: rgba(141, 181, 0, 0.9);
}

.year-reads__section[data-accent="dnf"] .section-head {
  border-left-color: rgba(255, 120, 120, 0.6);
}

.year-reads__section[data-accent="want"] .section-head {
  border-left-color: rgba(141, 181, 0, 0.35);
}

.section-head h3 {
  margin: 0 !important;
  font-size: clamp(1.2rem, 1.05rem + 0.6vw, 1.6rem);
}

.section-head p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.reads-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1.5rem;
}

.reads-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  align-items: start;
  padding: 1.1rem 1.2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.68);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.6);
}

.reads-item__cover {
  width: 68px;
  height: 102px;
  object-fit: cover;
  border-radius: 8px;
  background: #efefef;
}

.reads-item__content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.reads-item__title {
  font-weight: 600;
}

.reads-item__authors,
.reads-item__date {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.reads-item__progress {
  font-size: 0.88rem;
  color: rgba(141, 181, 0, 0.9);
}

.reads-empty {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}

.back-to-top {
  width: fit-content;
  color: var(--font-color);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  padding-bottom: 0.1rem;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.back-to-top:hover {
  border-bottom-color: var(--green);
  color: var(--green);
}

.year-reads__skeleton {
  display: grid;
  gap: 0.75rem;
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, #f2f2f2, #e5e5e5, #f2f2f2);
  background-size: 200% 100%;
  animation: skeleton 1.2s ease-in-out infinite;
  border-radius: 6px;
}

.skeleton-line--title {
  height: 18px;
  width: 40%;
}

.year-reads__error {
  color: #fecaca;
  background: rgba(155, 28, 28, 0.25);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(155, 28, 28, 0.45);
}

@keyframes skeleton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 600px) {
  .year-reads {
    padding: 1.5rem 0 3rem;
  }

  .year-reads__summary {
    padding: 1.5rem;
  }

  .reads-item {
    gap: 0.75rem;
    padding: 0.9rem 1rem;
  }

  .reads-item__cover {
    width: 54px;
    height: 82px;
  }
}
</style>
