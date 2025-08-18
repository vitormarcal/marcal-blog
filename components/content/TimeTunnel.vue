<template>
  <div class="container">


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

    <ul class="song-list">
      <li v-for="song in songs" :key="song.id" class="song-item">
        <div class="left">
          <span class="title">{{ song.title }}</span>
          <span class="meta">{{ song.artist }} — {{ song.album }} ({{ song.year }})</span>
        </div>
        <div class="right">
          <span class="count">▶️ {{ song.playbackCount }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue"

const songs = ref([])
const period = ref("year")

const periods = [
  { key: "hour", label: "Última Hora" },
  { key: "day", label: "Último Dia" },
  { key: "week", label: "Última Semana" },
  { key: "month", label: "Último Mês" },
  { key: "year", label: "Ano" },
  { key: "decade", label: "Década" },
]

watchEffect(async () => {
  const res = await fetch(`https://media-pulse.marcal.dev/playbacks/top?period=${period.value}&limit=15`)
  const data = await res.json()
  songs.value = data.data
})
</script>

<style>
/* Dark theme compacto */
body {
  background: #000;
  color: #ddd;
}

.container {
  max-width: 800px;
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
  border: 1px solid #555;
  background: #111;
  color: #aaa;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s;
}
.period-buttons button:hover {
  background: #222;
  color: #fff;
}
.period-buttons button.active {
  background: #1db954;
  border-color: #1db954;
  color: #fff;
}

.song-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.8rem;
  border-bottom: 1px solid #222;
  background: #0a0a0a;
  transition: background 0.2s;
}
.song-item:hover {
  background: #151515;
}

.song-item .left {
  display: flex;
  flex-direction: column;
}
.song-item .title {
  font-size: 0.95rem;
  font-weight: bold;
  color: #fff;
}
.song-item .meta {
  font-size: 0.8rem;
  color: #888;
}
.song-item .right {
  font-size: 0.9rem;
  font-weight: bold;
  color: #1db954; /* verde destaque */
}
</style>
