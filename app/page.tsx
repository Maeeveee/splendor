"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Gem, User, Bot, Trophy, Eye, Plus, Minus, Diamond, Coins, Star, Brain } from "lucide-react"

// Game data (keep the same DEVELOPMENT_CARDS and NOBLES data)
const DEVELOPMENT_CARDS = {
  tier1: [
    { id: 1, cost: { white: 0, blue: 1, green: 1, red: 1, black: 1 }, provides: "white", points: 0 },
    { id: 2, cost: { white: 0, blue: 1, green: 2, red: 1, black: 1 }, provides: "white", points: 0 },
    { id: 3, cost: { white: 0, blue: 2, green: 2, red: 0, black: 1 }, provides: "white", points: 0 },
    { id: 4, cost: { white: 0, blue: 0, green: 3, red: 1, black: 1 }, provides: "white", points: 0 },
    { id: 5, cost: { white: 1, blue: 0, green: 1, red: 1, black: 1 }, provides: "blue", points: 0 },
    { id: 6, cost: { white: 1, blue: 0, green: 1, red: 2, black: 1 }, provides: "blue", points: 0 },
    { id: 7, cost: { white: 1, blue: 0, green: 2, red: 2, black: 0 }, provides: "blue", points: 0 },
    { id: 8, cost: { white: 1, blue: 0, green: 0, red: 1, black: 3 }, provides: "blue", points: 0 },
    { id: 9, cost: { white: 1, blue: 1, green: 0, red: 1, black: 1 }, provides: "green", points: 0 },
    { id: 10, cost: { white: 1, blue: 1, green: 0, red: 1, black: 2 }, provides: "green", points: 0 },
    { id: 11, cost: { white: 0, blue: 2, green: 0, red: 2, black: 1 }, provides: "green", points: 0 },
    { id: 12, cost: { white: 3, blue: 1, green: 0, red: 0, black: 1 }, provides: "green", points: 0 },
    { id: 13, cost: { white: 1, blue: 1, green: 1, red: 0, black: 1 }, provides: "red", points: 0 },
    { id: 14, cost: { white: 2, blue: 1, green: 1, red: 0, black: 1 }, provides: "red", points: 0 },
    { id: 15, cost: { white: 2, blue: 0, green: 1, red: 0, black: 2 }, provides: "red", points: 0 },
    { id: 16, cost: { white: 1, blue: 3, green: 1, red: 0, black: 0 }, provides: "red", points: 0 },
    { id: 17, cost: { white: 1, blue: 1, green: 1, red: 1, black: 0 }, provides: "black", points: 0 },
    { id: 18, cost: { white: 1, blue: 2, green: 1, red: 1, black: 0 }, provides: "black", points: 0 },
    { id: 19, cost: { white: 2, blue: 2, green: 0, red: 1, black: 0 }, provides: "black", points: 0 },
    { id: 20, cost: { white: 0, blue: 0, green: 1, red: 3, black: 1 }, provides: "black", points: 0 },
  ],
  tier2: [
    { id: 21, cost: { white: 3, blue: 2, green: 2, red: 0, black: 0 }, provides: "white", points: 1 },
    { id: 22, cost: { white: 0, blue: 1, green: 4, red: 2, black: 0 }, provides: "white", points: 2 },
    { id: 23, cost: { white: 1, blue: 4, green: 2, red: 0, black: 0 }, provides: "white", points: 2 },
    { id: 24, cost: { white: 0, blue: 0, green: 5, red: 3, black: 0 }, provides: "white", points: 2 },
    { id: 25, cost: { white: 5, blue: 3, green: 0, red: 0, black: 0 }, provides: "white", points: 2 },
    { id: 26, cost: { white: 0, blue: 2, green: 2, red: 3, black: 0 }, provides: "blue", points: 1 },
    { id: 27, cost: { white: 0, blue: 2, green: 1, red: 4, black: 0 }, provides: "blue", points: 2 },
    { id: 28, cost: { white: 0, blue: 0, green: 1, red: 4, black: 2 }, provides: "blue", points: 2 },
    { id: 29, cost: { white: 0, blue: 0, green: 3, red: 5, black: 0 }, provides: "blue", points: 2 },
    { id: 30, cost: { white: 3, blue: 0, green: 0, red: 0, black: 5 }, provides: "blue", points: 2 },
    { id: 31, cost: { white: 0, blue: 3, green: 0, red: 2, black: 2 }, provides: "green", points: 1 },
    { id: 32, cost: { white: 4, blue: 2, green: 0, red: 0, black: 1 }, provides: "green", points: 2 },
    { id: 33, cost: { white: 4, blue: 2, green: 0, red: 1, black: 0 }, provides: "green", points: 2 },
    { id: 34, cost: { white: 5, blue: 3, green: 0, red: 0, black: 0 }, provides: "green", points: 2 },
    { id: 35, cost: { white: 0, blue: 5, green: 0, red: 0, black: 3 }, provides: "green", points: 2 },
    { id: 36, cost: { white: 2, blue: 0, green: 0, red: 2, black: 3 }, provides: "red", points: 1 },
    { id: 37, cost: { white: 1, blue: 0, green: 0, red: 2, black: 4 }, provides: "red", points: 2 },
    { id: 38, cost: { white: 2, blue: 0, green: 1, red: 0, black: 4 }, provides: "red", points: 2 },
    { id: 39, cost: { white: 3, blue: 0, green: 0, red: 0, black: 5 }, provides: "red", points: 2 },
    { id: 40, cost: { white: 0, blue: 0, green: 0, red: 5, black: 3 }, provides: "red", points: 2 },
    { id: 41, cost: { white: 0, blue: 0, green: 3, red: 2, black: 2 }, provides: "black", points: 1 },
    { id: 42, cost: { white: 0, blue: 1, green: 2, red: 0, black: 4 }, provides: "black", points: 2 },
    { id: 43, cost: { white: 2, blue: 0, green: 0, red: 1, black: 4 }, provides: "black", points: 2 },
    { id: 44, cost: { white: 5, blue: 0, green: 0, red: 0, black: 3 }, provides: "black", points: 2 },
    { id: 45, cost: { white: 0, blue: 0, green: 0, red: 3, black: 5 }, provides: "black", points: 2 },
  ],
  tier3: [
    { id: 46, cost: { white: 3, blue: 3, green: 5, red: 3, black: 0 }, provides: "white", points: 3 },
    { id: 47, cost: { white: 7, blue: 0, green: 0, red: 0, black: 0 }, provides: "white", points: 4 },
    { id: 48, cost: { white: 6, blue: 3, green: 0, red: 0, black: 3 }, provides: "white", points: 4 },
    { id: 49, cost: { white: 7, blue: 3, green: 0, red: 0, black: 0 }, provides: "white", points: 5 },
    { id: 50, cost: { white: 0, blue: 3, green: 3, red: 5, black: 3 }, provides: "blue", points: 3 },
    { id: 51, cost: { white: 0, blue: 7, green: 0, red: 0, black: 0 }, provides: "blue", points: 4 },
    { id: 52, cost: { white: 3, blue: 6, green: 0, red: 0, black: 3 }, provides: "blue", points: 4 },
    { id: 53, cost: { white: 0, blue: 7, green: 3, red: 0, black: 0 }, provides: "blue", points: 5 },
    { id: 54, cost: { white: 3, blue: 0, green: 3, red: 3, black: 5 }, provides: "green", points: 3 },
    { id: 55, cost: { white: 0, blue: 0, green: 7, red: 0, black: 0 }, provides: "green", points: 4 },
    { id: 56, cost: { white: 3, blue: 0, green: 6, red: 3, black: 0 }, provides: "green", points: 4 },
    { id: 57, cost: { white: 0, blue: 0, green: 7, red: 3, black: 0 }, provides: "green", points: 5 },
    { id: 58, cost: { white: 5, blue: 3, green: 0, red: 3, black: 3 }, provides: "red", points: 3 },
    { id: 59, cost: { white: 0, blue: 0, green: 0, red: 7, black: 0 }, provides: "red", points: 4 },
    { id: 60, cost: { white: 0, blue: 3, green: 0, red: 6, black: 3 }, provides: "red", points: 4 },
    { id: 61, cost: { white: 0, blue: 0, green: 0, red: 7, black: 3 }, provides: "red", points: 5 },
    { id: 62, cost: { white: 3, blue: 5, green: 3, red: 0, black: 3 }, provides: "black", points: 3 },
    { id: 63, cost: { white: 0, blue: 0, green: 0, red: 0, black: 7 }, provides: "black", points: 4 },
    { id: 64, cost: { white: 0, blue: 0, green: 3, red: 3, black: 6 }, provides: "black", points: 4 },
    { id: 65, cost: { white: 3, blue: 0, green: 0, red: 0, black: 7 }, provides: "black", points: 5 },
  ],
}

