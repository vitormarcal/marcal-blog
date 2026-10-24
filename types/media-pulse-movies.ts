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
  favorite?: boolean
  abandoned?: boolean
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
  lists?: Array<{ listId: number; name: string; slug: string; description?: string | null }>
  companies?: Array<{ companyId: number; name: string; slug: string; logoUrl?: string | null; originCountry?: string | null; companyType: string }>
  people?: Array<{ personId: number; name: string; slug: string; profileUrl?: string | null; creditType: string; department?: string | null; job?: string | null; characterName?: string | null; billingOrder?: number | null }>
  creditsCurated?: boolean
  terms?: Array<{ id: number; name: string; slug: string; kind: string; active: boolean }>
  collection?: { id: number; name: string; posterUrl?: string | null; backdropUrl?: string | null; movies: Array<{ movieId: number; title: string; slug?: string | null; year?: number | null; coverUrl?: string | null; watched: boolean; current: boolean }> } | null
  rating?: { rating: number; updatedAt: string } | null
  comments?: Array<{ id: number; body: string; commentedAt: string; edited: boolean }>
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
