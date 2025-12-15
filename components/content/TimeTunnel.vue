<template>
  <div class="container bleed">
    <h1>Isso é o que ando ouvindo</h1>

    <div class="period-buttons">
      <button
          v-for="p in periods"
          :key="p.key"
          :class="{ active: p.key === period }"
          @click="period = p.key"
      >
        {{ p.label }}
      </button>
    </div>

    <div class="section kpis" v-if="summary">
      <div class="kpi">
        <div class="kpi-label">Artistas</div>
        <div class="kpi-value">{{ formatNumber(summary.artistsCount) }}</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Álbuns</div>
        <div class="kpi-value">{{ formatNumber(summary.albumsCount) }}</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Faixas</div>
        <div class="kpi-value">{{ formatNumber(summary.tracksCount) }}</div>
      </div>
    </div>

    <div v-if="loading" class="loading">Carregando…</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="grids" v-if="!loading && !error">
      <section class="section">
        <h2>Reproduções recentes</h2>
        <div class="album-grid">
          <div v-for="a in recentAlbums" :key="a.albumId" class="album-card">
            <div class="cover" :style="coverStyle(a.coverUrl)">
              <span v-if="!a.coverUrl" class="placeholder">♪</span>
            </div>
            <div class="album-meta">
              <div class="title">{{ a.albumTitle }}</div>
              <div class="subtitle">
                {{ a.artistName }}
                <span v-if="a.year">• {{ a.year }}</span>
              </div>
              <div class="micro">{{ timeAgo(a.lastPlayed) }} • {{ a.playCount }} plays</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section two-col">
        <div>
          <h2>Top artistas</h2>
          <ol class="list">
            <li v-for="(row, i) in topArtists" :key="row.artistId" class="list-row">
              <span class="rank">{{ i + 1 }}</span>
              <span class="name">{{ row.artistName }}</span>
              <span class="plays">{{ row.playCount }} plays</span>
            </li>
          </ol>
        </div>
        <div>
          <h2>Top álbuns</h2>
          <ol class="list">
            <li v-for="(row, i) in topAlbums" :key="row.albumId" class="list-row">
              <span class="rank">{{ i + 1 }}</span>
              <span class="name">{{ row.albumTitle }}</span>
              <span class="by">por {{ row.artistName }}</span>
              <span class="plays">{{ row.playCount }} plays</span>
            </li>
          </ol>
        </div>
      </section>

      <section class="section">
        <h2>Top faixas</h2>
        <ol class="list tracks">
          <li v-for="(row, i) in topTracks" :key="row.trackId" class="list-row">
            <span class="rank">{{ i + 1 }}</span>
            <span class="name">{{ row.title }}</span>
            <span class="by">{{ row.artistName }} — {{ row.albumTitle }}</span>
            <span class="plays">{{ row.playCount }} plays</span>
          </li>
        </ol>
      </section>

      <section class="section two-col" v-if="trendingGenres.length || recentGenres.length">
        <div>
          <h2>Gêneros em alta</h2>
          <p class="section-subtitle">
            Comparando {{ periodLabel(comparePeriod) }} vs {{ periodLabel(period) }}.
          </p>
          <ol class="list">
            <li v-for="(row, i) in trendingGenres" :key="row.genre" class="list-row">
              <span class="rank">{{ i + 1 }}</span>
              <span class="name">{{ row.genre }}</span>
              <span class="plays">{{ signed(row.delta) }}</span>
              <span class="by">
          agora {{ row.playCountNow }} | antes {{ row.playCountPrev }}
        </span>
            </li>
          </ol>
        </div>

        <div>
          <h2>Gêneros recentes</h2>
          <p class="section-subtitle">Baseado nos últimos plays.</p>
          <ol class="list">
            <li v-for="(row, i) in recentGenres" :key="row.genre" class="list-row">
              <span class="rank">{{ i + 1 }}</span>
              <span class="name">{{ row.genre }}</span>
              <span class="plays">{{ row.playCountInWindow }}x</span>
              <span class="by">{{ timeAgo(row.lastPlayed) }}</span>
            </li>
          </ol>
        </div>
      </section>

      <section class="section two-col" v-if="underplayedGenres.length || topGenresBySource.length">
        <div>
          <h2>Gêneros pouco tocados</h2>
          <p class="section-subtitle">
            No período selecionado, mas com boa presença na biblioteca.
          </p>
          <ol class="list">
            <li v-for="(row, i) in underplayedGenres" :key="row.genre" class="list-row">
              <span class="rank">{{ i + 1 }}</span>
              <span class="name">{{ row.genre }}</span>
              <span class="plays">{{ row.playCount }} plays</span>
              <span class="by">
          {{ row.libraryAlbums }} álbuns
          <span v-if="row.lastPlayed"> • {{ timeAgo(row.lastPlayed) }}</span>
          <span v-else> • nunca no período</span>
        </span>
            </li>
          </ol>
        </div>

        <div>
          <h2>Top gêneros por fonte</h2>
          <p class="section-subtitle">De onde veio o gênero do álbum.</p>

          <div v-for="block in topGenresBySource" :key="block.source" class="source-block">
            <div class="source-title">{{ formatSource(block.source) }}</div>
            <ol class="list compact">
              <li v-for="(g, i) in block.genres" :key="block.source + '-' + g.genre" class="list-row compact-row">
                <span class="rank">{{ i + 1 }}</span>
                <span class="name">{{ g.genre }}</span>
                <span class="plays">{{ g.playCount }} plays</span>
              </li>
            </ol>
          </div>
        </div>
      </section>


      <section class="section" v-if="neverPlayedAlbums.length">
        <h2>Álbuns que ainda não ouvi</h2>
        <p class="section-subtitle">
          Até o momento, esses álbuns têm 0 reproduções registradas.
        </p>

        <div class="shuffle-row">
          <button class="shuffle-btn" @click="shuffleAlbum">
            <span class="icon-dice" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="7" cy="7" r="2" />
                <circle cx="17" cy="7" r="2" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
                <rect x="3" y="3" width="18" height="18" rx="4" ry="4"
                      fill="none" stroke="currentColor" stroke-width="2" />
              </svg>
            </span>
            Me recomenda um agora
          </button>
          <div v-if="highlightedAlbum" class="shuffle-current">
            Ouça agora:
            <strong>{{ highlightedAlbum.albumTitle }}</strong>
            <span class="by"> — {{ highlightedAlbum.artistName }}</span>
          </div>
        </div>

        <div class="album-grid">
          <div v-for="a in neverPlayedAlbums" :key="a.albumId" class="album-card">
            <div class="cover placeholder-cover">
              <span class="placeholder">♪</span>
            </div>
            <div class="album-meta">
              <div class="title">{{ a.albumTitle }}</div>
              <div class="subtitle">por {{ a.artistName }}</div>
              <div class="micro">0 plays</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section two-col" v-if="artistCoverage.length || albumCoverage.length">
        <div>
          <h2>Cobertura de artistas</h2>
          <ol class="list">
            <li
                v-for="(row, i) in artistCoverage"
                :key="row.artistId"
                class="list-row list-row-coverage"
            >
              <span class="rank">{{ i + 1 }}</span>
              <span class="name">
                {{ row.artistName }}
                 <span class="badge" v-if="coverageBadge(row.coveragePercent)">
                    {{ coverageBadge(row.coveragePercent) }}
                 </span>
              </span>
              <span class="by">
                {{ formatNumber(row.playedTracks) }} / {{ formatNumber(row.totalTracks) }} faixas
              </span>
              <span class="plays">{{ formatPercent(row.coveragePercent) }}</span>
            </li>
          </ol>
        </div>
        <div>
          <h2>Cobertura de álbuns</h2>
          <ol class="list">
            <li
                v-for="(row, i) in albumCoverage"
                :key="row.albumId"
                class="list-row list-row-coverage"
            >
              <span class="rank">{{ i + 1 }}</span>
              <span class="name">
                {{ row.albumTitle }}
                <span class="badge" v-if="coverageBadge(row.coveragePercent)">
                  {{ coverageBadge(row.coveragePercent) }}
                </span>
              </span>
              <span class="by">por {{ row.artistName }}</span>
              <span class="plays">{{ formatPercent(row.coveragePercent) }}</span>
            </li>
          </ol>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const API = 'https://media-pulse.marcal.dev/api/music'
