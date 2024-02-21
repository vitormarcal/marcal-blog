<template>

  <section>
    <div class="audio-card">
      <div class="audio-thumbnail">
        <svg width="24" height="24" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M7.5 15.33a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM15 13.83a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm-2.25.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z"></path>
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M14.486 6.81A2.25 2.25 0 0 1 17.25 9v5.579a.75.75 0 0 1-1.5 0v-5.58a.75.75 0 0 0-.932-.727.755.755 0 0 1-.059.013l-4.465.744a.75.75 0 0 0-.544.72v6.33a.75.75 0 0 1-1.5 0v-6.33a2.25 2.25 0 0 1 1.763-2.194l4.473-.746Z"></path>
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M3 1.5a.75.75 0 0 0-.75.75v19.5a.75.75 0 0 0 .75.75h18a.75.75 0 0 0 .75-.75V5.133a.75.75 0 0 0-.225-.535l-.002-.002-3-2.883A.75.75 0 0 0 18 1.5H3ZM1.409.659A2.25 2.25 0 0 1 3 0h15a2.25 2.25 0 0 1 1.568.637l.003.002 3 2.883a2.25 2.25 0 0 1 .679 1.61V21.75A2.25 2.25 0 0 1 21 24H3a2.25 2.25 0 0 1-2.25-2.25V2.25c0-.597.237-1.169.659-1.591Z"></path>
        </svg>
      </div>
      <div class="audio-player-container">
        <audio preload="metadata"
               :src="src"
               @timeupdate="onPlaying"
               ref="audioPlayer">
          Seu navegador não suporta o elemento de áudio.
        </audio>
        <div class="audio-title">
          <slot name="caption"/>
        </div>
        <div class="audio-player">
          <button v-if="!playing"
                  @click="play"
                  class="audio-play-icon" aria-label="Play audio">
            <svg viewBox="0 0 24 24">
              <path
                  d="M23.14 10.608 2.253.164A1.559 1.559 0 0 0 0 1.557v20.887a1.558 1.558 0 0 0 2.253 1.392L23.14 13.393a1.557 1.557 0 0 0 0-2.785Z"></path>
            </svg>
          </button>
          <button v-else class="audio-pause-icon" aria-label="Pause audio" @click="pause">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect>
              <rect x="14" y="1" width="7" height="22" rx="1.5" ry="1.5"></rect>
            </svg>
          </button>
          <span class="audio-current-time">{{ currentTime }}</span>
          <div class="audio-time">/<span class="audio-duration">{{ duration }}</span></div>
          <input type="range"
                 step="1"
                 @change="onSeek"
                 v-model="seekValue"
                 class="audio-seek-slider" max="100">
          <button class="audio-playback-rate" aria-label="Adjust playback speed" @click="setSpeed">{{
              currentSpeed
            }}×
          </button>
          <button class="audio-mute-icon"
                  @click="toggleMute"
                  v-if="muted"
                  aria-label="Mute">
            <svg viewBox="0 0 24 24">
              <path
                  d="M16.177 4.3a.248.248 0 0 0 .073-.176v-1.1a1 1 0 0 0-1.061-1 9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h.114a.251.251 0 0 0 .177-.073ZM23.707 1.706A1 1 0 0 0 22.293.292l-22 22a1 1 0 0 0 0 1.414l.009.009a1 1 0 0 0 1.405-.009l6.63-6.631A.251.251 0 0 1 8.515 17a.245.245 0 0 1 .177.075 10.081 10.081 0 0 0 6.5 2.92 1 1 0 0 0 1.061-1V9.266a.247.247 0 0 1 .073-.176Z"></path>
            </svg>
          </button>
          <button class="audio-unmute-icon"
                  aria-label="Unmute"
                  @click="toggleMute"
                  v-else
          >
            <svg viewBox="0 0 24 24">
              <path
                  d="M15.189 2.021a9.728 9.728 0 0 0-7.924 4.85.249.249 0 0 1-.221.133H5.25a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1.794a.249.249 0 0 1 .221.133 9.73 9.73 0 0 0 7.924 4.85h.06a1 1 0 0 0 1-1V3.02a1 1 0 0 0-1.06-.998Z"></path>
            </svg>
          </button>
          <input type="range" class="audio-volume-slider"
                 @change="setVolume"
                 v-model="volume"
                 step="0.1"
                 max="1">
        </div>
      </div>
    </div>
  </section>


</template>
<script setup lang="ts">
defineProps(['src'])
const playing = ref(false)
const duration = ref("0.00")
const audioPlayer = ref(null)
const seekValue = ref(0)
const currentTime = ref("0:00")
const currentSpeed = ref(1)
const muted = ref(false)
const volume = ref(1)


function play() {
  if (audioPlayer.value) {
    audioPlayer.value?.play()
    playing.value = true
    duration.value = formatarSegundos(audioPlayer.value?.duration)
  }

}

function pause() {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    playing.value = false
  }
}

function onSeek() {
  if (audioPlayer.value) {
    audioPlayer.value!!.currentTime = audioPlayer.value!!.duration * (seekValue.value / 100);
  }
}

function setVolume() {
  if (audioPlayer.value) {
    audioPlayer.value!!.volume = volume.value
  }
}

function onPlaying() {
  if (audioPlayer.value) {
    currentTime.value = formatarSegundos(audioPlayer.value!!.currentTime);
    seekValue.value = (audioPlayer.value!!.currentTime / audioPlayer.value!!.duration) * 100;
  }

}

