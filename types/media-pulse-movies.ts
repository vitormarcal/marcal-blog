export type MediaPulseMovieCard = {
  movieId: number
  title: string
  originalTitle: string
  slug?: string | null
  year?: number | null
  coverUrl?: string | null
  watchedAt?: string | null
}

export type MediaPulseMoviesSummaryResponse = {
  range: {
    start: string
    end: string
  }
  watchesCount: number
  uniqueMoviesCount: number
}

export type MediaPulseMovieImage = {
  id: number
  url: string
  isPrimary: boolean
}

export type MediaPulseMovieWatch = {
  watchId: number
  watchedAt: string
  source: string
}

export type MediaPulseMovieExternalId = {
  provider: string
  externalId: string
}

export type MediaPulseMovieDetailsResponse = {
  movieId: number
  title: string
  originalTitle: string
  slug?: string | null
  year?: number | null
  description?: string | null
  coverUrl?: string | null
  images: MediaPulseMovieImage[]
  watches: MediaPulseMovieWatch[]
  externalIds: MediaPulseMovieExternalId[]
}