const COVERS_API = 'https://media-pulse.marcal.dev'

const period = ref('week')
const periods = [
  { key: 'week', label: 'Última Semana' },
  { key: 'month', label: 'Último Mês' },
  { key: 'year', label: 'Ano' },
  { key: 'decade', label: 'Década' },
]

const summary = ref(null)
const recentAlbums = ref([])
const topArtists = ref([])
const topAlbums = ref([])
const topTracks = ref([])

const trendingGenres = ref([])
const recentGenres = ref([])
const underplayedGenres = ref([])
const topGenresBySource = ref([])

const comparePeriod = ref('month') // default bom: compara mês vs período atual

const neverPlayedAlbums = ref([])
const artistCoverage = ref([])
const albumCoverage = ref([])

const highlightedAlbum = ref(null)

const loading = ref(false)
const error = ref('')

function shuffleAlbum() {
  const pool = neverPlayedAlbums.value
  if (!pool || pool.length === 0) {
    highlightedAlbum.value = null
    return
  }
  const idx = Math.floor(Math.random() * pool.length)
  highlightedAlbum.value = pool[idx]
}

function computeRange(key) {
  const now = new Date()
  const end = now.toISOString()
  if (key === 'week') {
    const s = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return { start: s.toISOString(), end }
  }
  if (key === 'month') {
    const s = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return { start: s.toISOString(), end }
  }
  if (key === 'year') {
    const s = new Date(Date.UTC(now.getUTCFullYear(), 0, 1))
    return { start: s.toISOString(), end }
  }
  if (key === 'decade') {
    const decadeStartYear = Math.floor(now.getUTCFullYear() / 10) * 10
    const s = new Date(Date.UTC(decadeStartYear, 0, 1))
    return { start: s.toISOString(), end }
  }
  const s = new Date(Date.UTC(now.getUTCFullYear(), 0, 1))
  return { start: s.toISOString(), end }
}

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const { start, end } = computeRange(period.value)
    const current = computeRange(period.value)
    const { start: prevStart, end: prevEnd } = computePreviousRange(current)
    const [
      summaryRes,
      recentRes,
      artistsRes,
      albumsRes,
      tracksRes,
      neverPlayedRes,
      albumCoverageRes,
      artistCoverageRes,
      trendingGenresRes,
      recentGenresRes,
      underplayedGenresRes,
      topGenresBySourceRes,
    ] = await Promise.all([
      fetchJSON(
          `${API}/summary?range=custom&start=${encodeURIComponent(start)}&end=${encodeURIComponent(
              end,
          )}`,
      ),
      fetchJSON(`${API}/recent-albums?limit=12`),
      fetchJSON(
          `${API}/tops/artists?start=${encodeURIComponent(start)}&end=${encodeURIComponent(
              end,
          )}&limit=10`,
      ),
      fetchJSON(
          `${API}/tops/albums?start=${encodeURIComponent(start)}&end=${encodeURIComponent(
              end,
          )}&limit=10`,
      ),
      fetchJSON(
          `${API}/tops/tracks?start=${encodeURIComponent(start)}&end=${encodeURIComponent(
              end,
          )}&limit=10`,
      ),
      // novos endpoints (não dependem do período)
      fetchJSON(`${API}/albums/never-played?limit=12`),
      fetchJSON(`${API}/coverage/albums?limit=10`),
      fetchJSON(`${API}/coverage/artists?limit=10`),

      // novos gêneros
      fetchJSON(
          `${API}/genres/trending?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}` +
          `&compareStart=${encodeURIComponent(prevStart)}&compareEnd=${encodeURIComponent(prevEnd)}&limit=10`,
      ),
      fetchJSON(`${API}/genres/recent?limit=30`),
      fetchJSON(
          `${API}/genres/underplayed?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}` +
          `&minLibraryAlbums=3&limit=10`,
      ),
      fetchJSON(
          `${API}/genres/top-by-source?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=7`,
      ),
    ])

    summary.value = summaryRes
    recentAlbums.value = recentRes
    topArtists.value = artistsRes
    topAlbums.value = albumsRes
    topTracks.value = tracksRes

    neverPlayedAlbums.value = neverPlayedRes
    albumCoverage.value = albumCoverageRes
    artistCoverage.value = artistCoverageRes

    trendingGenres.value = trendingGenresRes
    recentGenres.value = recentGenresRes
    underplayedGenres.value = underplayedGenresRes
    topGenresBySource.value = topGenresBySourceRes

    if (neverPlayedRes.length > 0) {
      const idx = Math.floor(Math.random() * neverPlayedRes.length)
      highlightedAlbum.value = neverPlayedRes[idx]
    } else {
      highlightedAlbum.value = null
    }

  } catch (e) {
    error.value = `Falha ao carregar: ${e.message}`
  } finally {
    loading.value = false
  }
}