function setSpeed() {
  if (audioPlayer.value) {
    const speed = audioPlayer.value!!.playbackRate
    if (speed < 1) {
      audioPlayer.value!!.playbackRate = 1
    } else if (speed < 1.5) {
      audioPlayer.value!!.playbackRate = 1.5
    } else if (speed < 2) {
      audioPlayer.value!!.playbackRate = 2
    } else {
      audioPlayer.value!!.playbackRate = 0.7
    }
    currentSpeed.value = audioPlayer.value!!.playbackRate
  }

}

function toggleMute() {
  if (audioPlayer.value) {
    if (audioPlayer.value!!.volume) {
      audioPlayer.value!!.volume = 0
    } else {
      audioPlayer.value!!.volume = 1
    }
    muted.value = !muted.value
  }

}

function formatarSegundos(segundos: number): string {
  if (segundos == null) return "0:00"
  const min = Math.floor(segundos / 60);
  const sec = Math.floor(segundos % 60);

  // Adiciona zeros à esquerda se necessário
  const mm = min < 10 ? '0' + min : min;
  const ss = sec < 10 ? '0' + sec : sec;

  return mm + ':' + ss;
}

</script>

<style scoped>

.audio-card {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 96px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1px rgba(124, 139, 154, .25);
  padding: 1px;
}

.audio-thumbnail {
  background: #8DB500;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  min-width: 80px;
  margin: 8px;
  aspect-ratio: 1/1;
  border-radius: 2px;;
}

.audio-thumbnail svg {
  width: 24px;
  height: 24px;
  fill: #fff;
}

.audio-player-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.audio-title {
  width: 100%;
  margin: 8px 0 0;
  padding: 8px 12px;
  border: 0;
  font-family: inherit;
  font-size: 1.15em;
  font-weight: 700;
  line-height: 1.15em;
  background: 0 0;
}

.audio-player {
  display: flex;
  flex-grow: 1;
  align-items: center;
  padding: 8px 12px;
  margin: initial;
}

.audio-play-icon {
  color: #fff;
  display: flex;
  align-items: center;
  border: 0;
  cursor: pointer;
  position: relative;
  bottom: 1px;
  padding: 0 4px 0 0;
  font-size: 0;
  background: 0 0;
}

.audio-play-icon svg, .audio-pause-icon svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.audio-pause-icon {
  color: #fff;
  border: 0;
  cursor: pointer;
  position: relative;
  bottom: 1px;
  padding: 0 4px 0 0;
  font-size: 0;
  background: 0 0;
}

.audio-current-time {
  min-width: 38px;
  padding: 0 4px;
}

.audio-time {
  width: 56px;
  color: #ababab;
  margin: initial;
}

.audio-current-time, .audio-time {
  font-family: inherit;
  font-size: .85em;
  font-weight: 500;
  line-height: 1.4em;
  white-space: nowrap;
}

.audio-duration {
  padding: 0 4px;
}

.audio-player-container input[type="range"] {
  position: relative;
  -moz-appearance: none;
  background: 0 0;
  height: auto;
  padding: 0;
  border: 0;
}

.audio-player-container input[type="range"]::-moz-range-progress {
  background: currentColor;
  border-radius: 2px;
}

.audio-player-container input[type="range"]:active::-moz-range-thumb {
  transform: scale(1.2);
}

.audio-player-container input[type="range"]::-moz-range-thumb {
  box-sizing: content-box;
  width: 13px;
  height: 13px;
  border: 0;
  cursor: pointer;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, .08), 0 1px 4px rgba(0, 0, 0, .24);
}

.audio-player-container input[type="range"]::-moz-range-track {
  width: 100%;
  height: 3px;
  cursor: pointer;
  background: rgba(124, 139, 154, .25);
  border-radius: 2px;
}

.audio-volume-slider {
  width: 80px;
  color: hsla(0, 0%, 100%, .3);
}

.audio-seek-slider::before, .audio-volume-slider::before {
  content: "";
  position: absolute;
  left: 0;
  width: 0 !important;
  height: 4px;
  cursor: pointer;
  background-color: currentColor;
  border-radius: 2px;
}

.audio-player-container input[type="range"]:focus {
  outline: 0;
}

.audio-seek-slider {
  flex-grow: 1;
  margin: 0 4px;
}

@media (max-width: 640px) {
  .audio-seek-slider {
    display: none;
  }
}

.audio-playback-rate {
  color: #fff;
  display: flex;
  align-items: center;
  border: 0;
  cursor: pointer;
  min-width: 37px;
  padding: 0 4px;
  font-family: inherit;
  font-size: .85em;
  font-weight: 600;
  line-height: 1.4em;
  text-align: left;
  background: 0 0;
  white-space: nowrap;
}

.audio-unmute-icon {
  color: #fff;
  display: flex;
  align-items: center;
  border: 0;
  cursor: pointer;
  position: relative;
  bottom: -1px;
  padding: 0 4px;
  font-size: 0;
  background: 0 0;
}

.audio-unmute-icon svg, .audio-mute-icon svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.audio-mute-icon {
  color: #fff;
  display: flex;
  align-items: center;
  border: 0;
  cursor: pointer;
  position: relative;
  bottom: -1px;
  padding: 0 4px;
  font-size: 0;
  background: 0 0;
}

</style>