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

export type MediaPulseYearMovieStats = {
  watchesCount: number
  uniqueMoviesCount: number
  rewatchesCount: number
}

export type MediaPulseYearMovieWatchedCard = {
  movieId: number
  slug?: string | null
  title: string
  originalTitle: string
  year?: number | null
  coverUrl?: string | null
  watchCountInYear: number
  firstWatchedAt: string
  lastWatchedAt: string
}

export type MediaPulseYearMovieUnwatchedCard = {
  movieId: number
  slug?: string | null
  title: string
  originalTitle: string
  year?: number | null
  coverUrl?: string | null
}

export type MediaPulseYearMoviesResponse = {
  year: number
  range: {
    start: string
    end: string
  }
  stats: MediaPulseYearMovieStats
  watched: MediaPulseYearMovieWatchedCard[]
  unwatched: MediaPulseYearMovieUnwatchedCard[]
}

export type MediaPulseMoviesTotalStats = {
  watchesCount: number
  uniqueMoviesCount: number
}

export type MediaPulseMoviesYearStats = {
  year: number
  watchesCount: number
  uniqueMoviesCount: number
  rewatchesCount: number
}

export type MediaPulseMoviesStatsResponse = {
  total: MediaPulseMoviesTotalStats
  unwatchedCount: number
  years: MediaPulseMoviesYearStats[]
  latestWatchAt?: string | null
  firstWatchAt?: string | null
}