const NOBLES = [
  { id: 1, requirements: { white: 3, blue: 3, green: 3, red: 0, black: 0 }, points: 3 },
  { id: 2, requirements: { white: 0, blue: 3, green: 3, red: 3, black: 0 }, points: 3 },
  { id: 3, requirements: { white: 0, blue: 0, green: 3, red: 3, black: 3 }, points: 3 },
  { id: 4, requirements: { white: 3, blue: 0, green: 0, red: 3, black: 3 }, points: 3 },
  { id: 5, requirements: { white: 3, blue: 3, green: 0, red: 0, black: 3 }, points: 3 },
  { id: 6, requirements: { white: 0, blue: 4, green: 4, red: 0, black: 0 }, points: 3 },
  { id: 7, requirements: { white: 0, blue: 0, green: 4, red: 4, black: 0 }, points: 3 },
  { id: 8, requirements: { white: 0, blue: 0, green: 0, red: 4, black: 4 }, points: 3 },
  { id: 9, requirements: { white: 4, blue: 0, green: 0, red: 0, black: 4 }, points: 3 },
  { id: 10, requirements: { white: 4, blue: 4, green: 0, red: 0, black: 0 }, points: 3 },
]

const GEM_COLORS = ["white", "blue", "green", "red", "black"] as const
type GemColor = (typeof GEM_COLORS)[number]

