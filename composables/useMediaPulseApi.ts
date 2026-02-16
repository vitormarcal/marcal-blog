const ABSOLUTE_URL = /^https?:\/\//i

const normalizePath = (path: string) => {
  if (!path.startsWith('/')) return `/${path}`
  return path
}

export const useMediaPulseApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = (config.public.mediaPulseBaseUrl || 'http://localhost:8080').replace(/\/$/, '')

  const apiUrl = (path: string) => `${baseUrl}${normalizePath(path)}`

  const assetUrl = (path?: string | null) => {
    if (!path) return ''
    if (ABSOLUTE_URL.test(path)) return path
    return `${baseUrl}${normalizePath(path)}`
  }

  return {
    apiUrl,
    assetUrl,
    baseUrl
  }
}