watch(period, load, { immediate: true })

function formatNumber(n) {
  return new Intl.NumberFormat('pt-BR').format(n ?? 0)
}

function formatPercent(n) {
  if (n == null) return ''
  const val = Number(n)
  return `${new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(val)}%`
}

function timeAgo(timestamp) {
  if (!timestamp) return ''
  const now = Date.now()
  const ms = typeof timestamp === 'number' ? timestamp * 1000 : Date.parse(timestamp)
  const diffSec = Math.max(1, (now - ms) / 1000)
  const units = [
    ['ano', 365 * 24 * 3600],
    ['mês', 30 * 24 * 3600],
    ['dia', 24 * 3600],
    ['hora', 3600],
    ['min', 60],
    ['s', 1],
  ]
  for (const [name, secs] of units) {
    if (diffSec >= secs) {
      const val = Math.floor(diffSec / secs)
      const plural = name === 'mês' ? 'meses' : name + (val > 1 && name !== 'min' && name !== 's' ? 's' : '')
      return `há ${val} ${val > 1 ? plural : name}`
    }
  }
  return 'agora'
}

function coverStyle(url) {
  if (!url) return {}
  return { backgroundImage: `url(${COVERS_API + url})` }
}

function coverageBadge(percent) {
  if (percent == null) return ''
  const p = Number(percent)
  if (p === 0) return '🚫'
  if (p === 100) return '✅'
  if (p >= 80) return '🎯'
  return ''
}

