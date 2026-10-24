<script setup lang="ts">
type Album = {
  albumId: number
  albumTitle: string
  artistId: number
  artistName: string
  year?: number | null
  coverUrl?: string | null
  lastPlayed?: string | null
  playCount?: number
}
type TopArtist = { artistId: number; artistName: string; playCount: number; albumTitle?: string | null; coverUrl?: string | null }
type TopTrack = { trackId: number; title: string; albumId: number; albumTitle: string; artistId: number; artistName: string; playCount: number }
type RediscoveredAlbum = Album & { historicalPlayCount: number; recentPlayCount: number; quietGapDays: number }
type MusicStats = { total: { playsCount: number; uniqueArtistsCount: number; uniqueAlbumsCount: number; uniqueTracksCount: number }; firstPlayAt?: string | null; latestPlayAt?: string | null }
type MusicYear = {
  stats: { playsCount: number; uniqueArtistsCount: number; uniqueAlbumsCount: number; uniqueTracksCount: number }
  albums: Array<Album & { playedTracks: number; totalTracks: number }>
  artists: TopArtist[]
  tracks: TopTrack[]
}
type ApiPage<T> = { items: T[] }

const year = new Date().getFullYear()
const { apiUrl, assetUrl } = useMediaPulseApi()
const { data, pending, error, refresh } = useAsyncData('fanzine-music-journal', async () => {
  const safe = <T>(path: string, fallback: T) => $fetch<T>(apiUrl(path)).catch(() => fallback)

  const [stats, month, yearData, recent, rediscovered] = await Promise.all([
    safe<MusicStats | null>('/api/music/stats', null),
    safe<{ artistsCount: number; albumsCount: number; tracksCount: number } | null>('/api/music/summary?range=month', null),
    safe<MusicYear | null>(`/api/music/year/${year}?limitAlbums=12&limitArtists=6&limitTracks=8`, null),
    safe<ApiPage<Album>>('/api/music/recent-albums?limit=10', { items: [] }),
    safe<RediscoveredAlbum[]>('/api/music/albums/rediscovered?limit=5', [])
  ])

  const monthEnd = new Date()
  const monthStart = new Date(monthEnd)
  monthStart.setUTCDate(monthStart.getUTCDate() - 30)
  const start = monthStart.toISOString()
  const end = monthEnd.toISOString()
  const [artists, tracks] = await Promise.all([
    safe<TopArtist[]>(`/api/music/tops/artists?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=5`, []),
    safe<TopTrack[]>(`/api/music/tops/tracks?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&limit=5`, [])
  ])
  return { stats, month, yearData, recent: recent.items || [], rediscovered, artists, tracks }
}, { server: false })

const latestAlbum = computed(() => data.value?.recent[0] || null)
const image = (url?: string | null) => url ? assetUrl(url) : ''
const number = (value?: number | null) => new Intl.NumberFormat('pt-BR').format(value || 0)
const dateLabel = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}
const daysAway = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value).getTime()
  if (!Number.isFinite(date)) return ''
  const days = Math.max(0, Math.floor((Date.now() - date) / 86_400_000))
  if (!days) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 30) return `há ${days} dias`
  const months = Math.floor(days / 30)
  return `há ${months} ${months === 1 ? 'mês' : 'meses'}`
}
useSeoMeta({ title: 'Músicas — Marçal', description: 'Um caderno de escuta: discos, artistas e faixas que passaram por aqui.' })
</script>

