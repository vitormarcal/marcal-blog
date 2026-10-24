// Keep an explicitly selected edition while following internal links.
export default defineNuxtRouteMiddleware((to, from) => {
  const editions = ['original', 'revista-2026']
  if (to.path.startsWith('/arquivo/')) return
  const previous = from.path.replace(/\/+$/, '') === '/arquivo/original' ? 'original'
    : from.path.replace(/\/+$/, '') === '/arquivo/revista-2026' ? 'revista-2026' : from.query.edicao
  if (!to.query.edicao && typeof previous === 'string' && editions.includes(previous)) {
    return navigateTo({ path: to.path, query: { ...to.query, edicao: previous }, hash: to.hash }, { replace: true })
  }
})
