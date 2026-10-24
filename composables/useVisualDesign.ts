export const useVisualDesign = () => {
  const route = useRoute()
  const selectedMinimalistaEscuro = () => route.path.replace(/\/+$/, '') === '/design/minimalista-escuro' || route.query.design === 'minimalista-escuro'
  // Static HTML has no query string. Hydrate the design captured in its payload,
  // then apply the visitor's query selection to avoid mismatched markup.
  const initialMinimalistaEscuro = useState('initial-visual-design', selectedMinimalistaEscuro)
  const hydrated = useState('visual-design-hydrated', () => false)
  onMounted(() => { hydrated.value = true })
  const isMinimalistaEscuro = computed(() => import.meta.client && !hydrated.value ? initialMinimalistaEscuro.value : selectedMinimalistaEscuro())
  return { isMinimalistaEscuro }
}