function signed(n) {
  const v = Number(n ?? 0)
  if (v > 0) return `+${v}`
  return `${v}`
}

function periodLabel(key) {
  const map = {
    week: 'Última Semana',
    month: 'Último Mês',
    year: 'Ano',
    decade: 'Década',
  }
  return map[key] ?? key
}

function formatSource(s) {
  if (!s) return ''
  if (s === 'PLEX') return 'Plex'
  if (s === 'MUSICBRAINZ') return 'MusicBrainz'
  if (s === 'LASTFM') return 'Last.fm'
  return s
}

function computePreviousRange({ start, end }) {
  const s = new Date(start)
  const e = new Date(end)

  const durationMs = e.getTime() - s.getTime()

  const prevEnd = new Date(s.getTime())
  const prevStart = new Date(prevEnd.getTime() - durationMs)

  return {
    start: prevStart.toISOString(),
    end: prevEnd.toISOString(),
  }
}


</script>

<style>
:root {
  --bg: #000;
  --panel: #0e0e0e;
  --panel-2: #141414;
  --text: #ddd;
  --muted: #aaa;
  --border: #2a2a2a;
  --accent: #1db954;
}

body {
  background: var(--bg);
  color: var(--text);
}

.bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.badge {
  margin-left: 0.35rem;
  font-size: 0.9rem;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: #fff;
}

