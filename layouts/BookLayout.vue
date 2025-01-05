<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'pt-BR',
    class: 'book-tracker'
  },
  bodyAttrs: {
    class: 'book-tracker'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.ico'
    }
  ]
})

</script>

<template>
  <main>
    <header>
      <h1>marcal's Book Tracker</h1>
      <p class="quote">"Os livros são sonhos que seguramos em nossas mãos."</p>
      <img src="https://via.placeholder.com/60x60" alt="Ícone de livro" class="floating-book">
    </header>
    <slot />
  </main>
</template>

<style>

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

body.book-tracker {
  --blockquote-border-color: #6c4a4a;
  --blockquote-padding-left: 0;


  font-family: 'Merriweather', serif;
  margin: 0;
  padding: 0;
  background-color: #f7f3e9;
  color: #333;

  header {
    background-color: #6c4a4a;
    color: #fff;
    padding: 40px 10px;
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    position: relative;
    overflow: hidden;
  }

  header {
    background-color: #6c4a4a;
    color: #fff;
    padding: 40px 10px;
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    position: relative;
    overflow: hidden;
  }
  header h1 {
    animation: fadeIn 1s ease-in-out;
  }
  header .quote {
    margin-top: 20px;
    font-size: 1.2rem;
    font-style: italic;
    animation: fadeIn 2s ease-in-out;
  }
  header .floating-book {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 60px;
    animation: bounce 2s infinite;
  }

  .book-tracker-container {
    max-width: 1000px;
    margin: 30px auto;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }

}


</style>