interface GameState {
  currentPlayer: number
  players: Player[]
  gems: Record<GemColor | "gold", number>
  availableCards: {
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
}

interface Player {
  id: number
  name: string
  isBot: boolean
  gems: Record<GemColor | "gold", number>
  cards: DevelopmentCard[]
  reservedCards: DevelopmentCard[]
  nobles: Noble[]
  points: number
}

interface DevelopmentCard {
  id: number
  cost: Record<GemColor, number>
  provides: GemColor
  points: number
}

interface Noble {
  id: number
  requirements: Record<GemColor, number>
  points: number
}

// Helper functions and components moved outside SplendorGame
const getGemColor = (color: GemColor | "gold") => {
  const colors = {
    white: "bg-gray-100 border-gray-400 text-gray-800",
    blue: "bg-blue-500 border-blue-600 text-white",
    green: "bg-green-500 border-green-600 text-white",
    red: "bg-red-500 border-red-600 text-white",
    black: "bg-gray-800 border-gray-900 text-white",
    gold: "bg-yellow-400 border-yellow-500 text-black",
  }
  return colors[color]
}

const getGemIcon = (color: GemColor | "gold") => {
  const icons = {
    white: Diamond,
    blue: Gem,
    green: Gem,
    red: Gem,
    black: Gem,
    gold: Coins,
  }
  const IconComponent = icons[color]
  return <IconComponent className="w-3 h-3" />
}

const GemToken = ({
  color,
  count,
  size = "normal",
}: { color: GemColor | "gold"; count: number; size?: "small" | "normal" | "large" }) => {
  const sizeClasses = {
    small: "w-5 h-5 text-xs",
    normal: "w-8 h-8 text-sm",
    large: "w-10 h-10 text-base",
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-2 ${getGemColor(color)} flex items-center justify-center font-bold shadow-md transition-all duration-300 hover:scale-110`}
    >
      {count > 0 ? count : getGemIcon(color)}
    </div>
  )
}

const DevelopmentCardComponent = ({
  card,
  tier, // tier is optional for reserved cards
  canBuy,
  onBuy,
  onReserve,
  showActions = true,
  animatingCardId,
  isReserved = false, // New prop to distinguish reserved cards
}: {
  card: DevelopmentCard
  tier?: keyof GameState["availableCards"] // Make tier optional
  canBuy: boolean
  onBuy: () => void
  onReserve?: () => void // Make onReserve optional for reserved cards
  showActions?: boolean
  animatingCardId: number | null
  isReserved?: boolean
}) => (
  <Card
    className={`w-32 h-44 relative bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${animatingCardId === card.id ? "animate-pulse ring-2 ring-green-400" : ""
      } ${isReserved ? "border-blue-400 border-2" : ""}`}
  >
    <CardHeader className="p-2 pb-1">
      <div className="flex justify-between items-center">
        <div
          className={`w-6 h-6 rounded-full border-2 ${getGemColor(card.provides)} flex items-center justify-center transition-all duration-300`}
        >
          {getGemIcon(card.provides)}
        </div>
        {card.points > 0 && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs px-1 py-0">
            <Star className="w-2 h-2 mr-1" />
            {card.points}
          </Badge>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-2 pt-0 pb-8">
      <div className="space-y-1">
        <div className="text-xs font-semibold text-gray-600 mb-1">Biaya:</div>
        <div className="space-y-1 max-h-20 overflow-y-auto">
          {GEM_COLORS.map(
            (color) =>
              card.cost[color] > 0 && (
                <div key={color} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full border ${getGemColor(color)} flex items-center justify-center`}>
                    {getGemIcon(color)}
                  </div>
                  <span className="text-xs font-medium">{card.cost[color]}</span>
                </div>
              ),
          )}
        </div>
      </div>
      {showActions && (
        <div className="absolute bottom-1 left-1 right-1 flex gap-1">
          <Button
            size="sm"
            className="text-xs h-6 flex-1 bg-green-600 hover:bg-green-700 transition-colors duration-200"
            disabled={!canBuy}
            onClick={onBuy}
          >
            <Diamond className="w-2 h-2 mr-1" />
            Beli
          </Button>
          {!isReserved &&
            onReserve && ( // Only show reserve button for non-reserved cards
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-6 px-1 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                onClick={onReserve}
              >
                <Eye className="w-2 h-2" />
              </Button>
            )}
        </div>
      )}
    </CardContent>
  </Card>
)

const NobleComponent = ({ noble, playerBonuses }: { noble: Noble; playerBonuses: Record<GemColor, number> }) => {
  const canVisit = GEM_COLORS.every((color) => playerBonuses[color] >= noble.requirements[color])

  return (
    <Card
      className={`w-28 h-28 relative bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg flex flex-col items-center justify-center p-2 transition-all duration-300 hover:scale-105 ${canVisit ? "ring-2 ring-yellow-400" : "opacity-70"
        }`}
    >
      <Crown className="w-6 h-6 text-purple-600 mb-1" />
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs px-1 py-0 mb-2">
        <Star className="w-2 h-2 mr-1" />
        {noble.points}
      </Badge>
      <div className="flex flex-wrap justify-center gap-1">
        {GEM_COLORS.map(
          (color) =>
            noble.requirements[color] > 0 && (
              <div key={color} className="flex items-center gap-0.5">
                <div className={`w-3 h-3 rounded-full border ${getGemColor(color)} flex items-center justify-center`}>
                  {getGemIcon(color)}
                </div>
                <span className="text-xs font-medium">{noble.requirements[color]}</span>
              </div>
            ),
        )}
      </div>
    </Card>
  )
}

const initialGameState: GameState = {
  currentPlayer: 0,
  players: [],
  gems: { white: 4, blue: 4, green: 4, red: 4, black: 4, gold: 5 }, // Persediaan permata untuk 2 pemain
  availableCards: {
    tier1: [],
    tier2: [],
    tier3: [],
  },
  availableNobles: [],
  gameMode: "menu",
  winner: null,
  botThinking: false,
  lastBotAction: null,
  selectedGems: { white: 0, blue: 0, green: 0, red: 0, black: 0 },
  botThinkingStage: "",
  animatingCard: null,
}

