export type MediaPulseAuthor = {
  id: number
  name: string
}

export type MediaPulseBookGroup = {
  id: number
  name: string
  itemCount: number
  description?: string | null
  authors?: MediaPulseAuthor[]
  coverUrls?: string[]
  hardcoverId?: number | null
}

export type MediaPulseBookGroupMember = {
  id: number
  name: string
  position: number
  slug?: string | null
  coverUrl?: string | null
}

export type MediaPulseBookSeriesDetails = MediaPulseBookGroup & {
  items: MediaPulseBookGroupMember[]
  universes?: MediaPulseBookGroup[]
}

export type MediaPulseBookCard = {
  bookId: number
  slug: string
  title: string
  coverUrl?: string | null
  releaseDate?: string | null
  rating?: number | null
  reviewedAt?: string | null
  authors: MediaPulseAuthor[]
}

export type MediaPulseEditionCard = {
  id?: number
  editionId?: number
  title?: string | null
  coverUrl?: string | null
  isbn13?: string | null
  isbn10?: string | null
  publisher?: string | null
  pages?: number | null
  language?: string | null
  format?: string | null
  editionInformation?: string | null
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
  edition: MediaPulseEditionCard | null
}

export type MediaPulseYearStats = {
  finishedCount: number
  currentlyReadingCount: number
  wantCount: number
  didNotFinishCount?: number
  pausedCount?: number
  pagesFinished?: number
}

export type MediaPulseYearReadsResponse = {
  year: number
  range?: { start: string; end: string }
  currentlyReading: MediaPulseReadCard[]
  finished: MediaPulseReadCard[]
  didNotFinish: MediaPulseReadCard[]
  paused?: MediaPulseReadCard[]
  unknown?: MediaPulseReadCard[]
  wantToRead: MediaPulseReadCard[]
  stats: MediaPulseYearStats
}

export type MediaPulseEdition = {
  id: number
  title: string
  editionInformation?: string | null
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
    editionInformation?: string | null
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
  comments?: Array<{ id: number; body: string; commentedAt: string; edited: boolean }>
}
