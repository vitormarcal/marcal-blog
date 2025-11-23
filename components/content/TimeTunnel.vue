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
              <div class="subtitle">{{ a.artistName }} <span v-if="a.year">• {{ a.year }}</span></div>
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
              <span class="rank">{{ i+1 }}</span>
              <span class="name">{{ row.artistName }}</span>
              <span class="plays">{{ row.playCount }} plays</span>
            </li>
          </ol>
        </div>
        <div>
          <h2>Top álbuns</h2>
          <ol class="list">
            <li v-for="(row, i) in topAlbums" :key="row.albumId" class="list-row">
              <span class="rank">{{ i+1 }}</span>
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
            <span class="rank">{{ i+1 }}</span>
            <span class="name">{{ row.title }}</span>
            <span class="by">{{ row.artistName }} — {{ row.albumTitle }}</span>
            <span class="plays">{{ row.playCount }} plays</span>
          </li>
        </ol>
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
const loading = ref(false)
const error = ref('')

function computeRange(key) {
  const now = new Date()
  const end = now.toISOString()
  if (key === 'week') {
    const s = new Date(now.getTime() - 7*24*60*60*1000)
    return { start: s.toISOString(), end }
  }
  if (key === 'month') {
    const s = new Date(now.getTime() - 30*24*60*60*1000)
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
    const [summaryRes, recentRes, artistsRes, albumsRes, tracksRes] = await Promise.all([
      fetchJSON(`${API}/summary?range=custom&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`),
      fetchJSON(`${API}/recent-albums?limit=12`),
      fetchJSON(`${API}/tops/artists?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=10`),
      fetchJSON(`${API}/tops/albums?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=10`),
      fetchJSON(`${API}/tops/tracks?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=10`),
    ])
    summary.value = summaryRes
    recentAlbums.value = recentRes
    topArtists.value = artistsRes
    topAlbums.value = albumsRes
    topTracks.value = tracksRes
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

function timeAgo(timestamp) {
  if (!timestamp) return ''
  const now = Date.now()
  const ms = typeof timestamp === 'number' ? timestamp * 1000 : Date.parse(timestamp)
  const diffSec = Math.max(1, (now - ms) / 1000)
  const units = [
    ['ano', 365*24*3600],
    ['mês', 30*24*3600],
    ['dia', 24*3600],
    ['hora', 3600],
    ['min', 60],
    ['s', 1],
  ]
  for (const [name, secs] of units) {
    if (diffSec >= secs) {
      const val = Math.floor(diffSec / secs)
      const plural = (name === 'mês') ? 'meses' : name + (val > 1 && name !== 'min' && name !== 's' ? 's' : '')
      return `há ${val} ${val > 1 ? plural : name}`
    }
  }
  return 'agora'
}

function coverStyle(url) {
  if (!url) return {}
  return { backgroundImage: `url(${COVERS_API + url})` }
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

body { background: var(--bg); color: var(--text); }

.bleed { width: 100vw; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw); }

.container { max-width: 1000px; margin: 0 auto; padding: 1rem; }

h1 { text-align: center; margin-bottom: 1rem; color: #fff; }

.period-buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1rem; }
.period-buttons button {
  padding: 0.4rem 0.8rem; border: 1px solid var(--border); background: #111; color: var(--muted);
  font-size: 0.9rem; cursor: pointer; border-radius: 6px; transition: all 0.2s;
}
.period-buttons button:hover { background: #222; color: #fff; }
.period-buttons button.active { background: var(--accent); border-color: var(--accent); color: #000; }

.section { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; margin-bottom: 1rem; }

.kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.kpi { background: var(--panel-2); border: 1px solid var(--border); border-radius: 12px; padding: 0.9rem; text-align: center; }
.kpi-label { color: var(--muted); font-size: 0.8rem; margin-bottom: 0.25rem; }
.kpi-value { font-size: 1.6rem; font-weight: 700; }

.loading { text-align: center; padding: 1rem; color: var(--muted); }
.error { text-align: center; padding: 1rem; color: #f88; }

.album-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; }
.album-card { background: var(--panel-2); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; }
.cover { width: 100%; padding-top: 100%; background-size: cover; background-position: center; position: relative; }
.placeholder { position: absolute; inset: 0; display: grid; place-items: center; font-size: 2rem; color: var(--muted); }
.album-meta { padding: 0.6rem 0.7rem 0.8rem; }
.album-meta .title, .album-meta .subtitle, .album-meta .micro { white-space: normal; overflow: visible; text-overflow: clip; overflow-wrap: anywhere; word-break: normal; }
.title { font-weight: 600; color: #fff; }
.subtitle { color: var(--muted); font-size: 0.85rem; }
.micro { color: var(--muted); font-size: 0.75rem; margin-top: 0.3rem; }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.list { list-style: none; margin: 0; padding: 0; }
.list-row { display: grid; grid-template-columns: 24px 1fr auto; grid-template-rows: auto auto; column-gap: 0.75rem; row-gap: 0.25rem; padding: 0.6rem 0.25rem; border-bottom: 1px dashed var(--border); }
.list-row:last-child { border-bottom: none; }
.rank { grid-row: 1 / span 2; color: var(--muted); text-align: right; font-variant-numeric: tabular-nums; }
.name { grid-column: 2; grid-row: 1; color: #fff; font-weight: 700; min-width: 12ch; overflow-wrap: anywhere; word-break: normal; }
.by { grid-column: 2; grid-row: 2; color: var(--muted); font-size: 0.9rem; }
.plays { grid-column: 3; grid-row: 1; align-self: start; color: var(--muted); font-size: 0.85rem; white-space: nowrap; }

@media (max-width: 820px) {
  .kpis { grid-template-columns: 1fr; }
  .two-col { grid-template-columns: 1fr; }
  .album-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
}
</style>