<template>
  <main class="music-journal">
    <header class="music-journal__header">
      <p class="music-journal__kicker">Caderno de escuta · {{ year }}</p>
      <h1>Músicas</h1>
      <p>Discos, artistas e faixas que passaram por aqui.</p>
    </header>

    <div v-if="pending && !data" class="music-journal__state" aria-busy="true">Abrindo o caderno…</div>
    <div v-else-if="error" class="music-journal__state" role="status">
      Não foi possível abrir o caderno de música agora.
      <button type="button" @click="refresh()">Tentar novamente</button>
    </div>
    <div v-else-if="data && !data.stats && !data.yearData && !data.recent.length" class="music-journal__state" role="status">
      A API de música não respondeu. <button type="button" @click="refresh()">Tentar novamente</button>
    </div>

    <template v-else-if="data">
      <section v-if="latestAlbum" class="music-journal__lead" aria-label="Escuta mais recente">
        <div class="music-journal__lead-cover">
          <img v-if="image(latestAlbum.coverUrl)" :src="image(latestAlbum.coverUrl)" :alt="`Capa de ${latestAlbum.albumTitle}`" />
          <span v-else aria-hidden="true">♪</span>
        </div>
        <div class="music-journal__lead-copy">
          <p class="music-journal__eyebrow">A última escuta</p>
          <h2>{{ latestAlbum.albumTitle }}</h2>
          <p class="music-journal__artist">{{ latestAlbum.artistName }}<span v-if="latestAlbum.year"> · {{ latestAlbum.year }}</span></p>
          <p class="music-journal__lead-note">
            {{ latestAlbum.playCount ? `${number(latestAlbum.playCount)} reproduções no acervo` : 'Um disco que voltou a tocar' }}
            <span v-if="latestAlbum.lastPlayed"> · {{ daysAway(latestAlbum.lastPlayed) }}</span>
          </p>
        </div>
        <div class="music-journal__date" v-if="latestAlbum.lastPlayed">{{ dateLabel(latestAlbum.lastPlayed) }}</div>
      </section>

      <section v-if="data.yearData?.stats" class="music-journal__year" aria-label="Escuta no ano">
        <p class="music-journal__eyebrow">O ano em escuta</p>
        <div class="music-journal__metrics">
          <div><strong>{{ number(data.yearData.stats.playsCount) }}</strong><span>reproduções</span></div>
          <div><strong>{{ number(data.yearData.stats.uniqueArtistsCount) }}</strong><span>artistas</span></div>
          <div><strong>{{ number(data.yearData.stats.uniqueAlbumsCount) }}</strong><span>álbuns</span></div>
          <div><strong>{{ number(data.yearData.stats.uniqueTracksCount) }}</strong><span>faixas</span></div>
        </div>
      </section>

      <section v-if="data.yearData?.albums.length" class="music-journal__section">
        <div class="music-journal__section-head"><p class="music-journal__eyebrow">{{ year }}</p><h2>Discos mais presentes</h2></div>
        <div class="music-journal__album-grid">
          <article v-for="album in data.yearData.albums" :key="album.albumId" class="music-journal__album">
            <div class="music-journal__album-cover"><img v-if="image(album.coverUrl)" :src="image(album.coverUrl)" :alt="`Capa de ${album.albumTitle}`" loading="lazy" /><span v-else aria-hidden="true">♪</span></div>
            <div class="music-journal__album-copy"><h3>{{ album.albumTitle }}</h3><p>{{ album.artistName }}<span v-if="album.year"> · {{ album.year }}</span></p><small>{{ number(album.playCount) }} reproduções · {{ album.playedTracks }}/{{ album.totalTracks }} faixas</small></div>
          </article>
        </div>
      </section>

      <section v-if="data.recent.length" class="music-journal__section">
        <div class="music-journal__section-head"><p class="music-journal__eyebrow">Últimos discos</p><h2>O que passou pelo toca-discos</h2></div>
        <div class="music-journal__album-grid">
          <article v-for="album in data.recent.slice(1)" :key="album.albumId" class="music-journal__album">
            <div class="music-journal__album-cover">
              <img v-if="image(album.coverUrl)" :src="image(album.coverUrl)" :alt="`Capa de ${album.albumTitle}`" loading="lazy" />
              <span v-else aria-hidden="true">♪</span>
            </div>
            <div class="music-journal__album-copy">
              <h3>{{ album.albumTitle }}</h3>
              <p>{{ album.artistName }}<span v-if="album.year"> · {{ album.year }}</span></p>
              <small v-if="album.lastPlayed">{{ daysAway(album.lastPlayed) }}<span v-if="album.playCount"> · {{ number(album.playCount) }} reproduções</span></small>
            </div>
          </article>
        </div>
      </section>

      <section v-if="data.artists.length || data.tracks.length" class="music-journal__section">
        <div class="music-journal__section-head"><p class="music-journal__eyebrow">Últimos 30 dias</p><h2>O que ficou em rotação</h2><p v-if="data.month" class="music-journal__section-note">{{ number(data.month.artistsCount) }} artistas · {{ number(data.month.albumsCount) }} álbuns · {{ number(data.month.tracksCount) }} faixas</p></div>
        <div class="music-journal__columns">
          <div v-if="data.artists.length" class="music-journal__ranking">
            <h3>Artistas</h3>
            <article v-for="(artist, index) in data.artists" :key="artist.artistId" class="music-journal__rank-row">
              <span class="music-journal__rank">{{ String(index + 1).padStart(2, '0') }}</span>
              <img v-if="image(artist.coverUrl)" :src="image(artist.coverUrl)" :alt="`Capa de ${artist.albumTitle || artist.artistName}`" loading="lazy" />
              <span class="music-journal__rank-copy"><strong>{{ artist.artistName }}</strong><small v-if="artist.albumTitle">{{ artist.albumTitle }}</small></span>
              <small class="music-journal__plays">{{ number(artist.playCount) }}×</small>
            </article>
          </div>
          <div v-if="data.tracks.length" class="music-journal__ranking">
            <h3>Faixas</h3>
            <article v-for="(track, index) in data.tracks" :key="track.trackId" class="music-journal__rank-row music-journal__rank-row--track">
              <span class="music-journal__rank">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="music-journal__rank-copy"><strong>{{ track.title }}</strong><small>{{ track.artistName }} · {{ track.albumTitle }}</small></span>
              <small class="music-journal__plays">{{ number(track.playCount) }}×</small>
            </article>
          </div>
        </div>
      </section>

      <section v-if="data.rediscovered.length" class="music-journal__section">
        <div class="music-journal__section-head"><p class="music-journal__eyebrow">De volta à vitrola</p><h2>Discos redescobertos</h2></div>
        <div class="music-journal__rediscovered">
          <article v-for="album in data.rediscovered" :key="album.albumId" class="music-journal__rediscovery">
            <img v-if="image(album.coverUrl)" :src="image(album.coverUrl)" :alt="`Capa de ${album.albumTitle}`" loading="lazy" />
            <div><h3>{{ album.albumTitle }}</h3><p>{{ album.artistName }}<span v-if="album.year"> · {{ album.year }}</span></p><small>{{ number(album.recentPlayCount) }} reproduções depois de {{ number(album.quietGapDays) }} dias quieto</small></div>
          </article>
        </div>
      </section>

      <footer class="music-journal__colophon" v-if="data.stats?.total">
        <span v-if="data.stats.firstPlayAt">Desde {{ dateLabel(data.stats.firstPlayAt) }}</span>
        <span>{{ number(data.stats.total.playsCount) }} reproduções registradas</span>
        <span>{{ number(data.stats.total.uniqueArtistsCount) }} artistas no arquivo</span>
      </footer>
    </template>
  </main>
</template>
