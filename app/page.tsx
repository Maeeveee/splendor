"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Gem, User, Bot, Trophy, Eye, Diamond, Coins, Star, Brain } from "lucide-react"

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
    tier1: (DevelopmentCard | null)[] // Can be null for empty slots
    tier2: (DevelopmentCard | null)[]
    tier3: (DevelopmentCard | null)[]
  }
  decks: {
    // New: Decks for drawing new cards
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

// Modified GemToken to include flash animation
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

  const [flash, setFlash] = useState(false)
  const prevCountRef = useRef(count)

  useEffect(() => {
    if (count !== prevCountRef.current) {
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), 300) // Match animation duration
      return () => clearTimeout(timer)
    }
    prevCountRef.current = count
  }, [count])

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-2 ${getGemColor(color)} flex items-center justify-center font-bold shadow-md transition-all duration-300 hover:scale-110 ${flash ? "animate-gem-flash" : ""}`}
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
    className={`
w-32 h-36 relative
shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105
${animatingCardId === card.id ? "animate-pulse ring-2 ring-green-400" : ""}
${isReserved ? "border-blue-400 border-2" : ""}
${
  card.provides === "white"
    ? "bg-gray-100"
    : card.provides === "blue"
      ? "bg-blue-100"
      : card.provides === "green"
        ? "bg-green-100"
        : card.provides === "red"
          ? "bg-red-100"
          : card.provides === "black"
            ? "bg-gray-700"
            : ""
}
`}
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
    <CardContent className="p-2 pt-0 pb-4">
      {" "}
      {/* Changed pb-8 to pb-4 */}
      <div className="space-y-1">
        <div className={`text-xs font-semibold mb-1 ${card.provides === "black" ? "text-white" : "text-gray-600"}`}>
          Biaya:
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 max-h-20 overflow-y-auto">
          {GEM_COLORS.map(
            (color) =>
              card.cost[color] > 0 && (
                <div key={color} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full border ${getGemColor(color)} flex items-center justify-center`}>
                    {getGemIcon(color)}
                  </div>
                  <span className={`text-xs font-medium ${card.provides === "black" ? "text-white" : "text-gray-700"}`}>
                    {card.cost[color]}
                  </span>
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
      className={`w-28 h-28 relative bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg flex flex-col items-center justify-center p-2 transition-all duration-300 hover:scale-105 ${
        canVisit ? "ring-2 ring-yellow-400" : "opacity-70"
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

// New: Empty Card Slot Component
const EmptyCardSlot = () => (
  <Card className="w-32 h-36 relative shadow-inner bg-gray-200 flex items-center justify-center text-gray-500 text-sm border-dashed border-gray-400">
    {" "}
    {/* Changed h-34 to h-36 */}
    Slot Kosong
  </Card>
)

// New: Card Slot Wrapper Component
const CardSlot = ({
  card,
  tier,
  canBuy,
  onBuy,
  onReserve,
  showActions,
  animatingCardId,
  isReserved,
  index, // Pass index for key
}: {
  card: DevelopmentCard | null
  tier?: keyof GameState["availableCards"]
  canBuy: boolean
  onBuy: () => void
  onReserve?: () => void
  showActions?: boolean
  animatingCardId: number | null
  isReserved?: boolean
  index: number
}) => {
  if (!card) {
    return <EmptyCardSlot key={`empty-${tier}-${index}`} />
  }
  return (
    <DevelopmentCardComponent
      key={card.id}
      card={card}
      tier={tier}
      canBuy={canBuy}
      onBuy={onBuy}
      onReserve={onReserve}
      showActions={showActions}
      animatingCardId={animatingCardId}
      isReserved={isReserved}
    />
  )
}

// New: Deck Counter Component
const DeckCounter = ({ count }: { count: number }) => (
  <Card className="w-32 h-36 relative shadow-lg bg-slate-800 text-white flex flex-col items-center justify-center p-2">
    {" "}
    {/* Changed w-28 to w-32, h-34 to h-36 */}
    <div className="text-3xl font-bold">{count}</div> {/* Changed text-4xl to text-3xl */}
    <div className="text-sm mt-2 text-center">Kartu Tersisa</div>
    <div className="absolute bottom-2 right-2">
      <Gem className="w-4 h-4 text-gray-400" />
    </div>
  </Card>
)

const initialGameState: GameState = {
  currentPlayer: 0,
  players: [],
  gems: { white: 4, blue: 4, green: 4, red: 4, black: 4, gold: 5 }, // Persediaan permata untuk 2 pemain
  availableCards: {
    tier1: [],
    tier2: [],
    tier3: [],
  },
  decks: {
    // New: Initialize empty decks
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

  // Inisialisasi objek Audio menggunakan useRef
  const gemCollectSound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/gem-collect.mp3") : null)
  const cardBuySound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/card-buy.mp3") : null)
  const cardReserveSound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/card-reserve.mp3") : null)
  const gameWinSound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/game-win.mp3") : null)

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
      decks: {
        // Initialize decks with remaining cards
        tier1: shuffledTier1.slice(4),
        tier2: shuffledTier2.slice(4),
        tier3: shuffledTier3.slice(4),
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
  // Removed turn advancement from here
  const buyCardLogic = (
    prev: GameState,
    playerId: number,
    card: DevelopmentCard,
    tier: keyof GameState["availableCards"],
    cardIndex: number, // New parameter for index
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
    const newDecks = {
      tier1: [...prev.decks.tier1], // Pastikan ini adalah salinan mendalam
      tier2: [...prev.decks.tier2],
      tier3: [...prev.decks.tier3],
    }

    // Replace the bought card with a new one from the deck or null
    if (newDecks[tier].length > 0) {
      newAvailableCards[tier] = [...newAvailableCards[tier]] // Create a shallow copy
      newAvailableCards[tier][cardIndex] = newDecks[tier].shift()! // Draw from top of deck
    } else {
      newAvailableCards[tier] = [...newAvailableCards[tier]]
      newAvailableCards[tier][cardIndex] = null // Slot becomes empty
    }
    newState.availableCards = newAvailableCards
    newState.decks = newDecks // Update decks in state

    const { newPlayerNobles, updatedAvailableNobles, playerPointsGained } = checkNobleVisitsImmutable(
      player,
      newState.availableNobles,
    )
    player.nobles = newPlayerNobles
    player.points += playerPointsGained // Add points from nobles
    newState.availableNobles = updatedAvailableNobles

    if (player.points >= 15) {
      newState.winner = playerId
      gameWinSound.current?.play() // Play win sound
    }

    newState.animatingCard = card.id // Set animation here

    return newState
  }

  // Removed turn advancement from here
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
      gameWinSound.current?.play() // Play win sound
    }

    newState.animatingCard = card.id

    return newState
  }

  const getTotalGems = (playerGems: Record<GemColor | "gold", number>) =>
    GEM_COLORS.reduce((sum, color) => sum + playerGems[color], 0) + playerGems.gold

  // Removed turn advancement from here
  const takeGemsLogic = (prev: GameState, playerId: number, selectedGems: Record<GemColor, number>): GameState => {
    const newState = { ...prev }
    const players = [...newState.players]
    const player = { ...players[playerId] }
    players[playerId] = player
    newState.players = players

    const newPlayerGems = { ...player.gems }
    const newGemsSupply = { ...newState.gems }

    let currentTotalPlayerGems = getTotalGems(newPlayerGems)
    const maxGems = 10

    // Add gems to player and remove from supply, respecting the 10-gem limit
    for (const color of GEM_COLORS) {
      const amountToTake = selectedGems[color]
      if (amountToTake > 0) {
        const canAdd = Math.min(amountToTake, maxGems - currentTotalPlayerGems)
        if (canAdd > 0) {
          newPlayerGems[color] += canAdd
          newGemsSupply[color] -= canAdd
          currentTotalPlayerGems += canAdd
        }
      }
    }

    player.gems = newPlayerGems
    newState.gems = newGemsSupply

    newState.selectedGems = { white: 0, blue: 0, green: 0, red: 0, black: 0 } // Reset selected gems

    return newState
  }

  // Removed turn advancement from here
  const reserveCardLogic = (
    prev: GameState,
    playerId: number,
    card: DevelopmentCard,
    tier: keyof GameState["availableCards"],
    cardIndex: number, // New parameter for index
  ): GameState => {
    const newState = { ...prev }
    const players = [...newState.players]
    const player = { ...players[playerId] }
    players[playerId] = player
    newState.players = players

    player.reservedCards = [...player.reservedCards, card]

    const newGemsSupply = { ...newState.gems }
    const newPlayerGems = { ...player.gems }

    // Give gold token if available AND player has less than 10 gems
    if (newGemsSupply.gold > 0 && getTotalGems(newPlayerGems) < 10) {
      newPlayerGems.gold++
      newGemsSupply.gold--
    }
    player.gems = newPlayerGems
    newState.gems = newGemsSupply

    const newAvailableCards = { ...newState.availableCards }
    const newDecks = {
      tier1: [...prev.decks.tier1], // Pastikan ini adalah salinan mendalam
      tier2: [...prev.decks.tier2],
      tier3: [...prev.decks.tier3],
    }

    // Replace the reserved card with a new one from the deck or null
    if (newDecks[tier].length > 0) {
      newAvailableCards[tier] = [...newAvailableCards[tier]] // Create a shallow copy
      newAvailableCards[tier][cardIndex] = newDecks[tier].shift()! // Draw from top of deck
    } else {
      newAvailableCards[tier] = [...newAvailableCards[tier]]
      newAvailableCards[tier][cardIndex] = null // Slot becomes empty
    }
    newState.availableCards = newAvailableCards
    newState.decks = newDecks // Update decks in state

    return newState
  }

  // nextTurn function remains as a separate helper
  const nextTurn = () => {
    setGameState((prev) => ({
      ...prev,
      currentPlayer: (prev.currentPlayer + 1) % 2,
      lastBotAction: null,
    }))
  }

  // Enhanced Bot AI Logic with thinking stages and more varied moves
  const makeBotMove = useCallback(() => {
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
        if (prev.gameMode !== "pve" || prev.currentPlayer !== 1 || prev.winner || !prev.players[1]) {
          console.warn("Bot move aborted: Game state changed during thinking time.")
          return {
            ...prev,
            botThinking: false,
            botThinkingStage: "",
            lastBotAction: "Bot membatalkan giliran (permainan direset/berakhir)",
          }
        }

        let currentBotState = { ...prev }
        let botAction = ""
        const botPlayer = currentBotState.players[1]

        // 1. Collect all possible actions
        const possibleActions: Array<
          | { type: "buyReserved"; card: DevelopmentCard }
          | { type: "buyAvailable"; card: DevelopmentCard; tier: keyof GameState["availableCards"]; index: number }
          | { type: "reserve"; card: DevelopmentCard; tier: keyof GameState["availableCards"]; index: number }
          | { type: "takeGems"; selectedGems: Record<GemColor, number> }
        > = []

        // Buy Reserved Cards
        const affordableReservedCards = botPlayer.reservedCards.filter((card) => canAffordCard(botPlayer, card))
        affordableReservedCards.forEach((card) => possibleActions.push({ type: "buyReserved", card }))

        // Buy Available Cards
        const allAvailableCards = [
          ...currentBotState.availableCards.tier1.map((card, index) => ({ card, tier: "tier1" as const, index })),
          ...currentBotState.availableCards.tier2.map((card, index) => ({ card, tier: "tier2" as const, index })),
          ...currentBotState.availableCards.tier3.map((card, index) => ({ card, tier: "tier3" as const, index })),
        ].filter(({ card }) => card !== null) as Array<{
          card: DevelopmentCard
          tier: keyof GameState["availableCards"]
          index: number
        }> // Filter out nulls
        const affordableCards = allAvailableCards.filter(({ card }) => canAffordCard(botPlayer, card))
        affordableCards.forEach(({ card, tier, index }) =>
          possibleActions.push({ type: "buyAvailable", card, tier, index }),
        )

        // Reserve Cards
        if (botPlayer.reservedCards.length < 3) {
          const reservableCards = allAvailableCards.filter(
            ({ card }) => !botPlayer.reservedCards.some((rc) => rc.id === card.id),
          )
          // Prioritize reserving high-point cards, but still allow some randomness
          reservableCards.sort((a, b) => b.card.points - a.card.points)
          // Add top 3-5 reservable cards to options, or all if less
          reservableCards.slice(0, Math.min(reservableCards.length, 5)).forEach(({ card, tier, index }) => {
            // Only add reserve action if player can receive a gold token or doesn't need one
            if (getTotalGems(botPlayer.gems) < 10 || currentBotState.gems.gold === 0) {
              possibleActions.push({ type: "reserve", card, tier, index })
            }
          })
        }

        // Take Gems (generate a few diverse options)
        // Option 1: Take 3 different gems (prioritize needed gems, then random)
        const strategicGemTake = (() => {
          const bonuses = calculatePlayerBonuses(botPlayer)
          const gemPriority = GEM_COLORS.map((color) => ({
            color,
            need: Math.max(0, 3 - bonuses[color]),
          })).sort((a, b) => b.need - a.need) // Descending need
          const selected = { white: 0, blue: 0, green: 0, red: 0, black: 0 } as Record<GemColor, number>
          let count = 0
          for (const { color } of gemPriority) {
            if (count < 3 && currentBotState.gems[color] > 0) {
              selected[color] = 1
              count++
            }
          }
          // Ensure total gems won't exceed 10
          if (getTotalGems(botPlayer.gems) + count <= 10) {
            return count > 0 ? selected : null
          }
          return null
        })()

        // Option 2: Take 2 of a kind (if supply >= 4)
        const twoOfAKindGemTake = (() => {
          const colorsWithFourPlus = GEM_COLORS.filter((color) => currentBotState.gems[color] >= 4)
          if (colorsWithFourPlus.length > 0) {
            const selected = { white: 0, blue: 0, green: 0, red: 0, black: 0 } as Record<GemColor, number>
            const chosenColor = colorsWithFourPlus[Math.floor(Math.random() * colorsWithFourPlus.length)]
            selected[chosenColor] = 2
            // Ensure total gems won't exceed 10
            if (getTotalGems(botPlayer.gems) + 2 <= 10) {
              return selected
            }
          }
          return null
        })()

        if (strategicGemTake) possibleActions.push({ type: "takeGems", selectedGems: strategicGemTake })
        if (twoOfAKindGemTake) possibleActions.push({ type: "takeGems", selectedGems: twoOfAKindGemTake })

        // 2. Decide on an action
        let chosenAction: (typeof possibleActions)[number] | null = null
        const buyActions = possibleActions.filter(
          (a) => a.type === "buyReserved" || a.type === "buyAvailable",
        ) as Array<
          | { type: "buyReserved"; card: DevelopmentCard }
          | { type: "buyAvailable"; card: DevelopmentCard; tier: keyof GameState["availableCards"]; index: number }
        >
        const nonBuyActions = possibleActions.filter((a) => a.type === "reserve" || a.type === "takeGems") as Array<
          | { type: "reserve"; card: DevelopmentCard; tier: keyof GameState["availableCards"]; index: number }
          | { type: "takeGems"; selectedGems: Record<GemColor, number> }
        >

        // Introduce a chance to deviate from optimal buying
        const randomDecisionChance = 0.35 // 35% chance to pick from non-buy actions if buy is available
        if (buyActions.length > 0 && Math.random() > randomDecisionChance) {
          // Prioritize buying: sort by points, then randomize among top ones
          buyActions.sort((a, b) => b.card.points - a.card.points)
          const topPoint = buyActions[0].card.points
          const bestBuyOptions = buyActions.filter((a) => a.card.points === topPoint)
          chosenAction = bestBuyOptions[Math.floor(Math.random() * bestBuyOptions.length)]
        } else if (nonBuyActions.length > 0) {
          // If no buy actions, or failed the randomDecisionChance, pick randomly from non-buy actions
          chosenAction = nonBuyActions[Math.floor(Math.random() * nonBuyActions.length)]
        } else if (buyActions.length > 0) {
          // Fallback: if only buy actions left and previous random failed (shouldn't happen often)
          chosenAction = buyActions[Math.floor(Math.random() * buyActions.length)]
        }

        // If no specific action was chosen, and there are any possible actions, pick one randomly as a last resort
        if (!chosenAction && possibleActions.length > 0) {
          chosenAction = possibleActions[Math.floor(Math.random() * possibleActions.length)]
        }

        // 3. Execute the chosen action
        if (chosenAction) {
          switch (chosenAction.type) {
            case "buyReserved":
              currentBotState = buyReservedCardLogic(currentBotState, 1, chosenAction.card)
              botAction = `Bot membeli kartu cadangan ${chosenAction.card.provides} untuk ${chosenAction.card.points} poin`
              cardBuySound.current?.play()
              break
            case "buyAvailable":
              currentBotState = buyCardLogic(
                currentBotState,
                1,
                chosenAction.card,
                chosenAction.tier,
                chosenAction.index,
              )
              botAction = `Bot membeli kartu ${chosenAction.card.provides} untuk ${chosenAction.card.points} poin`
              cardBuySound.current?.play()
              break
            case "reserve":
              currentBotState = reserveCardLogic(
                currentBotState,
                1,
                chosenAction.card,
                chosenAction.tier,
                chosenAction.index,
              )
              botAction = `Bot menyimpan kartu ${chosenAction.card.provides} senilai ${chosenAction.card.points} poin`
              cardReserveSound.current?.play()
              break
            case "takeGems":
              currentBotState = takeGemsLogic(currentBotState, 1, chosenAction.selectedGems)
              const takenColors = GEM_COLORS.filter((color) => chosenAction.selectedGems[color] > 0)
              botAction = `Bot mengambil ${takenColors.map((color) => `${chosenAction.selectedGems[color]} ${color}`).join(", ")} permata`
              gemCollectSound.current?.play()
              break
          }
        } else {
          botAction = "Bot melewati giliran"
        }

        // Final state update for the turn
        const finalState = {
          ...currentBotState, // Return the state after bot's action
          botThinking: false,
          botThinkingStage: "",
          lastBotAction: botAction,
          currentPlayer: (currentBotState.currentPlayer + 1) % 2, // Ensure turn advances
        }

        // Clear animatingCard after a short delay for visual effect
        if (finalState.animatingCard !== null) {
          setTimeout(() => setGameState((current) => ({ ...current, animatingCard: null })), 500)
        }
        return finalState
      })
    }, 4000) // Total thinking time: 4 seconds
  }, [gameState, gemCollectSound, cardBuySound, cardReserveSound, gameWinSound]) // Add sound refs to dependencies

  useEffect(() => {
    if (gameState.gameMode === "pve" && gameState.currentPlayer === 1 && !gameState.winner && !gameState.botThinking) {
      makeBotMove()
    }
  }, [gameState.currentPlayer, gameState.gameMode, gameState.winner, makeBotMove])

  const updateSelectedGems = (color: GemColor) => {
    setGameState((prev) => {
      const newSelected = { ...prev.selectedGems }
      const currentSelectedCount = newSelected[color]
      const currentPlayerGems = prev.players[prev.currentPlayer].gems
      const currentTotalPlayerGems = getTotalGems(currentPlayerGems)
      const totalSelectedBeforeClick = Object.values(newSelected).reduce((sum, val) => sum + val, 0)
      const differentColorsBeforeClick = Object.values(newSelected).filter((val) => val > 0).length
      let nextValue: number
      if (currentSelectedCount === 0) {
        // If currently 0, try to select 1
        nextValue = 1
      } else if (currentSelectedCount === 1) {
        // If currently 1, check if it's part of a 2-different or 3-different gem selection
        if (differentColorsBeforeClick === 2 && totalSelectedBeforeClick === 2) {
          // Case: {colorA:1, colorB:1} and colorA is clicked -> deselect colorA
          nextValue = 0
        } else if (differentColorsBeforeClick === 3 && totalSelectedBeforeClick === 3) {
          // Case: {colorA:1, colorB:1, colorC:1} and colorA is clicked -> deselect colorA
          nextValue = 0
        } else {
          // If it's 1 and not part of a "full" set of different gems, cycle to 2
          nextValue = 2
        }
      } else {
        // currentSelectedCount === 2
        // If currently 2, deselect
        nextValue = 0
      }
      // Calculate potential new state for validation
      const tempSelected = { ...newSelected, [color]: nextValue }
      const totalSelectedAfterClick = Object.values(tempSelected).reduce((sum, val) => sum + val, 0)
      const differentColorsAfterClick = Object.values(tempSelected).filter((val) => val > 0).length
      // Validation for adding gems (if nextValue > 0)
      if (nextValue > 0) {
        // Rule 3: Cannot take more than 3 total gems
        if (totalSelectedAfterClick > 3) return prev
        // Rule 4: Cannot take 2 of the same color if supply < 4
        if (nextValue === 2 && prev.gems[color] < 4) return prev
        // Rule 5: Cannot take permata lebih dari yang tersedia di persediaan
        if (nextValue > prev.gems[color]) return prev
        // Rule 2: If taking 2 of the same color, cannot take other gems
        // This means if nextValue is 2, differentColorsAfterClick must be 1
        if (nextValue === 2 && differentColorsAfterClick > 1) return prev
        // New Rule: Player cannot have more than 10 total gems after taking
        const netChangeForThisColor = nextValue - currentSelectedCount
        if (currentTotalPlayerGems + netChangeForThisColor > 10) {
          return prev
        }
      }
      // If all validations pass, update selected gems
      newSelected[color] = nextValue
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
              <p className="text-slate-300 text-lg">Permainan Pedagang Renaissance</p>
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
                    <span>Mabarrrr</span>
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
              Made with <span className=" hint text-gray-100 animate-pulse ">♥</span> by{" "}
              <span className="hint text-gray-100">rizal</span>
            </p>
          </div>
        </div>
      </div>
    )
  }
  const currentPlayer = gameState.players[gameState.currentPlayer]
  const currentPlayerBonuses = calculatePlayerBonuses(currentPlayer)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-2 md:p-4">
      <div className="max-w-full mx-auto space-y-4">
        {" "}
        {/* Changed max-w-7xl to max-w-full */}
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
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {" "}
          {/* Changed xl:col-span-4 to xl:col-span-5 */}
          {/* Players Side by Side */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-2">
            {/* Current Player */}
            <Card
              className={`${gameState.currentPlayer === 0 ? "ring-2 ring-blue-600 bg-blue-100 animate-pulse" : "bg-white"} shadow-lg transition-all duration-800`}
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
                  <h4 className="font-semibold mb-2 text-sm text-gray-600 flex items-center justify-between">
                    Permata
                    <span className="ml-2 text-xs text-gray-700 font-semibold">
                      Total: {getTotalGems(gameState.players[0].gems)}
                    </span>
                  </h4>
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
                    <h4 className="font-semibold mb-2 text-sm text-gray-600 flex items-center gap-2">
                      Cadangan
                      <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-semibold">
                        {gameState.players[0].reservedCards.length}
                      </span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 justify-items-center">
                      {gameState.players[0].reservedCards.map((card) => (
                        <div
                          key={card.id}
                          className="relative hover:z-50 z-10 hover:scale-100 transition-all duration-200"
                        >
                          <DevelopmentCardComponent
                            card={card}
                            canBuy={canAffordCard(gameState.players[0], card)}
                            onBuy={() => {
                              setGameState((prev) => {
                                const newState = buyReservedCardLogic(prev, gameState.currentPlayer, card)
                                return {
                                  ...newState,
                                  currentPlayer: (newState.currentPlayer + 1) % 2,
                                  lastBotAction: null,
                                }
                              })
                            }}
                            showActions={!currentPlayer.isBot && !gameState.winner}
                            animatingCardId={gameState.animatingCard}
                            isReserved={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Opponent */}
            <Card
              className={`${gameState.currentPlayer === 1 ? "ring-2 ring-blue-600 bg-blue-100 animate-pulse" : "bg-white"} shadow-lg transition-all duration-800`}
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
                  <h4 className="font-semibold mb-2 text-sm text-gray-600 flex items-center justify-between">
                    Permata
                    <span className="ml-2 text-xs text-gray-700 font-semibold">
                      Total: {getTotalGems(gameState.players[1].gems)}
                    </span>
                  </h4>
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
                    <h4 className="font-semibold mb-2 text-sm text-gray-600 flex items-center gap-2">
                      Cadangan
                     
                      <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-semibold">
                        {gameState.players[1].reservedCards.length}
                      </span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 justify-items-center">
                      {gameState.players[1].reservedCards.map((card) => (
                        <DevelopmentCardComponent
                          key={card.id}
                          card={card}
                          canBuy={canAffordCard(gameState.players[1], card)}
                          onBuy={() => {
                            setGameState((prev) => {
                              const newState = buyReservedCardLogic(prev, gameState.currentPlayer, card)
                              return {
                                ...newState,
                                currentPlayer: (newState.currentPlayer + 1) % 2,
                                lastBotAction: null,
                              }
                            })
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
          <div className="xl:col-span-3 sm:col-span-1">
            {" "}
            {/* Changed xl:col-span-2 to xl:col-span-3 */}
            <Card className="shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardContent className="space-y-6 mt-4">
                {/* Development Cards */}
                <div className="space-y-4">
                  {(["tier3", "tier2", "tier1"] as const).map((tier) => (
                    <div key={tier}>
                      <h4 className="font-semibold text-2xl mb-3 flex items-center gap-2">
                        <Diamond className="w-5 h-5 text-blue-600" />
                        {tier === "tier3" ? "Tingkat 3" : tier === "tier2" ? "Tingkat 2" : "Tingkat 1"}
                      </h4>
                      <div className="flex items-end gap-4 pb-2 justify-center">
                        {/* Deck Counter */}
                        <DeckCounter
                          count={gameState.decks[tier].length}
                        />
                        {/* Card Slots */}
                        {gameState.availableCards[tier].map((card, index) => {
                          // Cek apakah card ini sudah di-reserved oleh siapapun
                          const isReservedByAnyone =
                            card &&
                            gameState.players.some((player) =>
                              player.reservedCards.some((reserved) => reserved.id === card.id)
                            )

                          return (
                            <div key={card ? card.id : `empty-${tier}-${index}`} className="flex-shrink-0">
                              <CardSlot
                                card={isReservedByAnyone ? null : card}
                                tier={tier}
                                canBuy={card && !isReservedByAnyone ? canAffordCard(currentPlayer, card) : false}
                                onBuy={
                                  card && !isReservedByAnyone
                                    ? () => {
                                        setGameState((prev) => {
                                          const newState = buyCardLogic(prev, gameState.currentPlayer, card, tier, index)
                                          return {
                                            ...newState,
                                            currentPlayer: (newState.currentPlayer + 1) % 2,
                                            lastBotAction: null,
                                          }
                                        })
                                      }
                                    : undefined
                                }
                                onReserve={
                                  card && !isReservedByAnyone
                                    ? () => {
                                        if (gameState.gems.gold > 0) {
                                          setGameState((prev) => {
                                            const newState = reserveCardLogic(
                                              prev,
                                              gameState.currentPlayer,
                                              card,
                                              tier,
                                              index,
                                            )
                                            return {
                                              ...newState,
                                              currentPlayer: (newState.currentPlayer + 1) % 2,
                                              lastBotAction: null,
                                            }
                                          })
                                        }
                                      }
                                    : undefined
                                }
                                showActions={!currentPlayer.isBot && !gameState.winner}
                                animatingCardId={gameState.animatingCard}
                                index={index}
                              />
                            </div>
                          )
                        })}
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
                    {/* Selected Gems Display (clickable GemTokens) */}
                    <div className="flex gap-2 justify-center mb-4">
                      {GEM_COLORS.map((color) => (
                        <div key={color} className="text-center">
                          <button
                            type="button"
                            className={`
                        relative flex flex-col items-center justify-center p-1 rounded-full
                        ${gameState.gems[color] === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        ${gameState.selectedGems[color] > 0 ? "" : ""}
                        transition-all duration-200
                      `}
                            onClick={() => updateSelectedGems(color)}
                            disabled={gameState.gems[color] === 0}
                          >
                            <GemToken color={color} count={gameState.selectedGems[color]} size="normal" />
                            <p className="text-xs text-gray-600 mt-1">Dipilih: {gameState.selectedGems[color]}</p>
                          </button>
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
                        <li>Total permata tidak boleh lebih dari 10</li>
                      </ul>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => {
                          setGameState((prev) => {
                            const newState = takeGemsLogic(prev, gameState.currentPlayer, gameState.selectedGems)
                            gemCollectSound.current?.play() // Play sound
                            return {
                              ...newState,
                              currentPlayer: (newState.currentPlayer + 1) % 2,
                              lastBotAction: null,
                            }
                          })
                        }}
                        disabled={
                          !canTakeSelectedGems() ||
                          getTotalGems(currentPlayer.gems) +
                            Object.values(gameState.selectedGems).reduce((a, b) => a + b, 0) >
                            10
                        }
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
              Made with <span className=" hint text-gray-100">♥</span> by{" "}
              <span className="hint text-gray-100">rizal</span>
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
    .xl\\:col-span-1, .xl\\:col-span-2, .xl\\:col-span-3 { /* Added xl:col-span-3 */
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
