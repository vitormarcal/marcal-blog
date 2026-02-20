export interface StorySlide {
  image: string
  strong: string
  text: string
}

export interface StoryItem {
  slug: string
  title: string
  subtitle?: string
  cover: string
  layout?: 'slide-layout' | 'default'
  sourcePost?: {
    title: string
    url: string
  }
  slides: StorySlide[]
}

const isSourcePost = (value: unknown) => {
  if (value == null) return true
  const item = value as { title?: unknown, url?: unknown }
  return typeof item.title === 'string' && typeof item.url === 'string'
}

const isStorySlide = (value: unknown): value is StorySlide => {
  const item = value as Partial<StorySlide> | null
  return Boolean(
    item &&
    typeof item.image === 'string' &&
    typeof item.strong === 'string' &&
    typeof item.text === 'string'
  )
}

const isStoryItem = (value: unknown): value is StoryItem => {
  const item = value as Partial<StoryItem> | null
  return Boolean(
    item &&
    typeof item.slug === 'string' &&
    typeof item.title === 'string' &&
    typeof item.cover === 'string' &&
    isSourcePost(item.sourcePost) &&
    Array.isArray(item.slides) &&
    item.slides.every(isStorySlide)
  )
}

export const isStoryCatalog = (value: unknown): value is StoryItem[] => {
  return Array.isArray(value) && value.every(isStoryItem)
}
