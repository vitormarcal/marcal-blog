import storiesJson from '~/data/stories.json'
import type { StoryItem } from '~/types/story'
import { isStoryCatalog } from '~/types/story'

const parsedStories = isStoryCatalog(storiesJson) ? storiesJson : []

export const useStoriesCatalog = () => {
  const stories = parsedStories as StoryItem[]

  const getBySlug = (slug: string) => {
    return stories.find((story) => story.slug === slug) || null
  }

  return {
    stories,
    getBySlug
  }
}