.period-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}
.period-buttons button {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border);
  background: #111;
  color: var(--muted);
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}
.period-buttons button:hover {
  background: #222;
  color: #fff;
}
.period-buttons button.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #000;
}

.section {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
.kpi {
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.9rem;
  text-align: center;
}
.kpi-label {
  color: var(--muted);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}
.kpi-value {
  font-size: 1.6rem;
  font-weight: 700;
}

.loading {
  text-align: center;
  padding: 1rem;
  color: var(--muted);
}
.error {
  text-align: center;
  padding: 1rem;
  color: #f88;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
}
.album-card {
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cover {
  width: 100%;
  padding-top: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}
.placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 2rem;
  color: var(--muted);
}
.placeholder-cover {
  background: #111;
}
.album-meta {
  padding: 0.6rem 0.7rem 0.8rem;
}
.album-meta .title,
.album-meta .subtitle,
.album-meta .micro {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
  word-break: normal;
}
.title {
  font-weight: 600;
  color: #fff;
}
.subtitle {
  color: var(--muted);
  font-size: 0.85rem;
}
.micro {
  color: var(--muted);
  font-size: 0.75rem;
  margin-top: 0.3rem;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.section-subtitle {
  color: var(--muted);
  font-size: 0.85rem;
  margin: 0 0 0.6rem;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.list-row {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  grid-template-rows: auto auto;
  column-gap: 0.75rem;
  row-gap: 0.25rem;
  padding: 0.6rem 0.25rem;
  border-bottom: 1px dashed var(--border);
}
.list-row:last-child {
  border-bottom: none;
}
.rank {
  grid-row: 1 / span 2;
  color: var(--muted);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.name {
  grid-column: 2;
  grid-row: 1;
  color: #fff;
  font-weight: 700;
  min-width: 12ch;
  overflow-wrap: anywhere;
  word-break: normal;
}
.by {
  grid-column: 2;
  grid-row: 2;
  color: var(--muted);
  font-size: 0.9rem;
}
.plays {
  grid-column: 3;
  grid-row: 1;
  align-self: start;
  color: var(--muted);
  font-size: 0.85rem;
  white-space: nowrap;
}

.list-row-coverage .by {
  font-size: 0.85rem;
}

.shuffle-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.shuffle-btn {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.shuffle-btn:hover {
  background: var(--accent);
  color: #000;
}

.shuffle-current {
  font-size: 0.9rem;
  color: var(--muted);
}

.shuffle-current strong {
  color: #fff;
}

.shuffle-btn {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.shuffle-btn:hover {
  background: var(--accent);
  color: #000;
}

.icon-dice {
  width: 18px;
  height: 18px;
  display: flex;
}

.icon-dice svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.shuffle-btn:hover .icon-dice {
  transform: rotate(20deg);
  transition: transform 0.15s ease-out;
}



@media (max-width: 820px) {
  .kpis {
    grid-template-columns: 1fr;
  }
  .two-col {
    grid-template-columns: 1fr;
  }
  .album-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}


.source-block {
  margin-bottom: 0.75rem;
}

.source-title {
  color: #fff;
  font-weight: 700;
  margin: 0.25rem 0 0.35rem;
}

.list.compact .list-row {
  padding: 0.45rem 0.25rem;
  grid-template-rows: auto;
}

.list-row.compact-row .rank {
  grid-row: 1;
}
.list-row.compact-row .name {
  grid-row: 1;
}
.list-row.compact-row .plays {
  grid-row: 1;
}
</style>