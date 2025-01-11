<script setup lang="ts">

import {formatDate} from "~/utils/date-utils";

definePageMeta({
  layout: 'book-layout',
})
const route = useRoute()
const postName = route.params.slug[0]

const { data } = await useAsyncData('/' + postName, () => queryContent()
    .where({
      _path: '/' + postName,
    })
    .findOne())

const readingStatus = computed(() => {
  if (data.value) {
    if (data.value.reading_status == 'completed') return "Finalizada"
    if (data.value.reading_status == 'abandoned') return "Abandonada"
    return "Lendo"
  }
})

const dateRead = computed(() => {
  if (data.value) {
    return data.value.date_read || data.value.updated_at || data.value.created_at
  }
})


const feedbackValue = computed<'gostei' | 'neutro' | 'não gostei' | ''>(() => data.value?.feedback[0] || '');
const feedback = computed(() => {
  const feedbackMap: Record<'gostei' | 'neutro' | 'não gostei', { feedbackClass: string, text: string }> = {
    'gostei': {feedbackClass: 'liked', text: "Gostei 😊"},
    'neutro': {feedbackClass: 'neutral', text: "Neutro 🤔"},
    'não gostei': {feedbackClass: 'not-liked', text: "Não gostei 😞"}
  };
  return feedbackMap[feedbackValue.value as 'gostei' | 'neutro' | 'não gostei'] || {
    feedbackClass: 'not-evaluated',
    text: "Não avaliado"
  };
});

</script>

<template>
  <div v-if="data" class="book-tracker-container">

    <div class="book-header">
      <img :src="data.image" alt="Capa do livro">
      <div class="book-info">
        <h1>{{ data.title }}</h1>
        <p><strong>Autor(es):</strong> {{ data.author }}</p>
        <p><strong>Data de leitura:</strong> {{ formatDate(dateRead) }}</p>
        <p><strong>Status data leitura:</strong> {{ readingStatus }}</p>
        <p><strong>Avaliação:</strong> <span :class="feedback.feedbackClass">{{ feedback.text }}</span></p>
        <div class="details-grid">
          <p><strong>ISBN:</strong> {{ data.isbn || '--' }}</p>
          <p><strong>Número de páginas:</strong> {{ data.page_number || '--' }}</p>
          <div>
            <p><strong>Gêneros:</strong></p>
            <span class="badge" v-for="genre in data.genre">{{ genre }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="review-section">
      <h2>Minha Review</h2>
      <ContentRenderer :value="data"/>
    </div>

    <div class="author-section" v-if="false">
      <h2>Sobre o Autor</h2>
      <p>Buronson é um renomado escritor de mangás, conhecido por suas histórias cativantes e impactantes. Tetsuo Hara,
        co-autor, é um dos ilustradores mais icônicos do Japão, famoso por seu traço detalhado e expressivo.</p>
    </div>
    <div class="related-section" v-if="false">
      <h2>Outros Livros Relacionados</h2>
      <div class="related-books">
        <img src="https://via.placeholder.com/120x180" alt="Livro relacionado 1">
        <img src="https://via.placeholder.com/120x180" alt="Livro relacionado 2">
        <img src="https://via.placeholder.com/120x180" alt="Livro relacionado 3">
      </div>
    </div>


    <NuxtLink to="/books" class="back-link">Ver lista de livros lidos</NuxtLink>
  </div>
</template>

<style scoped>
.book-tracker-container {
  .book-header {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  .book-header img {
    width: 180px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .book-info {
    flex: 1;
  }

  .book-info h1 {
    margin: 0 0 10px;
    font-size: 1.8rem;
    color: #6c4a4a;
  }

  .book-info p {
    margin: 5px 0;
    font-size: 1rem;
    line-height: 1.6;
  }

  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 20px 0;
  }

  .details-grid p {
    margin: 0;
    font-size: 1rem;
  }

  .badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.9rem;
    margin: 2px;
    background-color: #f0e6d2;
    color: #6c4a4a;
  }

  .review-section {
    margin-top: 30px;
  }

  .review-section h2 {
    color: #6c4a4a;
    margin-bottom: 10px;
  }

  .review-section:deep() p {
    font-size: 1rem;
    line-height: 1.6;
    background-color: #f9f8f5;
    padding: 15px;
    margin: 1rem 0;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .related-section, .author-section {
    margin-top: 30px;
  }

  .related-section h2, .author-section h2 {
    margin-bottom: 10px;
    color: #6c4a4a;
  }

  .related-books {
    display: flex;
    gap: 20px;
    overflow-x: auto;
  }

  .related-books img {
    width: 120px;
    height: auto;
    border-radius: 8px;
    transition: transform 0.3s ease;
  }

  .related-books img:hover {
    transform: scale(1.1);
  }

  .author-section p {
    font-size: 1rem;
    line-height: 1.6;
  }

  .back-link {
    display: inline-block;
    margin-top: 20px;
    text-decoration: none;
    color: #6c4a4a;
    font-weight: bold;
    font-size: 1rem;
  }

  .back-link:hover {
    text-decoration: underline;
  }
}

/* to hide feature image from markdown files (when img is the first content) */
.review-section:deep() div p:first-of-type:has(img) {
  display: none;
}

</style>