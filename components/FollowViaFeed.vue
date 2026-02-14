<script setup lang="ts">
const appConfig = useAppConfig()
const sectionTitle = 'Acompanhe o blog!'
const sectionLead = 'Quer receber as atualizações?'
const sectionDescription = 'O RSS é uma maneira prática e independente de acompanhar o blog, sem depender de algoritmos.'
const sectionHelpText = 'Escolha o formato que preferir:'
const rssUrl = computed(() => `${appConfig.site.baseUrl}/rss.xml`)
const atomUrl = computed(() => `${appConfig.site.baseUrl}/atom.xml`)
</script>

<template>
  <div class="follow-via-feed">
    <h3>{{ sectionTitle }}</h3>
    <p><strong>{{ sectionLead }}</strong></p>
    <p>{{ sectionDescription }}</p>
    <p>{{ sectionHelpText }}</p>
    <p>
      <a :href="rssUrl">RSS</a>
      ·
      <a :href="atomUrl">Atom</a>
    </p>
  </div>
</template>

<style scoped>
.follow-via-feed {
  text-align: center;
  line-height: 1.7;
}

.follow-via-feed h3 {
  font-size: 20px;
  margin-bottom: 1rem;
}

.follow-via-feed p {
  margin: 0.25rem 0;
}
</style>
