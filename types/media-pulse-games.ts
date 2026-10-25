export type GameStatus = 'PLAYING' | 'BACKLOG' | 'COMPLETED' | 'ABANDONED'

export type GameCard = {
  gameId: number
  title: string
  originalTitle: string
  slug: string | null
  year: number | null
  coverUrl: string | null
  sessionCount: number
  latestSessionAt: string | null
  currentStatus: GameStatus | null
}

export type GamesLibraryResponse = { items: GameCard[]; nextCursor: string | null }
export type GamesStatsResponse = {
  totalGamesCount: number
  sessionsCount: number
  backlogCount: number
  activeCount: number
  completedCount: number
  abandonedCount: number
  latestSessionAt: string | null
}
export type GameDetails = {
  gameId: number
  title: string
  originalTitle: string
  slug: string | null
  year: number | null
  description: string | null
  coverUrl: string | null
  images: Array<{ id: number; url: string; kind: string; isPrimary: boolean }>
  sessions: Array<{ sessionId: number; status: GameStatus; startedAt: string; endedAt: string | null; notes: string | null }>
  externalIds: Array<{ provider: string; externalId: string }>
  rating: { rating: number; updatedAt: string } | null
  comments: Array<{ id: number; body: string; commentedAt: string; edited: boolean }>
}

const statusLabels: Record<GameStatus, string> = {
  PLAYING: 'Jogando', BACKLOG: 'Na fila', COMPLETED: 'Concluído', ABANDONED: 'Abandonado'
}

export const gameStatusLabel = (status?: GameStatus | null) => status ? statusLabels[status] : 'Sem sessões'
