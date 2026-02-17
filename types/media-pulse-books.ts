export type MediaPulseAuthor = {
  id: number
  name: string
}

export type MediaPulseBookCard = {
  bookId: number
  slug: string
  title: string
  coverUrl?: string | null
  authors: MediaPulseAuthor[]
}

export type MediaPulseEditionCard = {
  editionId: number
  title: string
  coverUrl?: string | null
  isbn13?: string | null
  publisher?: string | null
  pages?: number | null
  format?: string | null
}

export type MediaPulseReadCard = {
  readId: number
  status: string
  startedAt?: string | null
  finishedAt?: string | null
  progressPct?: number | null
  progressPages?: number | null
  source?: string | null
  book: MediaPulseBookCard
  edition: MediaPulseEditionCard
}

export type MediaPulseYearStats = {
  finishedCount: number
  currentlyReadingCount: number
  wantCount: number
}

export type MediaPulseYearReadsResponse = {
  year: number
  currentlyReading: MediaPulseReadCard[]
  finished: MediaPulseReadCard[]
  didNotFinish: MediaPulseReadCard[]
  wantToRead: MediaPulseReadCard[]
  stats: MediaPulseYearStats
}

export type MediaPulseEdition = {
  id: number
  title: string
  isbn10?: string | null
  isbn13?: string | null
  pages?: number | null
  language?: string | null
  publisher?: string | null
  format?: string | null
  coverUrl?: string | null
}

export type MediaPulseRead = {
  readId: number
  status: string
  startedAt?: string | null
  finishedAt?: string | null
  progressPct?: number | null
  progressPages?: number | null
  source?: string | null
  book?: {
    bookId: number
    slug: string
    title: string
  } | null
  edition?: {
    id: number
    title: string
    coverUrl?: string | null
  } | null
}

export type MediaPulseBookDetailsResponse = {
  bookId: number
  slug: string
  title: string
  description?: string | null
  coverUrl?: string | null
  releaseDate?: string | null
  rating?: number | null
  reviewRaw?: string | null
  reviewedAt?: string | null
  authors: MediaPulseAuthor[]
  editions: MediaPulseEdition[]
  reads: MediaPulseRead[]
}
