<script setup lang="ts">

defineProps(['title'])
const click = ref(false)
const toggleState = computed(() => {
  if (click.value) return "open"
  else return "close"
})
</script>

<template>
  <div class="toggle-card" :data-toggle-state="toggleState">
    <div class="toggle-heading" @click="() => click = !click">
      <h4 class="toggle-heading-text"><span style="white-space: pre-wrap;">{{ title }}</span></h4>
      <button class="toggle-card-icon"
              aria-label="Expand toggle to read content">
        <svg id="Regular" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path class="cls-1" d="M23.25,7.311,12.53,18.03a.749.749,0,0,1-1.06,0L.75,7.311"></path>
        </svg>
      </button>
    </div>
    <div class="toggle-content">
      <slot/>
    </div>
  </div>
</template>

<style>
.toggle-card {
  background: 0 0;
  box-shadow: inset 0 0 0 1px rgba(124, 139, 154, .25);
  border-radius: 4px;
  padding: 1.2em;
  box-sizing: border-box;
  margin: 1rem 0;
}

.toggle-card + .toggle-card {
  margin-top: 1em;
}

.toggle-card:first-of-type {
  margin: 2rem 0 auto;
}

.toggle-heading {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.toggle-card .toggle-heading-text {
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.3em;
  margin-top: 0;
  margin-bottom: 0;
}

.toggle-card-icon {
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1em;
  padding: 0;
  background: 0 0;
  border: 0;
  cursor: pointer;
}


.toggle-heading svg {
  width: 14px;
  color: rgba(124, 139, 154, .5);
  transition: all .3s;
  transform: rotate(-180deg);
}

.toggle-heading path {
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
  fill-rule: evenodd;
}

.toggle-content {
  height: auto;
  opacity: 1;
  transition: opacity 1s ease, top .35s ease;
  top: 0;
  position: relative;
}

.toggle-card .toggle-content > p {
  font-size: .95em;
  line-height: 1.5em;
  margin-top: .95em;
  margin-bottom: 0;
}

.toggle-card[data-toggle-state="close"] .toggle-content {
  height: 0;
  overflow: hidden;
  transition: opacity .5s ease, top .35s ease;
  opacity: 0;
  top: -.5em;
  position: relative;
}

.toggle-card[data-toggle-state="close"] svg {
  transform: unset;
}

</style>