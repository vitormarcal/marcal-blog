export type MediaPulseArtworkArtist = {
  id: number
  name: string
  biography?: string | null
  countryOfOrigin?: string | null
  bornAt?: string | null
  diedAt?: string | null
  portraitUrl?: string | null
}

export type MediaPulseArtworkCard = {
  id: number
  title: string
  artist?: MediaPulseArtworkArtist | null
  year?: number | null
  type?: string | null
  movements: string[]
  favorite: boolean
  imageUrl?: string | null
}

export type MediaPulseArtworkLibrary = {
  items: MediaPulseArtworkCard[]
  nextPage?: number | null
}

export type MediaPulseArtworkExperience = {
  id: number
  experiencedAt?: string | null
  experienceType?: string | null
  notes?: string | null
  sourceName?: string | null
  sourceUrl?: string | null
}

export type MediaPulseArtworkImage = {
  id: number
  url: string
  caption?: string | null
  primary: boolean
}

export type MediaPulseArtworkDetails = {
  artwork: MediaPulseArtworkCard & {
    technique?: string | null
    description?: string | null
  }
  artist?: MediaPulseArtworkArtist | null
  experiences: MediaPulseArtworkExperience[]
  images: MediaPulseArtworkImage[]
  lists: Array<{ id: number; name: string; description?: string | null }>
  rating?: { rating: number; updatedAt?: string | null } | null
}
