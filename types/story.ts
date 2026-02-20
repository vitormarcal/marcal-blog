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
  slides: StorySlide[]
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
    Array.isArray(item.slides) &&
    item.slides.every(isStorySlide)
  )
}

export const isStoryCatalog = (value: unknown): value is StoryItem[] => {
  return Array.isArray(value) && value.every(isStoryItem)
}

