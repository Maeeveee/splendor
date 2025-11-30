export const GEM_COLORS = ["white", "blue", "green", "red", "black"] as const
export type GemColor = (typeof GEM_COLORS)[number]

export interface DevelopmentCard {
  id: number
  cost: Record<GemColor, number>
  provides: GemColor
  points: number
}

export interface Noble {
  id: number
  requirements: Record<GemColor, number>
  points: number
}

export interface Player {
  id: number
  name: string
  isBot: boolean
  gems: Record<GemColor | "gold", number>
  cards: DevelopmentCard[]
  reservedCards: DevelopmentCard[]
  nobles: Noble[]
  points: number
}

export interface GameState {
  currentPlayer: number
  players: Player[]
  gems: Record<GemColor | "gold", number>
  availableCards: {
    tier1: (DevelopmentCard | null)[]
    tier2: (DevelopmentCard | null)[]
    tier3: (DevelopmentCard | null)[]
  }
  decks: {
    tier1: DevelopmentCard[]
    tier2: DevelopmentCard[]
    tier3: DevelopmentCard[]
  }
  availableNobles: Noble[]
  gameMode: "menu" | "pvp" | "pve"
  winner: number | null
  botThinking: boolean
  lastBotAction: string | null
  selectedGems: Record<GemColor, number>
  botThinkingStage: string
  animatingCard: number | null
  gameStartTime: number
  turnCount: number
}

export interface GameHistory {
  id: string
  timestamp: number
  gameMode: "pvp" | "pve"
  players: {
    name: string
    isBot: boolean
    finalPoints: number
    finalCards: number
    finalNobles: number
  }[]
  winner: {
    id: number
    name: string
    points: number
  }
  duration: number
  totalTurns: number
}
