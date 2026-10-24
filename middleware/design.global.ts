// Keep a selected visual design while following internal links.
export default defineNuxtRouteMiddleware((to, from) => {
  const designs = ['minimalista-escuro', 'fanzine-pessoal']
  if (to.path.startsWith('/design/')) return
  const previous = from.path.replace(/\/+$/, '') === '/design/minimalista-escuro' ? 'minimalista-escuro'
    : from.path.replace(/\/+$/, '') === '/design/fanzine-pessoal' ? 'fanzine-pessoal' : from.query.design
  if (!to.query.design && typeof previous === 'string' && designs.includes(previous)) {
    return navigateTo({ path: to.path, query: { ...to.query, design: previous }, hash: to.hash }, { replace: true })
  }
})
