"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Gem, User, Bot, Trophy, Eye, Diamond, Coins, Star, Brain } from "lucide-react"

import GemToken from "@/components/GemToken"
import DevelopmentCardComponent from "@/components/DevelopmentCard"
import NobleComponent from "@/components/NobleComponent"
import EmptyCardSlot from "@/components/EmptyCardSlot"
import CardSlot from "@/components/CardSlot"
import DeckCounter from "@/components/DeckCounter"
import PlayerCard from "@/components/PlayerCard"
import DevelopmentCardsBoard from "@/components/DevelopmentCardsBoard"
import GemSupply from "@/components/GemSupply"
import NoblesBoard from "@/components/NoblesBoard"
import WinnerModal from "@/components/WinnerModal"
import GameHeader from "@/components/GameHeader"
import BotNotification from "@/components/BotNotification"

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
    { id: 21, cost: { white: 0, blue: 0, green: 0, red: 2, black: 1 }, provides: "white", points: 0 },
    { id: 22, cost: { white: 0, blue: 0, green: 1, red: 1, black: 1 }, provides: "white", points: 0 },
    { id: 23, cost: { white: 0, blue: 0, green: 2, red: 0, black: 2 }, provides: "white", points: 0 },
    { id: 24, cost: { white: 1, blue: 0, green: 0, red: 0, black: 2 }, provides: "white", points: 1 },
    { id: 25, cost: { white: 0, blue: 3, green: 0, red: 0, black: 0 }, provides: "white", points: 1 },
    { id: 26, cost: { white: 1, blue: 0, green: 0, red: 1, black: 2 }, provides: "white", points: 0 },
    { id: 27, cost: { white: 0, blue: 1, green: 0, red: 0, black: 2 }, provides: "white", points: 0 },
    { id: 28, cost: { white: 2, blue: 0, green: 0, red: 2, black: 0 }, provides: "white", points: 0 },
    { id: 29, cost: { white: 1, blue: 0, green: 0, red: 2, black: 0 }, provides: "blue", points: 0 },
    { id: 30, cost: { white: 0, blue: 0, green: 0, red: 1, black: 1 }, provides: "blue", points: 0 },
    { id: 31, cost: { white: 2, blue: 0, green: 0, red: 0, black: 2 }, provides: "blue", points: 0 },
    { id: 32, cost: { white: 0, blue: 1, green: 0, red: 0, black: 2 }, provides: "blue", points: 1 },
    { id: 33, cost: { white: 0, blue: 0, green: 3, red: 0, black: 0 }, provides: "blue", points: 1 },
    { id: 34, cost: { white: 2, blue: 1, green: 0, red: 0, black: 1 }, provides: "blue", points: 0 },
    { id: 35, cost: { white: 2, blue: 0, green: 1, red: 0, black: 0 }, provides: "blue", points: 0 },
    { id: 36, cost: { white: 0, blue: 2, green: 0, red: 0, black: 2 }, provides: "blue", points: 0 },
    { id: 37, cost: { white: 0, blue: 2, green: 0, red: 1, black: 0 }, provides: "green", points: 0 },
    { id: 38, cost: { white: 1, blue: 0, green: 0, red: 0, black: 1 }, provides: "green", points: 0 },
    { id: 39, cost: { white: 0, blue: 2, green: 0, red: 2, black: 0 }, provides: "green", points: 0 },
    { id: 40, cost: { white: 0, blue: 0, green: 1, red: 2, black: 0 }, provides: "green", points: 1 },
    { id: 41, cost: { white: 0, blue: 0, green: 0, red: 3, black: 0 }, provides: "green", points: 1 },
    { id: 42, cost: { white: 1, blue: 1, green: 2, red: 0, black: 0 }, provides: "green", points: 0 },
    { id: 43, cost: { white: 0, blue: 0, green: 2, red: 2, black: 0 }, provides: "green", points: 0 },
    { id: 44, cost: { white: 2, blue: 2, green: 0, red: 0, black: 0 }, provides: "green", points: 0 },
    { id: 45, cost: { white: 2, blue: 0, green: 1, red: 0, black: 0 }, provides: "red", points: 0 },
    { id: 46, cost: { white: 0, blue: 1, green: 0, red: 0, black: 1 }, provides: "red", points: 0 },
    { id: 47, cost: { white: 2, blue: 0, green: 0, red: 0, black: 2 }, provides: "red", points: 0 },
    { id: 48, cost: { white: 2, blue: 0, green: 0, red: 1, black: 0 }, provides: "red", points: 1 },
    { id: 49, cost: { white: 0, blue: 0, green: 0, red: 0, black: 3 }, provides: "red", points: 1 },
    { id: 50, cost: { white: 0, blue: 1, green: 1, red: 2, black: 0 }, provides: "red", points: 0 },
    { id: 51, cost: { white: 0, blue: 0, green: 2, red: 0, black: 2 }, provides: "red", points: 0 },
    { id: 52, cost: { white: 0, blue: 2, green: 2, red: 0, black: 0 }, provides: "red", points: 0 },
    { id: 53, cost: { white: 0, blue: 1, green: 2, red: 0, black: 0 }, provides: "black", points: 0 },
    { id: 54, cost: { white: 1, blue: 0, green: 0, red: 1, black: 0 }, provides: "black", points: 0 },
    { id: 55, cost: { white: 0, blue: 0, green: 2, red: 0, black: 2 }, provides: "black", points: 0 },
    { id: 56, cost: { white: 0, blue: 2, green: 0, red: 0, black: 1 }, provides: "black", points: 1 },
    { id: 57, cost: { white: 3, blue: 0, green: 0, red: 0, black: 0 }, provides: "black", points: 1 },
    { id: 58, cost: { white: 0, blue: 0, green: 1, red: 1, black: 2 }, provides: "black", points: 0 },
    { id: 59, cost: { white: 2, blue: 0, green: 2, red: 0, black: 0 }, provides: "black", points: 0 },
    { id: 60, cost: { white: 2, blue: 2, green: 0, red: 0, black: 0 }, provides: "black", points: 0 },
  ],
  tier2: [
    { id: 61, cost: { white: 3, blue: 2, green: 2, red: 0, black: 0 }, provides: "white", points: 1 },
    { id: 62, cost: { white: 0, blue: 1, green: 4, red: 2, black: 0 }, provides: "white", points: 2 },
    { id: 63, cost: { white: 1, blue: 4, green: 2, red: 0, black: 0 }, provides: "white", points: 2 },
    { id: 64, cost: { white: 0, blue: 0, green: 5, red: 3, black: 0 }, provides: "white", points: 2 },
    { id: 65, cost: { white: 5, blue: 3, green: 0, red: 0, black: 0 }, provides: "white", points: 2 },
    { id: 66, cost: { white: 0, blue: 2, green: 2, red: 3, black: 0 }, provides: "blue", points: 1 },
    { id: 67, cost: { white: 0, blue: 2, green: 1, red: 4, black: 0 }, provides: "blue", points: 2 },
    { id: 68, cost: { white: 0, blue: 0, green: 1, red: 4, black: 2 }, provides: "blue", points: 2 },
    { id: 69, cost: { white: 0, blue: 0, green: 3, red: 5, black: 0 }, provides: "blue", points: 2 },
    { id: 70, cost: { white: 3, blue: 0, green: 0, red: 0, black: 5 }, provides: "blue", points: 2 },
    { id: 71, cost: { white: 0, blue: 3, green: 0, red: 2, black: 2 }, provides: "green", points: 1 },
    { id: 72, cost: { white: 4, blue: 2, green: 0, red: 0, black: 1 }, provides: "green", points: 2 },
    { id: 73, cost: { white: 4, blue: 2, green: 0, red: 1, black: 0 }, provides: "green", points: 2 },
    { id: 74, cost: { white: 5, blue: 3, green: 0, red: 0, black: 0 }, provides: "green", points: 2 },
    { id: 75, cost: { white: 0, blue: 5, green: 0, red: 0, black: 3 }, provides: "green", points: 2 },
    { id: 76, cost: { white: 2, blue: 0, green: 0, red: 2, black: 3 }, provides: "red", points: 1 },
    { id: 77, cost: { white: 1, blue: 0, green: 0, red: 2, black: 4 }, provides: "red", points: 2 },
    { id: 78, cost: { white: 2, blue: 0, green: 1, red: 0, black: 4 }, provides: "red", points: 2 },
    { id: 79, cost: { white: 3, blue: 0, green: 0, red: 0, black: 5 }, provides: "red", points: 2 },
    { id: 80, cost: { white: 0, blue: 0, green: 0, red: 5, black: 3 }, provides: "red", points: 2 },
    { id: 81, cost: { white: 0, blue: 0, green: 3, red: 2, black: 2 }, provides: "black", points: 1 },
    { id: 82, cost: { white: 0, blue: 1, green: 2, red: 0, black: 4 }, provides: "black", points: 2 },
    { id: 83, cost: { white: 2, blue: 0, green: 0, red: 1, black: 4 }, provides: "black", points: 2 },
    { id: 84, cost: { white: 5, blue: 0, green: 0, red: 0, black: 3 }, provides: "black", points: 2 },
    { id: 85, cost: { white: 0, blue: 0, green: 0, red: 3, black: 5 }, provides: "black", points: 2 },
    { id: 86, cost: { white: 0, blue: 5, green: 3, red: 0, black: 0 }, provides: "white", points: 2 },
    { id: 87, cost: { white: 6, blue: 0, green: 0, red: 0, black: 0 }, provides: "white", points: 3 },
    { id: 88, cost: { white: 0, blue: 0, green: 0, red: 6, black: 0 }, provides: "blue", points: 3 },
    { id: 89, cost: { white: 0, blue: 0, green: 6, red: 0, black: 0 }, provides: "green", points: 3 },
    { id: 90, cost: { white: 0, blue: 0, green: 0, red: 0, black: 6 }, provides: "red", points: 3 },
  ],
  tier3: [
    { id: 91, cost: { white: 3, blue: 3, green: 5, red: 3, black: 0 }, provides: "white", points: 3 },
    { id: 92, cost: { white: 7, blue: 0, green: 0, red: 0, black: 0 }, provides: "white", points: 4 },
    { id: 93, cost: { white: 6, blue: 3, green: 0, red: 0, black: 3 }, provides: "white", points: 4 },
    { id: 94, cost: { white: 7, blue: 3, green: 0, red: 0, black: 0 }, provides: "white", points: 5 },
    { id: 95, cost: { white: 0, blue: 3, green: 3, red: 5, black: 3 }, provides: "blue", points: 3 },
    { id: 96, cost: { white: 0, blue: 7, green: 0, red: 0, black: 0 }, provides: "blue", points: 4 },
    { id: 97, cost: { white: 3, blue: 6, green: 0, red: 0, black: 3 }, provides: "blue", points: 4 },
    { id: 98, cost: { white: 0, blue: 7, green: 3, red: 0, black: 0 }, provides: "blue", points: 5 },
    { id: 99, cost: { white: 3, blue: 0, green: 3, red: 3, black: 5 }, provides: "green", points: 3 },
    { id: 100, cost: { white: 0, blue: 0, green: 7, red: 0, black: 0 }, provides: "green", points: 4 },
    { id: 101, cost: { white: 3, blue: 0, green: 6, red: 3, black: 0 }, provides: "green", points: 4 },
    { id: 102, cost: { white: 0, blue: 0, green: 7, red: 3, black: 0 }, provides: "green", points: 5 },
    { id: 103, cost: { white: 5, blue: 3, green: 0, red: 3, black: 3 }, provides: "red", points: 3 },
    { id: 104, cost: { white: 0, blue: 0, green: 0, red: 7, black: 0 }, provides: "red", points: 4 },
    { id: 105, cost: { white: 0, blue: 3, green: 0, red: 6, black: 3 }, provides: "red", points: 4 },
    { id: 106, cost: { white: 0, blue: 0, green: 0, red: 7, black: 3 }, provides: "red", points: 5 },
    { id: 107, cost: { white: 3, blue: 5, green: 3, red: 0, black: 3 }, provides: "black", points: 3 },
    { id: 108, cost: { white: 0, blue: 0, green: 0, red: 0, black: 7 }, provides: "black", points: 4 },
    { id: 109, cost: { white: 0, blue: 0, green: 3, red: 3, black: 6 }, provides: "black", points: 4 },
    { id: 110, cost: { white: 3, blue: 0, green: 0, red: 0, black: 7 }, provides: "black", points: 5 },
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

const initialGameState: GameState = {
  currentPlayer: 0,
  players: [],
  gems: { white: 4, blue: 4, green: 4, red: 4, black: 4, gold: 5 },
  availableCards: {
    tier1: [],
    tier2: [],
    tier3: [],
  },
  decks: {
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
  const [botNotif, setBotNotif] = useState<string | null>(null)
  const [pendingMode, setPendingMode] = useState<"pvp" | "pve" | null>(null)
  const [nameInputs, setNameInputs] = useState<{ p1: string; p2: string }>({ p1: "", p2: "" })

  const gemCollectSound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/gem-collect.mp3") : null)
  const cardBuySound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/card-buy.mp3") : null)
  const cardReserveSound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/card-reserve.mp3") : null)
  const gameWinSound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/game-win.mp3") : null)

  useEffect(() => {
    if (gameState.lastBotAction) {
      setBotNotif(gameState.lastBotAction)
      const timer = setTimeout(() => setBotNotif(null), 2500)
      return () => clearTimeout(timer)
    }
  }, [gameState.lastBotAction])

  useEffect(() => {
    const stored = localStorage.getItem("splendorNames")
    if (stored) setNameInputs(JSON.parse(stored))
  }, [])

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
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

  const getTotalGems = (playerGems: Record<GemColor | "gold", number>) =>
    GEM_COLORS.reduce((sum, color) => sum + playerGems[color], 0) + playerGems.gold

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

  const initializeGame = (mode: "pvp" | "pve", name1?: string, name2?: string) => {
    const p1 = name1?.trim() || (mode === "pve" ? nameInputs.p1 || "Kamu" : nameInputs.p1 || "Pemain 1")
    const p2 = mode === "pve" ? "" : name2?.trim() || nameInputs.p2 || "Pemain 2"

    localStorage.setItem("splendorNames", JSON.stringify({ p1, p2 }))

    const shuffledTier1 = shuffleArray(DEVELOPMENT_CARDS.tier1)
    const shuffledTier2 = shuffleArray(DEVELOPMENT_CARDS.tier2)
    const shuffledTier3 = shuffleArray(DEVELOPMENT_CARDS.tier3)
    const shuffledNobles = shuffleArray(NOBLES)

    const players: Player[] = [
      {
        id: 0,
        name: p1,
        isBot: false,
        gems: { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0 },
        cards: [],
        reservedCards: [],
        nobles: [],
        points: 0,
      },
      {
        id: 1,
        name: mode === "pve" ? "Bot" : p2,
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
      gems: { white: 4, blue: 4, green: 4, red: 4, black: 4, gold: 5 },
      availableCards: {
        tier1: shuffledTier1.slice(0, 4),
        tier2: shuffledTier2.slice(0, 4),
        tier3: shuffledTier3.slice(0, 4),
      },
      decks: {
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

  const buyCardLogic = (
    prev: GameState,
    playerId: number,
    card: DevelopmentCard,
    tier: keyof GameState["availableCards"],
    cardIndex: number,
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
      tier1: [...prev.decks.tier1],
      tier2: [...prev.decks.tier2],
      tier3: [...prev.decks.tier3],
    }

    if (newDecks[tier].length > 0) {
      newAvailableCards[tier] = [...newAvailableCards[tier]]
      newAvailableCards[tier][cardIndex] = newDecks[tier].shift()!
    } else {
      newAvailableCards[tier] = [...newAvailableCards[tier]]
      newAvailableCards[tier][cardIndex] = null
    }
    newState.availableCards = newAvailableCards
    newState.decks = newDecks

    const { newPlayerNobles, updatedAvailableNobles, playerPointsGained } = checkNobleVisitsImmutable(
      player,
      newState.availableNobles,
    )
    player.nobles = newPlayerNobles
    player.points += playerPointsGained
    newState.availableNobles = updatedAvailableNobles

    if (player.points >= 15) {
      newState.winner = playerId
      gameWinSound.current?.play()
    }

    newState.animatingCard = card.id

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
      gameWinSound.current?.play()
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

    let currentTotalPlayerGems = getTotalGems(newPlayerGems)
    const maxGems = 10

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

    newState.selectedGems = { white: 0, blue: 0, green: 0, red: 0, black: 0 }

    return newState
  }

  const reserveCardLogic = (
    prev: GameState,
    playerId: number,
    card: DevelopmentCard,
    tier: keyof GameState["availableCards"],
    cardIndex: number,
  ): GameState => {
    const newState = { ...prev }
    const players = [...newState.players]
    const player = { ...players[playerId] }
    players[playerId] = player
    newState.players = players

    player.reservedCards = [...player.reservedCards, card]

    const newGemsSupply = { ...newState.gems }
    const newPlayerGems = { ...player.gems }

    if (newGemsSupply.gold > 0 && getTotalGems(newPlayerGems) < 10) {
      newPlayerGems.gold++
      newGemsSupply.gold--
    }
    player.gems = newPlayerGems
    newState.gems = newGemsSupply

    const newAvailableCards = { ...newState.availableCards }
    const newDecks = {
      tier1: [...prev.decks.tier1],
      tier2: [...prev.decks.tier2],
      tier3: [...prev.decks.tier3],
    }

    if (newDecks[tier].length > 0) {
      newAvailableCards[tier] = [...newAvailableCards[tier]]
      newAvailableCards[tier][cardIndex] = newDecks[tier].shift()!
    } else {
      newAvailableCards[tier] = [...newAvailableCards[tier]]
      newAvailableCards[tier][cardIndex] = null
    }
    newState.availableCards = newAvailableCards
    newState.decks = newDecks

    return newState
  }

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
        nextValue = 1
      } else if (currentSelectedCount === 1) {
        if (differentColorsBeforeClick === 2 && totalSelectedBeforeClick === 2) {
          nextValue = 0
        } else if (differentColorsBeforeClick === 3 && totalSelectedBeforeClick === 3) {
          nextValue = 0
        } else {
          nextValue = 2
        }
      } else {
        nextValue = 0
      }

      const alreadyTwoOfSame = Object.entries(newSelected).some(
        ([k, v]) => v === 2 && k !== color
      )
      if (alreadyTwoOfSame && currentSelectedCount === 0) {
        return prev
      }

      const tempSelected = { ...newSelected, [color]: nextValue }
      const totalSelectedAfterClick = Object.values(tempSelected).reduce((sum, val) => sum + val, 0)
      const differentColorsAfterClick = Object.values(tempSelected).filter((val) => val > 0).length
      
      if (nextValue > 0) {
        if (totalSelectedAfterClick > 3) return prev
        if (nextValue === 2 && prev.gems[color] < 4) return prev
        if (nextValue > prev.gems[color]) return prev
        if (nextValue === 2 && differentColorsAfterClick > 1) return prev
        const netChangeForThisColor = nextValue - currentSelectedCount
        if (currentTotalPlayerGems + netChangeForThisColor > 10) {
          return prev
        }
      }
      newSelected[color] = nextValue
      return { ...prev, selectedGems: newSelected }
    })
  }

  const canTakeSelectedGems = () => {
    const totalSelected = Object.values(gameState.selectedGems).reduce((sum, val) => sum + val, 0)
    const differentColors = Object.values(gameState.selectedGems).filter((val) => val > 0).length
    if (totalSelected === 0) return false
    if (totalSelected > 3) return false
    
    const twoOfAKindGemTake = Object.entries(gameState.selectedGems).find(([_, count]) => count === 2)
    if (twoOfAKindGemTake) {
      return differentColors === 1 && gameState.gems[twoOfAKindGemTake[0] as GemColor] >= 4
    }
    
    return differentColors <= 3 && totalSelected <= 3
  }

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

        const possibleActions: Array<
          | { type: "buyReserved"; card: DevelopmentCard }
          | { type: "buyAvailable"; card: DevelopmentCard; tier: keyof GameState["availableCards"]; index: number }
          | { type: "reserve"; card: DevelopmentCard; tier: keyof GameState["availableCards"]; index: number }
          | { type: "takeGems"; selectedGems: Record<GemColor, number> }
        > = []

        const affordableReservedCards = botPlayer.reservedCards.filter((card) => canAffordCard(botPlayer, card))
        affordableReservedCards.forEach((card) => possibleActions.push({ type: "buyReserved", card }))

        const allAvailableCards = [
          ...currentBotState.availableCards.tier1.map((card, index) => ({ card, tier: "tier1" as const, index })),
          ...currentBotState.availableCards.tier2.map((card, index) => ({ card, tier: "tier2" as const, index })),
          ...currentBotState.availableCards.tier3.map((card, index) => ({ card, tier: "tier3" as const, index })),
        ].filter(({ card }) => card !== null) as Array<{
          card: DevelopmentCard
          tier: keyof GameState["availableCards"]
          index: number
        }>
        
        const affordableCards = allAvailableCards.filter(({ card }) => canAffordCard(botPlayer, card))
        affordableCards.forEach(({ card, tier, index }) =>
          possibleActions.push({ type: "buyAvailable", card, tier, index }),
        )

        if (botPlayer.reservedCards.length < 3) {
          const reservableCards = allAvailableCards.filter(
            ({ card }) => !botPlayer.reservedCards.some((rc) => rc.id === card.id),
          )
          reservableCards.sort((a, b) => b.card.points - a.card.points)
          reservableCards.slice(0, Math.min(reservableCards.length, 5)).forEach(({ card, tier, index }) => {
            if (getTotalGems(botPlayer.gems) < 10 || currentBotState.gems.gold === 0) {
              possibleActions.push({ type: "reserve", card, tier, index })
            }
          })
        }

        const strategicGemTake = (() => {
          const bonuses = calculatePlayerBonuses(botPlayer)
          const gemPriority = GEM_COLORS.map((color) => ({
            color,
            need: Math.max(0, 3 - bonuses[color]),
          })).sort((a, b) => b.need - a.need)
          const selected = { white: 0, blue: 0, green: 0, red: 0, black: 0 } as Record<GemColor, number>
          let count = 0
          for (const { color } of gemPriority) {
            if (count < 3 && currentBotState.gems[color] > 0) {
              selected[color] = 1
              count++
            }
          }
          if (getTotalGems(botPlayer.gems) + count <= 10) {
            return count > 0 ? selected : null
          }
          return null
        })()

        const twoOfAKindGemTake = (() => {
          const colorsWithFourPlus = GEM_COLORS.filter((color) => currentBotState.gems[color] >= 4)
          if (colorsWithFourPlus.length > 0) {
            const selected = { white: 0, blue: 0, green: 0, red: 0, black: 0 } as Record<GemColor, number>
            const chosenColor = colorsWithFourPlus[Math.floor(Math.random() * colorsWithFourPlus.length)]
            selected[chosenColor] = 2
            if (getTotalGems(botPlayer.gems) + 2 <= 10) {
              return selected
            }
          }
          return null
        })()

        if (strategicGemTake) possibleActions.push({ type: "takeGems", selectedGems: strategicGemTake })
        if (twoOfAKindGemTake) possibleActions.push({ type: "takeGems", selectedGems: twoOfAKindGemTake })

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

        const randomDecisionChance = 0.35
        if (buyActions.length > 0 && Math.random() > randomDecisionChance) {
          buyActions.sort((a, b) => b.card.points - a.card.points)
          const topPoint = buyActions[0].card.points
          const bestBuyOptions = buyActions.filter((a) => a.card.points === topPoint)
          chosenAction = bestBuyOptions[Math.floor(Math.random() * bestBuyOptions.length)]
        } else if (nonBuyActions.length > 0) {
          chosenAction = nonBuyActions[Math.floor(Math.random() * nonBuyActions.length)]
        } else if (buyActions.length > 0) {
          chosenAction = buyActions[Math.floor(Math.random() * buyActions.length)]
        }

        if (!chosenAction && possibleActions.length > 0) {
          chosenAction = possibleActions[Math.floor(Math.random() * possibleActions.length)]
        }

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

        const finalState = {
          ...currentBotState,
          botThinking: false,
          botThinkingStage: "",
          lastBotAction: botAction,
          currentPlayer: (currentBotState.currentPlayer + 1) % 2,
        }

        if (finalState.animatingCard !== null) {
          setTimeout(() => setGameState((current) => ({ ...current, animatingCard: null })), 500)
        }
        return finalState
      })
    }, 4000)
  }, [gameState, gemCollectSound, cardBuySound, cardReserveSound, gameWinSound])

  useEffect(() => {
    if (gameState.gameMode === "pve" && gameState.currentPlayer === 1 && !gameState.winner && !gameState.botThinking) {
      makeBotMove()
    }
  }, [gameState.currentPlayer, gameState.gameMode, gameState.winner, makeBotMove])

  const currentPlayer = gameState.players[gameState.currentPlayer] || gameState.players[0]
  const currentPlayerBonuses = currentPlayer ? calculatePlayerBonuses(currentPlayer) : { white: 0, blue: 0, green: 0, red: 0, black: 0 }

  if (gameState.gameMode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card className="shadow-2xl border-0 bg-white rounded-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
            <div className="bg-pink-800 py-6 px-8">
              <div className="flex items-center gap-3 mb-2">
                <Gem className="w-10 h-10 text-white" />
                <h2 className="text-3xl font-bold text-white">Splendor</h2>
              </div>
              <p className="text-blue-100 text-sm">
                selamat datang di skolah splendor kerajaan
              </p>
            </div>

            <CardContent className="p-8 space-y-8">
              {!pendingMode ? (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Pilih Mode Permainan</h3>
                    <p className="text-gray-500 text-sm mt-1">maen sama gw ataw sama gpt</p>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={() => setPendingMode("pvp")}
                      className="w-full h-20 text-lg font-semibold bg-pink-600 hover:bg-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-center gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center -ml-4">
                            <User className="w-6 h-6 text-[#ff007f]" />
                          </div>
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center absolute -top-2 -right-5">
                            <User className="w-6 h-6 text-[#ff007f]" />
                          </div>
                        </div>
                        <div className="flex flex-col items-start ml-2">
                          <span className="text-xl">Mabarrrr</span>
                          <span className="text-xs text-white">mabar sama gw pliss</span>
                        </div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => setPendingMode("pve")}
                      className="w-full h-20 text-lg font-semibold bg-pink-400 hover:bg-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-center gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-[#ff007f]" />
                          </div>
                          <div className="absolute -right-4 top-1">
                            <div className="text-white font-bold text-xl">VS</div>
                          </div>
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center absolute -top-2 right-[-32px]">
                            <Bot className="w-6 h-6 text-[#ff007f]" />
                          </div>
                        </div>
                        <div className="flex flex-col items-start ml-6">
                          <span className="text-xl">lawan gpt</span>
                          <span className="text-xs text-white">bisa ga lu lawan gpt?</span>
                        </div>
                      </div>
                    </Button>
                  </div>

                  <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <p className="text-center text-sm text-gray-500 mt-8 nothint">
                      Made with <span className=" hint text-white">♥</span> by{" "}
                      <span className="hint text-white">rizal</span>
                    </p>
                  </div>
                </>
              ) : pendingMode === "pve" ? (
                <form
                  className="space-y-6"
                  onSubmit={e => {
                    e.preventDefault()
                    initializeGame("pve", nameInputs.p1)
                  }}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">lawan gpt</h3>
                    <p className="text-gray-500 text-sm mt-1">masukin nama sini </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nama Kamu</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        className="w-full border rounded-lg pl-10 pr-3 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan nama kamu"
                        value={nameInputs.p1}
                        onChange={e => setNameInputs(n => ({ ...n, p1: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-pink-400 hover:bg-pink-700 text-white h-12"
                    >
                      <Trophy className="w-5 h-5 mr-2" /> Mulai Bermain
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPendingMode(null)}
                      className="flex-1 h-12 border-gray-300"
                    >
                      Kembali
                    </Button>
                  </div>
                </form>
              ) : (
                <form
                  className="space-y-6"
                  onSubmit={e => {
                    e.preventDefault()
                    initializeGame("pvp", nameInputs.p1, nameInputs.p2)
                  }}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">mabarrr</h3>
                    <p className="text-gray-500 text-sm mt-1">masukin nama kalian</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Nama first choice</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                        <input
                          className="w-full border rounded-lg pl-10 pr-3 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nama first choice"
                          value={nameInputs.p1}
                          onChange={e => setNameInputs(n => ({ ...n, p1: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Nama second choice</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                        <input
                          className="w-full border rounded-lg pl-10 pr-3 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nama second choice"
                          value={nameInputs.p2}
                          onChange={e => setNameInputs(n => ({ ...n, p2: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white h-12"
                    >
                      <Trophy className="w-5 h-5 mr-2" /> Mulai Bermain
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPendingMode(null)}
                      className="flex-1 h-12 border-gray-300"
                    >
                      Kembali
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="splendor-game-container">
      <BotNotification botNotif={botNotif} />
      
      <div className="splendor-max-width splendor-space-y-4">
        <GameHeader
          gameState={gameState}
          currentPlayer={currentPlayer}
          setGameState={setGameState}
          setPendingMode={setPendingMode}
          initialGameState={initialGameState}
        />
        
        <div className="splendor-main-grid">
          <div className="splendor-col-left">
            <PlayerCard
              player={gameState.players[0]}
              isCurrentPlayer={gameState.currentPlayer === 0}
              canAffordCard={canAffordCard}
              buyReservedCardLogic={buyReservedCardLogic}
              setGameState={setGameState}
              gameState={gameState}
              currentPlayer={currentPlayer}
            />
            <PlayerCard
              player={gameState.players[1]}
              isCurrentPlayer={gameState.currentPlayer === 1}
              canAffordCard={canAffordCard}
              buyReservedCardLogic={buyReservedCardLogic}
              setGameState={setGameState}
              gameState={gameState}
              currentPlayer={currentPlayer}
            />
            
            <div className="splendor-hidden-lg">
              <GemSupply
                gameState={gameState}
                currentPlayer={currentPlayer}
                setGameState={setGameState}
                updateSelectedGems={updateSelectedGems}
                canTakeSelectedGems={canTakeSelectedGems}
                getTotalGems={getTotalGems}
                takeGemsLogic={takeGemsLogic}
                gemCollectSound={gemCollectSound}
              />
            </div>
          </div>
          
          <div className="splendor-col-center">
            <DevelopmentCardsBoard
              gameState={gameState}
              currentPlayer={currentPlayer}
              setGameState={setGameState}
              buyCardLogic={buyCardLogic}
              reserveCardLogic={reserveCardLogic}
              canAffordCard={canAffordCard}
            />
            
            <div className="splendor-hidden-mobile mt-4">
              <GemSupply
                gameState={gameState}
                currentPlayer={currentPlayer}
                setGameState={setGameState}
                updateSelectedGems={updateSelectedGems}
                canTakeSelectedGems={canTakeSelectedGems}
                getTotalGems={getTotalGems}
                takeGemsLogic={takeGemsLogic}
                gemCollectSound={gemCollectSound}
              />
            </div>
          </div>
          
          <div className="splendor-col-right">
            <NoblesBoard
              gameState={gameState}
              currentPlayerBonuses={gameState.players[0]}
            />
          </div>
        </div>
      </div>
      
      {gameState.winner !== null && (
        <WinnerModal
          gameState={gameState}
          setGameState={setGameState}
          setPendingMode={setPendingMode}
          initializeGame={initializeGame}
          initialGameState={initialGameState}
        />
      )}
    </div>
  )
}