export default function SplendorGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const initializeGame = (mode: "pvp" | "pve") => {
    const shuffledTier1 = shuffleArray(DEVELOPMENT_CARDS.tier1)
    const shuffledTier2 = shuffleArray(DEVELOPMENT_CARDS.tier2)
    const shuffledTier3 = shuffleArray(DEVELOPMENT_CARDS.tier3)
    const shuffledNobles = shuffleArray(NOBLES)

    const players: Player[] = [
      {
        id: 0,
        name: "Kamu",
        isBot: false,
        gems: { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0 },
        cards: [],
        reservedCards: [],
        nobles: [],
        points: 0,
      },
      {
        id: 1,
        name: mode === "pve" ? "Bot" : "Pemain 2",
        isBot: mode === "pve",
        gems: { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0 },
        cards: [],
        reservedCards: [],
        nobles: [],
        points: 0,
      },
    ]

    setGameState({
      currentPlayer: 0,
      players,
      gems: { white: 4, blue: 4, green: 4, red: 4, black: 4, gold: 5 }, // 2-player gem supply
      availableCards: {
        tier1: shuffledTier1.slice(0, 4),
        tier2: shuffledTier2.slice(0, 4),
        tier3: shuffledTier3.slice(0, 4),
      },
      availableNobles: shuffledNobles.slice(0, 3),
      gameMode: mode,
      winner: null,
      botThinking: false,
      lastBotAction: null,
      selectedGems: { white: 0, blue: 0, green: 0, red: 0, black: 0 },
      botThinkingStage: "",
      animatingCard: null,
    })
  }

  const calculatePlayerBonuses = (player: Player): Record<GemColor, number> => {
    const bonuses: Record<GemColor, number> = { white: 0, blue: 0, green: 0, red: 0, black: 0 }
    player.cards.forEach((card) => {
      bonuses[card.provides]++
    })
    return bonuses
  }

  const canAffordCard = (player: Player, card: DevelopmentCard): boolean => {
    const bonuses = calculatePlayerBonuses(player)
    let goldNeeded = 0

    for (const color of GEM_COLORS) {
      const needed = card.cost[color]
      const available = player.gems[color] + bonuses[color]
      if (available < needed) {
        goldNeeded += needed - available
      }
    }

    return goldNeeded <= player.gems.gold
  }

  // Helper to calculate cost and return new gem states for player and supply
  const calculateCostAndNewGems = (
    player: Player,
    card: DevelopmentCard,
    currentGemsSupply: Record<GemColor | "gold", number>,
  ) => {
    const bonuses = calculatePlayerBonuses(player)
    const newPlayerGems = { ...player.gems }
    const newGemsSupply = { ...currentGemsSupply }

    for (const color of GEM_COLORS) {
      const needed = card.cost[color]
      const bonus = bonuses[color]
      const fromGems = Math.min(Math.max(0, needed - bonus), newPlayerGems[color])
      const fromGold = Math.max(0, needed - bonus - fromGems)

      newPlayerGems[color] -= fromGems
      newGemsSupply[color] += fromGems

      if (fromGold > 0) {
        newPlayerGems.gold -= fromGold
        newGemsSupply.gold += fromGold
      }
    }
    return { newPlayerGems, newGemsSupply }
  }

  // Immutable checkNobleVisits function
  const checkNobleVisitsImmutable = (player: Player, currentAvailableNobles: Noble[]) => {
    const bonuses = calculatePlayerBonuses(player)
    const newPlayerNobles = [...player.nobles]
    let updatedAvailableNobles = [...currentAvailableNobles]
    let playerPointsGained = 0

    currentAvailableNobles.forEach((noble) => {
      const canVisit = GEM_COLORS.every((color) => bonuses[color] >= noble.requirements[color])
      if (canVisit && !newPlayerNobles.some((n) => n.id === noble.id)) {
        newPlayerNobles.push(noble)
        playerPointsGained += noble.points
        updatedAvailableNobles = updatedAvailableNobles.filter((n) => n.id !== noble.id)
      }
    })
    return { newPlayerNobles, updatedAvailableNobles, playerPointsGained }
  }

  // Refactored logic functions to return new state, not call setGameState
  const buyCardLogic = (
    prev: GameState,
    playerId: number,
    card: DevelopmentCard,
    tier: keyof GameState["availableCards"],
  ): GameState => {
    const newState = { ...prev }
    const players = [...newState.players]
    const player = { ...players[playerId] }
    players[playerId] = player
    newState.players = players

    const { newPlayerGems, newGemsSupply } = calculateCostAndNewGems(player, card, newState.gems)
    player.gems = newPlayerGems
    newState.gems = newGemsSupply

    player.cards = [...player.cards, card]
    player.points += card.points

    const newAvailableCards = { ...newState.availableCards }
    newAvailableCards[tier] = newAvailableCards[tier].filter((c) => c.id !== card.id)

    const allCards =
      tier === "tier1" ? DEVELOPMENT_CARDS.tier1 : tier === "tier2" ? DEVELOPMENT_CARDS.tier2 : DEVELOPMENT_CARDS.tier3
    const usedCardIds = new Set([
      ...newAvailableCards.tier1.map((c) => c.id),
      ...newAvailableCards.tier2.map((c) => c.id),
      ...newAvailableCards.tier3.map((c) => c.id),
      ...players.flatMap((p) => [...p.cards, ...p.reservedCards]).map((c) => c.id),
    ])

    const availableNewCards = allCards.filter((c) => !usedCardIds.has(c.id))
    if (availableNewCards.length > 0) {
      const randomCard = availableNewCards[Math.floor(Math.random() * availableNewCards.length)]
      newAvailableCards[tier] = [...newAvailableCards[tier], randomCard]
    }
    newState.availableCards = newAvailableCards

    const { newPlayerNobles, updatedAvailableNobles, playerPointsGained } = checkNobleVisitsImmutable(
      player,
      newState.availableNobles,
    )
    player.nobles = newPlayerNobles
    player.points += playerPointsGained // Add points from nobles
    newState.availableNobles = updatedAvailableNobles

    if (player.points >= 15) {
      newState.winner = playerId
    }

    newState.animatingCard = card.id // Set animation here

    return newState
  }

  const buyReservedCardLogic = (prev: GameState, playerId: number, card: DevelopmentCard): GameState => {
    const newState = { ...prev }
    const players = [...newState.players]
    const player = { ...players[playerId] }
    players[playerId] = player
    newState.players = players

    const { newPlayerGems, newGemsSupply } = calculateCostAndNewGems(player, card, newState.gems)
    player.gems = newPlayerGems
    newState.gems = newGemsSupply

    player.cards = [...player.cards, card]
    player.points += card.points

    player.reservedCards = player.reservedCards.filter((c) => c.id !== card.id)

    const { newPlayerNobles, updatedAvailableNobles, playerPointsGained } = checkNobleVisitsImmutable(
      player,
      newState.availableNobles,
    )
    player.nobles = newPlayerNobles
    player.points += playerPointsGained
    newState.availableNobles = updatedAvailableNobles

    if (player.points >= 15) {
      newState.winner = playerId
    }

    newState.animatingCard = card.id

    return newState
  }

  const takeGemsLogic = (prev: GameState, playerId: number, selectedGems: Record<GemColor, number>): GameState => {
    const newState = { ...prev }
    const players = [...newState.players]
    const player = { ...players[playerId] }
    players[playerId] = player
    newState.players = players

    const newPlayerGems = { ...player.gems }
    const newGemsSupply = { ...newState.gems }

    // Add gems to player and remove from supply
    for (const color of GEM_COLORS) {
      newPlayerGems[color] += selectedGems[color]
      newGemsSupply[color] -= selectedGems[color]
    }
    player.gems = newPlayerGems
    newState.gems = newGemsSupply

    newState.selectedGems = { white: 0, blue: 0, green: 0, red: 0, black: 0 } // Reset selected gems

    return newState
  }

  const reserveCardLogic = (
    prev: GameState,
    playerId: number,
    card: DevelopmentCard,
    tier: keyof GameState["availableCards"],
  ): GameState => {
    const newState = { ...prev }
    const players = [...newState.players]
    const player = { ...players[playerId] }
    players[playerId] = player
    newState.players = players

    player.reservedCards = [...player.reservedCards, card]

    const newGemsSupply = { ...newState.gems }
    const newPlayerGems = { ...player.gems }

    // Give gold token if available
    if (newGemsSupply.gold > 0) {
      newPlayerGems.gold++
      newGemsSupply.gold--
    }
    player.gems = newPlayerGems
    newState.gems = newGemsSupply

    const newAvailableCards = { ...newState.availableCards }
    newAvailableCards[tier] = newAvailableCards[tier].filter((c) => c.id !== card.id)

    const allCards =
      tier === "tier1" ? DEVELOPMENT_CARDS.tier1 : tier === "tier2" ? DEVELOPMENT_CARDS.tier2 : DEVELOPMENT_CARDS.tier3
    const usedCardIds = new Set([
      ...newAvailableCards.tier1.map((c) => c.id),
      ...newAvailableCards.tier2.map((c) => c.id),
      ...newAvailableCards.tier3.map((c) => c.id),
      ...players.flatMap((p) => [...p.cards, ...p.reservedCards]).map((c) => c.id),
    ])

    const availableNewCards = allCards.filter((c) => !usedCardIds.has(c.id))
    if (availableNewCards.length > 0) {
      const randomCard = availableNewCards[Math.floor(Math.random() * availableNewCards.length)]
      newAvailableCards[tier] = [...newAvailableCards[tier], randomCard]
    }
    newState.availableCards = newAvailableCards

    return newState
  }

  const nextTurn = () => {
    setGameState((prev) => ({
      ...prev,
      currentPlayer: (prev.currentPlayer + 1) % 2,
      lastBotAction: null,
    }))
  }

  // Enhanced Bot AI Logic with thinking stages
  const makeBotMove = useCallback(() => {
    // Initial checks before starting the thinking process
    if (gameState.gameMode !== "pve" || gameState.currentPlayer !== 1 || gameState.winner) return

    const thinkingStages = [
      "Menganalisis kartu yang tersedia...",
      "Menghitung kebutuhan permata...",
      "Mengevaluasi peluang bangsawan...",
      "Mempertimbangkan pilihan strategi...",
      "Membuat keputusan akhir...",
    ]

    let stageIndex = 0

    setGameState((prev) => ({
      ...prev,
      botThinking: true,
      botThinkingStage: thinkingStages[0],
    }))

    const thinkingInterval = setInterval(() => {
      stageIndex++
      if (stageIndex < thinkingStages.length) {
        setGameState((prev) => ({
          ...prev,
          botThinkingStage: thinkingStages[stageIndex],
        }))
      } else {
        clearInterval(thinkingInterval)
      }
    }, 800)

    setTimeout(() => {
      clearInterval(thinkingInterval)

      setGameState((prev) => {
        // Re-check conditions with the latest 'prev' state before making the move
        // This is crucial if the state changed (e.g., game reset) during the timeout
        if (prev.gameMode !== "pve" || prev.currentPlayer !== 1 || prev.winner || !prev.players[1]) {
          console.warn("Bot move aborted: Game state changed during thinking time.")
          return {
            // Ensure botThinking is reset even if move is aborted
            ...prev,
            botThinking: false,
            botThinkingStage: "",
            lastBotAction: "Bot membatalkan giliran (permainan direset/berakhir)",
          }
        }

        let currentBotState = { ...prev } // Start with a copy of the current state
        let actionTaken = false
        let botAction = ""

        // Strategy 1: Buy affordable reserved cards
        const botPlayer = currentBotState.players[1] // Get the bot player from the current state
        const affordableReservedCards = botPlayer.reservedCards.filter((card) => canAffordCard(botPlayer, card))
        if (affordableReservedCards.length > 0) {
          const cardToBuy = affordableReservedCards[0] // Just take the first one for simplicity
          currentBotState = buyReservedCardLogic(currentBotState, 1, cardToBuy) // Update currentBotState
          botAction = `Bot membeli kartu cadangan ${cardToBuy.provides} untuk ${cardToBuy.points} poin`
          actionTaken = true
        }

        // Strategy 2: Buy affordable cards with points (from available)
        if (!actionTaken) {
          const allAvailableCards = [
            ...currentBotState.availableCards.tier1.map((card) => ({ card, tier: "tier1" as const })),
            ...currentBotState.availableCards.tier2.map((card) => ({ card, tier: "tier2" as const })),
            ...currentBotState.availableCards.tier3.map((card) => ({ card, tier: "tier3" as const })),
          ]
          const affordableCards = allAvailableCards.filter(({ card }) =>
            canAffordCard(currentBotState.players[1], card),
          )

          if (affordableCards.length > 0) {
            affordableCards.sort((a, b) => {
              if (a.card.points !== b.card.points) return b.card.points - a.card.points
              const tierValues = { tier3: 3, tier2: 2, tier1: 1 }
              return tierValues[b.tier] - tierValues[a.tier]
            })

            const { card, tier } = affordableCards[0]
            currentBotState = buyCardLogic(currentBotState, 1, card, tier) // Update currentBotState
            botAction = `Bot membeli kartu ${card.provides} untuk ${card.points} poin`
            actionTaken = true
          }
        }

        // Strategy 3: Reserve high-value cards
        if (!actionTaken && currentBotState.players[1].reservedCards.length < 3) {
          const allAvailableCards = [
            ...currentBotState.availableCards.tier1.map((card) => ({ card, tier: "tier1" as const })),
            ...currentBotState.availableCards.tier2.map((card) => ({ card, tier: "tier2" as const })),
            ...currentBotState.availableCards.tier3.map((card) => ({ card, tier: "tier3" as const })),
          ]
          const highValueCards = allAvailableCards.filter(({ card }) => card.points >= 2)
          if (highValueCards.length > 0) {
            const { card, tier } = highValueCards[Math.floor(Math.random() * highValueCards.length)]
            currentBotState = reserveCardLogic(currentBotState, 1, card, tier) // Update currentBotState
            botAction = `Bot menyimpan kartu ${card.provides} senilai ${card.points} poin`
            actionTaken = true
          }
        }

        // Strategy 4: Take gems strategically
        if (!actionTaken) {
          const bonuses = calculatePlayerBonuses(currentBotState.players[1])
          const gemPriority = GEM_COLORS.map((color) => ({
            color,
            need: Math.max(0, 3 - bonuses[color]),
          })).sort((a, b) => b.need - a.need)

          const selectedGems: Record<GemColor, number> = { white: 0, blue: 0, green: 0, red: 0, black: 0 }
          let gemsToTake = 3

          for (const { color } of gemPriority) {
            if (gemsToTake > 0 && currentBotState.gems[color] > 0) {
              selectedGems[color] = 1
              gemsToTake--
            }
          }

          if (gemsToTake > 0) {
            for (const { color } of gemPriority) {
              if (currentBotState.gems[color] >= 4) {
                selectedGems[color] = 2
                gemsToTake = 0
                break
              }
            }
          }

          if (Object.values(selectedGems).some((count) => count > 0)) {
            currentBotState = takeGemsLogic(currentBotState, 1, selectedGems) // Update currentBotState
            const takenColors = GEM_COLORS.filter((color) => selectedGems[color] > 0)
            botAction = `Bot mengambil ${takenColors.map((color) => `${selectedGems[color]} ${color}`).join(", ")} permata`
            actionTaken = true
          }
        }

        if (!actionTaken) {
          botAction = "Bot melewati giliran"
        }

        // Final state update for the turn
        return {
          ...currentBotState, // Return the state after bot's action
          botThinking: false,
          botThinkingStage: "",
          lastBotAction: botAction,
          currentPlayer: (currentBotState.currentPlayer + 1) % 2, // Ensure turn advances
        }
      })
    }, 4000) // Total thinking time: 4 seconds
  }, [gameState]) // Dependency on gameState is fine, as useCallback will re-create if gameState changes.

  useEffect(() => {
    if (gameState.gameMode === "pve" && gameState.currentPlayer === 1 && !gameState.winner && !gameState.botThinking) {
      makeBotMove()
    }
  }, [gameState.currentPlayer, gameState.gameMode, gameState.winner, makeBotMove])

  const updateSelectedGems = (color: GemColor, change: number) => {
    setGameState((prev) => {
      const newSelected = { ...prev.selectedGems }
      const newValue = Math.max(0, newSelected[color] + change)

      // Check constraints
      const totalSelected =
        Object.values(newSelected).reduce((sum, val) => sum + val, 0) - newSelected[color] + newValue
      const differentColors =
        Object.values(newSelected).filter((val) => val > 0).length -
        (newSelected[color] > 0 ? 1 : 0) +
        (newValue > 0 ? 1 : 0)

      // Rule 1: Can't take more than 2 of same color
      if (newValue > 2) return prev

      // Rule 2: If taking 2 of same color, can't take any other gems
      if (newValue === 2 && differentColors > 1) return prev
      if (totalSelected > newValue && newValue === 2) return prev

      // Rule 3: Can't take more than 3 gems total
      if (totalSelected > 3) return prev

      // Rule 4: Can't take 2 of same color if supply < 4
      if (newValue === 2 && prev.gems[color] < 4) return prev

      // Rule 5: Can't take more gems than available
      if (newValue > prev.gems[color]) return prev

      newSelected[color] = newValue
      return { ...prev, selectedGems: newSelected }
    })
  }

  const canTakeSelectedGems = () => {
    const totalSelected = Object.values(gameState.selectedGems).reduce((sum, val) => sum + val, 0)
    const differentColors = Object.values(gameState.selectedGems).filter((val) => val > 0).length

    if (totalSelected === 0) return false
    if (totalSelected > 3) return false

    // Check if taking 2 of same color
    const twoOfSameColor = Object.entries(gameState.selectedGems).find(([_, count]) => count === 2)
    if (twoOfSameColor) {
      return differentColors === 1 && gameState.gems[twoOfSameColor[0] as GemColor] >= 4
    }

    // Otherwise, must be taking different colors (max 3)
    return differentColors <= 3 && totalSelected <= 3
  }

  // Moved the menu rendering logic to the top of the SplendorGame component
  if (gameState.gameMode === "menu") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Main Menu Card */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="text-center py-8 bg-slate-900 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                    <Gem className="w-10 h-10 text-slate-900" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-4xl font-bold mb-2">Splendor</CardTitle>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Pilih Mode Permainan</h3>
                <p className="text-slate-500">nih aku buatin tempat kamu latian wkwkw</p>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full h-16 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  onClick={() => initializeGame("pvp")}
                >
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <span>Permainan Dua Pemain</span>
                  </div>
                </Button>

                <Button
                  className="w-full h-16 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  onClick={() => initializeGame("pve")}
                >
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-white font-bold">VS</span>
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                    <span>Lawan Bot</span>
                  </div>
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                      <Diamond className="w-6 h-6 text-slate-600" />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">Kumpulkan Permata</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                      <Star className="w-6 h-6 text-slate-600" />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">Beli Kartu</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                      <Crown className="w-6 h-6 text-slate-600" />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">Tarik Bangsawan</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-center text-sm text-gray-500 mt-8 nothint">
              Made with <span className=" hint text-gray-100">♥</span> by <span className="hint text-gray-100">rizal</span>
            </p>          </div>
        </div>
      </div>
    )
  }

  const currentPlayer = gameState.players[gameState.currentPlayer]
  const currentPlayerBonuses = calculatePlayerBonuses(currentPlayer)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-2 md:p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-lg p-4 shadow-lg animate-slide-down">
          <div className="flex items-center gap-3">
            <Gem className="w-8 h-8 text-purple-600 animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Splendor
            </h1>
          </div>

          {gameState.winner !== null ? (
            <div className="flex items-center gap-3 text-green-600 bg-green-50 px-4 py-2 rounded-lg animate-bounce">
              <Trophy className="w-8 h-8" />
              <span className="font-bold text-xl">{gameState.players[gameState.winner].name} Menang!</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-700">Giliran Saat Ini:</span>
              <Badge
                variant={currentPlayer.isBot ? "secondary" : "default"}
                className="px-3 py-1 text-sm animate-pulse"
              >
                {currentPlayer.isBot ? <Bot className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                {currentPlayer.name}
              </Badge>
              {gameState.botThinking && (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  <Brain className="w-4 h-4 animate-spin" />
                  <span className="text-sm animate-pulse">{gameState.botThinkingStage}</span>
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => setGameState(initialGameState)}
            className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 transition-colors duration-200"
          >
            Permainan Baru
          </Button>
        </div>

        {/* Bot Action Feedback */}
        {gameState.lastBotAction && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md animate-slide-in">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-blue-700">
                <Bot className="w-5 h-5" />
                <span className="font-medium">{gameState.lastBotAction}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Players Side by Side */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-2">
            {/* Current Player */}
            <Card
              className={`${gameState.currentPlayer === 0 ? "ring-2 ring-blue-400 bg-blue-50 animate-pulse" : "bg-white"} shadow-lg transition-all duration-300`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {gameState.players[0].isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  {gameState.players[0].name}
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    <Star className="w-3 h-3 mr-1" />
                    {gameState.players[0].points}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Player Gems */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-gray-600">Permata</h4>
                  <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-7 sm:overflow-x-visible sm:gap-3">
                    {[...GEM_COLORS, "gold" as const].map((color) => (
                      <div key={color} className="flex flex-col items-center min-w-[48px]">
                        <GemToken color={color} count={gameState.players[0].gems[color]} size="small" />
                        <span className="text-xs text-gray-500 mt-1">{gameState.players[0].gems[color]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Player Card Bonuses */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-gray-600">Bonus Kartu</h4>
                  <div className="flex gap-1 overflow-x-auto pb-1 sm:grid sm:grid-cols-6 sm:overflow-x-visible sm:gap-2">
                    {GEM_COLORS.map((color) => {
                      const count = gameState.players[0].cards.filter((card) => card.provides === color).length
                      return (
                        <div key={color} className="flex flex-col items-center min-w-[32px]">
                          <div
                            className={`w-5 h-5 rounded-full border ${getGemColor(color)} flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110`}
                          >
                            {count}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Reserved Cards */}
                {gameState.players[0].reservedCards.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-gray-600">
                      Cadangan ({gameState.players[0].reservedCards.length})
                    </h4>
                    <div className="flex gap-2 overflow-x-auto pb-2 justify-center md:justify-start">
                      {gameState.players[0].reservedCards.map((card) => (
                        <DevelopmentCardComponent
                          key={card.id}
                          card={card}
                          canBuy={canAffordCard(gameState.players[0], card)}
                          onBuy={() => {
                            setGameState((prev) => buyReservedCardLogic(prev, gameState.currentPlayer, card))
                            nextTurn()
                          }}
                          showActions={!currentPlayer.isBot && !gameState.winner}
                          animatingCardId={gameState.animatingCard}
                          isReserved={true}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Opponent */}
            <Card
              className={`${gameState.currentPlayer === 1 ? "ring-2 ring-blue-400 bg-blue-50 animate-pulse" : "bg-white"} shadow-lg transition-all duration-300`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {gameState.players[1].isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  {gameState.players[1].name}
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    <Star className="w-3 h-3 mr-1" />
                    {gameState.players[1].points}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Opponent Gems */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-gray-600">Permata</h4>
                  <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-7 sm:overflow-x-visible sm:gap-3">
                    {[...GEM_COLORS, "gold" as const].map((color) => (
                      <div key={color} className="flex flex-col items-center min-w-[48px]">
                        <GemToken color={color} count={gameState.players[1].gems[color]} size="small" />
                        <span className="text-xs text-gray-500 mt-1">{gameState.players[1].gems[color]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opponent Card Bonuses */}
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-gray-600">Bonus Kartu</h4>
                  <div className="flex gap-1 overflow-x-auto pb-1 sm:grid sm:grid-cols-6 sm:overflow-x-visible sm:gap-2">
                    {GEM_COLORS.map((color) => {
                      const count = gameState.players[1].cards.filter((card) => card.provides === color).length
                      return (
                        <div key={color} className="flex flex-col items-center min-w-[32px]">
                          <div
                            className={`w-5 h-5 rounded-full border ${getGemColor(color)} flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110`}
                          >
                            {count}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Opponent Reserved Cards */}
                {gameState.players[1].reservedCards.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-gray-600">
                      Cadangan ({gameState.players[1].reservedCards.length})
                    </h4>
                    <div className="flex gap-2 overflow-x-auto pb-2 justify-center md:justify-start">
                      {gameState.players[1].reservedCards.map((card) => (
                        <DevelopmentCardComponent
                          key={card.id}
                          card={card}
                          canBuy={canAffordCard(gameState.players[1], card)}
                          onBuy={() => {
                            setGameState((prev) => buyReservedCardLogic(prev, gameState.currentPlayer, card))
                            nextTurn()
                          }}
                          showActions={!currentPlayer.isBot && !gameState.winner}
                          animatingCardId={gameState.animatingCard}
                          isReserved={true}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Game Board - Development Cards */}
          <div className="xl:col-span-2 sm:col-span-1">
            <Card className="shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardContent className="space-y-6 mt-4">
                {/* Development Cards */}
                <div className="space-y-4">
                  {(["tier3", "tier2", "tier1"] as const).map((tier) => (
                    <div key={tier}>
                      <h4 className="font-semibold text-2xl mb-3 flex items-center gap-2">
                        <Diamond className="w-5 h-5 text-blue-600" />
                        {tier === "tier3"
                          ? "Tingkat 3"
                          : tier === "tier2"
                            ? "Tingkat 2"
                            : "Tingkat 1"}
                      </h4>
                      <div className="flex lg:gap-5 gap-7 overflow-x-auto pb-2 justify-center md:justify-start">
                        {gameState.availableCards[tier].map((card) => (
                          <DevelopmentCardComponent
                            key={card.id}
                            card={card}
                            tier={tier}
                            canBuy={canAffordCard(currentPlayer, card)}
                            onBuy={() => {
                              setGameState((prev) => buyCardLogic(prev, gameState.currentPlayer, card, tier))
                              nextTurn()
                            }}
                            onReserve={() => {
                              if (currentPlayer.reservedCards.length < 3) {
                                setGameState((prev) => reserveCardLogic(prev, gameState.currentPlayer, card, tier))
                                nextTurn()
                              }
                            }}
                            showActions={!currentPlayer.isBot && !gameState.winner}
                            animatingCardId={gameState.animatingCard}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gem Supply and Taking - Returned to its original position below development cards */}
            <Card className="shadow-lg bg-white mt-4">
              {" "}
              {/* Added mt-4 for spacing */}
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-yellow-600" />
                  Persediaan Permata & Aksi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Available Gems */}
                <div className="mb-4">
                  <div className="flex gap-3 justify-center">
                    {[...GEM_COLORS, "gold" as const].map((color) => (
                      <div key={color} className="text-center">
                        <GemToken color={color} count={gameState.gems[color]} size="large" />
                        <p className="text-xs text-gray-600 mt-1 font-medium">Persediaan: {gameState.gems[color]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gem Taking Interface */}
                {!currentPlayer.isBot && !gameState.winner && (
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-300">
                    <h5 className="font-semibold mb-3 text-center text-blue-700">Pilih Permata untuk Diambil</h5>

                    {/* Selected Gems Display */}
                    <div className="flex gap-2 justify-center mb-4">
                      {GEM_COLORS.map((color) => (
                        <div key={color} className="text-center">
                          <div className="flex items-center gap-1 mb-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-6 h-6 p-0 bg-transparent hover:bg-red-50 transition-colors duration-200"
                              onClick={() => updateSelectedGems(color, -1)}
                              disabled={gameState.selectedGems[color] === 0}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <GemToken color={color} count={gameState.selectedGems[color]} size="normal" />
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-6 h-6 p-0 bg-transparent hover:bg-green-50 transition-colors duration-200"
                              onClick={() => updateSelectedGems(color, 1)}
                              disabled={gameState.selectedGems[color] >= 2 || gameState.gems[color] === 0}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-600">Dipilih: {gameState.selectedGems[color]}</p>
                        </div>
                      ))}
                    </div>

                    {/* Rules Display */}
                    <div className="text-xs text-gray-600 mb-3 bg-white p-2 rounded">
                      <p className="font-semibold mb-1">Aturan:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Ambil hingga 3 permata warna berbeda, ATAU</li>
                        <li>Ambil 2 permata warna sama (jika tersedia 4+)</li>
                        <li>Tidak bisa dicampur: jika ambil 2 warna sama, tidak bisa ambil lainnya</li>
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => {
                          setGameState((prev) => takeGemsLogic(prev, gameState.currentPlayer, gameState.selectedGems))
                          nextTurn()
                        }}
                        disabled={!canTakeSelectedGems()}
                        className="bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
                      >
                        <Gem className="w-4 h-4 mr-2" />
                        Ambil Permata Terpilih
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setGameState((prev) => ({
                            ...prev,
                            selectedGems: { white: 0, blue: 0, green: 0, red: 0, black: 0 },
                          }))
                        }
                        disabled={Object.values(gameState.selectedGems).every((count) => count === 0)}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Hapus Pilihan
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Nobles Column */}
          <div className="xl:col-span-1 sm:col-span-1">
            <Card className="shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-purple-600" />
                  Para Raja
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap justify-center gap-3 p-4">
                {gameState.availableNobles.map((noble) => (
                  <NobleComponent key={noble.id} noble={noble} playerBonuses={currentPlayerBonuses} />
                ))}
              </CardContent>
            </Card>
            <p className="text-center text-sm text-gray-500 mt-8 nothint">
              Made with <span className=" hint text-gray-100">♥</span> by <span className="hint text-gray-100">rizal</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .max-w-7xl {
            max-width: 100vw;
            padding: 0 2px;
          }
          .grid {
            display: flex;
            flex-direction: column;
            gap: 8px !important;
          }
          .xl\\:col-span-1, .xl\\:col-span-2 {
            width: 100% !important;
            grid-column: span 1 / span 1 !important;
          }
          .space-y-4 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0.5rem;
          }
          .flex-wrap, .flex {
            flex-wrap: wrap !important;
          }
          .p-4 {
            padding: 0.5rem !important;
          }
          .gap-3, .gap-4 {
            gap: 0.5rem !important;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
