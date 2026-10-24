<script setup lang="ts">
type ApiPage<T> = { items: T[] }
type BookRead = {
  book: { slug: string; title: string; coverUrl?: string | null }
  edition?: { coverUrl?: string | null } | null
}
type Movie = { slug?: string | null; title: string; year?: number | null; coverUrl?: string | null }
type Show = { slug?: string | null; title: string; year?: number | null; coverUrl?: string | null }
type Album = { albumTitle: string; artistName: string; coverUrl?: string | null }

const year = new Date().getFullYear()
const { apiUrl, assetUrl } = useMediaPulseApi()
const { data } = await useAsyncData('media-pulse-sidebar', async () => {
  const [books, movies, shows, albums] = await Promise.all([
    $fetch<ApiPage<BookRead>>(apiUrl('/api/books/list?status=CURRENTLY_READING&limit=1')).catch(() => ({ items: [] })),
    $fetch<ApiPage<Movie>>(apiUrl('/api/movies/recent?limit=1')).catch(() => ({ items: [] })),
    $fetch<Show[]>(apiUrl('/api/shows/currently-watching?limit=1')).catch(() => []),
    $fetch<ApiPage<Album>>(apiUrl('/api/music/recent-albums?limit=1')).catch(() => ({ items: [] }))
  ])

  return {
    book: books.items[0],
    movie: movies.items[0],
    show: shows[0],
    album: albums.items[0]
  }
}, { server: false })

const records = computed(() => {
  const items = []
  if (data.value?.book) items.push({
    label: 'Lendo', title: data.value.book.book.title,
    image: data.value.book.edition?.coverUrl || data.value.book.book.coverUrl,
    href: `/livros/${data.value.book.book.slug}`
  })
  if (data.value?.movie) items.push({
    label: 'Filme recente', title: data.value.movie.title,
    image: data.value.movie.coverUrl,
    href: data.value.movie.slug ? `/filmes/detalhe/${data.value.movie.slug}` : `/filmes/${year}`
  })
  if (data.value?.show) items.push({
    label: 'Assistindo', title: data.value.show.title,
    image: data.value.show.coverUrl,
    href: data.value.show.slug ? `/series/detalhe/${data.value.show.slug}` : '/series'
  })
  if (data.value?.album) items.push({
    label: 'Ouvindo', title: data.value.album.albumTitle,
    detail: data.value.album.artistName,
    image: data.value.album.coverUrl,
    href: '/musicas'
  })
  return items
})
</script>

<template>
  <section v-if="records.length" class="pulse-rail" aria-labelledby="pulse-rail-title">
    <span class="rail-label" id="pulse-rail-title">Por aqui agora</span>
    <NuxtLink v-for="record in records" :key="record.label" :to="record.href" class="pulse-record">
      <img v-if="record.image" :src="assetUrl(record.image)" alt="" loading="lazy" />
      <span v-else class="pulse-record__placeholder" aria-hidden="true">✳</span>
      <span class="pulse-record__text"><span class="pulse-record__label">{{ record.label }}</span><strong>{{ record.title }}</strong><small v-if="record.detail">{{ record.detail }}</small></span>
    </NuxtLink>
  </section>
</template>
