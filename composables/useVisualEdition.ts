export const useVisualEdition = () => {
  const route = useRoute()
  const selectedOriginal = () => route.path.replace(/\/+$/, '') === '/arquivo/original' || route.query.edicao === 'original'
  // Static HTML has no query string. Hydrate the edition captured in its payload,
  // then apply the visitor's query selection to avoid mismatched markup.
  const initialOriginal = useState('initial-visual-edition', selectedOriginal)
  const hydrated = useState('visual-edition-hydrated', () => false)
  onMounted(() => { hydrated.value = true })
  const isOriginal = computed(() => import.meta.client && !hydrated.value ? initialOriginal.value : selectedOriginal())
  return { isOriginal }
}
