export type MediaPulseShowCard = {
  showId: number
  title: string
  originalTitle: string
  slug?: string | null
  year?: number | null
  coverUrl?: string | null
  watchedAt?: string | null
}

export type MediaPulseShowsSummaryResponse = {
  range: {
    start: string
    end: string
  }
  watchesCount: number
  uniqueShowsCount: number
}

export type MediaPulseShowImage = {
  id: number
  url: string
  isPrimary: boolean
}

export type MediaPulseShowWatch = {
  watchId: number
  episodeId: number
  episodeTitle: string
  seasonNumber?: number | null
  seasonTitle?: string | null
  episodeNumber?: number | null
  watchedAt: string
  source: string
}

export type MediaPulseShowSeason = {
  seasonNumber?: number | null
  seasonTitle?: string | null
  episodesCount: number
  watchedEpisodesCount: number
  completed: boolean
  lastWatchedAt?: string | null
}

export type MediaPulseShowProgress = {
  episodesCount: number
  watchedEpisodesCount: number
  seasonsCount: number
  completedSeasonsCount: number
  completed: boolean
  inProgress: boolean
}

export type MediaPulseCurrentlyWatchingShowCard = {
  showId: number
  slug?: string | null
  title: string
  originalTitle: string
  year?: number | null
  coverUrl?: string | null
  lastWatchedAt: string
  progress?: MediaPulseShowProgress | null
}

export type MediaPulseShowExternalId = {
  provider: string
  externalId: string
}

export type MediaPulseShowDetailsResponse = {
  showId: number
  title: string
  originalTitle: string
  slug?: string | null
  year?: number | null
  description?: string | null
  coverUrl?: string | null
  images: MediaPulseShowImage[]
  seasons: MediaPulseShowSeason[]
  progress?: MediaPulseShowProgress | null
  watches: MediaPulseShowWatch[]
  externalIds: MediaPulseShowExternalId[]
}

export type MediaPulseYearShowStats = {
  watchesCount: number
  uniqueShowsCount: number
  rewatchesCount: number
}

export type MediaPulseYearShowWatchedCard = {
  showId: number
  slug?: string | null
  title: string
  originalTitle: string
  year?: number | null
  coverUrl?: string | null
  watchCountInYear: number
  firstWatchedAt: string
  lastWatchedAt: string
}

export type MediaPulseYearShowUnwatchedCard = {
  showId: number
  slug?: string | null
  title: string
  originalTitle: string
  year?: number | null
  coverUrl?: string | null
}

export type MediaPulseYearShowsResponse = {
  year: number
  range: {
    start: string
    end: string
  }
  stats: MediaPulseYearShowStats
  watched: MediaPulseYearShowWatchedCard[]
  unwatched: MediaPulseYearShowUnwatchedCard[]
}

export type MediaPulseShowsTotalStats = {
  watchesCount: number
  uniqueShowsCount: number
}

export type MediaPulseShowsYearStats = {
  year: number
  watchesCount: number
  uniqueShowsCount: number
  rewatchesCount: number
}

export type MediaPulseShowsStatsResponse = {
  total: MediaPulseShowsTotalStats
  unwatchedCount: number
  years: MediaPulseShowsYearStats[]
  latestWatchAt?: string | null
  firstWatchAt?: string | null
}
