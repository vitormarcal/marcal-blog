<script setup lang="ts">
definePageMeta({
  layout: 'book-layout'
})

const posts = await queryContent()
    .where({tags: {$contains: 'livros'}, _partial: false})
    .sort({created_at: -1})
    .without(['body'])
    .find()

</script>

<template>

  <div class="book-tracker-container">
    <h2>Últimos Livros Lidos</h2>
    <ul class="book-list">
      <li v-for="post in posts">
        <img :src="post.image" alt="Capa do livro">
        <div class="book-info">
          <h2>{{post.title}}</h2>
          <p>Autor(es): {{ post.author }}</p>
        </div>
        <a :href="'/books' + post._path" class="details-link">Ver detalhes</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.book-tracker-container {
  .book-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .book-list li {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }
  .book-list img {
    width: 50px;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .book-info {
    flex: 1;
  }
  .book-info h2 {
    margin: 0 0 5px;
    font-size: 1.2em;
  }
  .book-info p {
    margin: 0;
    color: #666;
    font-size: 0.9em;
  }
  .details-link {
    text-decoration: none;
    color: #007BFF;
  }
  .details-link:hover {
    text-decoration: underline;
  }
}



</style>