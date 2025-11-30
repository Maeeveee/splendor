import { useState, useEffect, useRef, useCallback } from "react"
import { GameState, Player, DevelopmentCard, Noble, GemColor, GEM_COLORS, GameHistory } from "@/lib/types"
import { DEVELOPMENT_CARDS, NOBLES } from "@/lib/data"

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
    gameStartTime: 0,
    turnCount: 0,
}

export function useSplendorGame() {
    const [gameState, setGameState] = useState<GameState>(initialGameState)
    const [botNotif, setBotNotif] = useState<string | null>(null)
    const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
    const [isSoundEnabled, setIsSoundEnabled] = useState(true)

    const gemCollectSound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/gem-collect.wav") : null)
    const cardBuySound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/card-buy.wav") : null)
    const cardReserveSound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/card-reserve.mp3") : null)
    const gameWinSound = useRef(typeof Audio !== "undefined" ? new Audio("/sounds/game-win.wav") : null)

    const playSound = useCallback((sound: React.MutableRefObject<HTMLAudioElement | null>) => {
        if (isSoundEnabled && sound.current) {
            sound.current.currentTime = 0
            sound.current.play().catch(() => { })
        }
    }, [isSoundEnabled])

    // Load game state from local storage on mount
    useEffect(() => {
        const savedState = localStorage.getItem("splendorGameState")
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState)
                // Only restore if game is in progress
                if (parsed.gameMode !== "menu" && parsed.winner === null) {
                    setGameState(parsed)
                }
            } catch (e) {
                console.error("Failed to load saved game state", e)
            }
        }

        const savedHistory = localStorage.getItem("splendorGameHistory")
        if (savedHistory) {
            try {
                setGameHistory(JSON.parse(savedHistory))
            } catch (e) {
                console.error("Failed to load game history", e)
            }
        }
    }, [])

    // Save game state to local storage whenever it changes
    useEffect(() => {
        if (gameState.gameMode !== "menu" && gameState.winner === null) {
            localStorage.setItem("splendorGameState", JSON.stringify(gameState))
        } else if (gameState.winner !== null || gameState.gameMode === "menu") {
            localStorage.removeItem("splendorGameState")
        }
    }, [gameState])

    useEffect(() => {
        if (gameState.lastBotAction) {
            setBotNotif(gameState.lastBotAction)
            const timer = setTimeout(() => setBotNotif(null), 2500)
            return () => clearTimeout(timer)
        }
    }, [gameState.lastBotAction])

    useEffect(() => {
        if (gameState.winner !== null) {
            saveGameHistory(gameState)
            setTimeout(() => {
                setGameHistory(getGameHistory())
            }, 100)
        }
    }, [gameState.winner])

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

        // Standard Rule: Only 1 noble per turn
        const eligibleNobleIndex = updatedAvailableNobles.findIndex((noble) =>
            GEM_COLORS.every((color) => bonuses[color] >= noble.requirements[color])
        )

        if (eligibleNobleIndex !== -1) {
            const noble = updatedAvailableNobles[eligibleNobleIndex]
            newPlayerNobles.push(noble)
            playerPointsGained += noble.points
            updatedAvailableNobles.splice(eligibleNobleIndex, 1)
        }

        return { newPlayerNobles, updatedAvailableNobles, playerPointsGained }
    }

    const finalizeTurn = (state: GameState): GameState => {
        const newState = { ...state }
        const prevPlayer = newState.currentPlayer

        newState.turnCount = state.turnCount + 1
        newState.currentPlayer = (prevPlayer + 1) % 2

        // Check end game condition only when Player 1 (second player) finishes their turn
        // This ensures both players have equal turns (completing the round)
        if (prevPlayer === 1) {
            const p1Points = newState.players[0].points
            const p2Points = newState.players[1].points

            if (p1Points >= 15 || p2Points >= 15) {
                if (p1Points > p2Points) {
                    newState.winner = 0
                } else if (p2Points > p1Points) {
                    newState.winner = 1
                } else {
                    // Tie-breaker: Fewest development cards
                    const p1Cards = newState.players[0].cards.length
                    const p2Cards = newState.players[1].cards.length
                    if (p1Cards < p2Cards) {
                        newState.winner = 0
                    } else if (p2Cards < p1Cards) {
                        newState.winner = 1
                    } else {
                        // Ultimate tie-breaker: Player 2 wins (or draw? Standard rules say shared victory or specific house rules, but usually P2 advantage in some variants. Let's stick to P1 for now or just first player? Actually standard rules say "If there is a tie, the player with the fewest development cards wins." If still tied, it's a draw or shared. Let's default to 0 for simplicity or maybe null/draw if we supported it. Let's give it to 0 as fallback.)
                        newState.winner = 0
                    }
                }
                playSound(gameWinSound)
            }
        }

        return newState
    }

    const initializeGame = (mode: "pvp" | "pve", name1: string, name2: string) => {
        const shuffledTier1 = shuffleArray(DEVELOPMENT_CARDS.tier1)
        const shuffledTier2 = shuffleArray(DEVELOPMENT_CARDS.tier2)
        const shuffledTier3 = shuffleArray(DEVELOPMENT_CARDS.tier3)
        const shuffledNobles = shuffleArray(NOBLES)

        const players: Player[] = [
            {
                id: 0,
                name: name1,
                isBot: false,
                gems: { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0 },
                cards: [],
                reservedCards: [],
                nobles: [],
                points: 0,
            },
            {
                id: 1,
                name: name2,
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
            gameStartTime: Date.now(),
            turnCount: 0,
        })
    }

    const buyCardLogic = (
        prev: GameState,
        playerId: number,
        card: DevelopmentCard,
        tier: keyof GameState["availableCards"],
        cardIndex: number,
    ): GameState => {
        if (playerId === 0) {
            playSound(cardBuySound)
        }

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
            // Removed immediate win check
        }

        newState.animatingCard = card.id

        return finalizeTurn(newState)
    }

    const buyReservedCardLogic = (prev: GameState, playerId: number, card: DevelopmentCard): GameState => {
        if (playerId === 0) {
            playSound(cardBuySound)
        }

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
            // Removed immediate win check
        }

        newState.animatingCard = card.id

        return finalizeTurn(newState)
    }

    const reserveCardLogic = (
        prev: GameState,
        playerId: number,
        card: DevelopmentCard,
        tier: keyof GameState["availableCards"],
        cardIndex: number,
    ): GameState => {
        if (playerId === 0) {
            playSound(cardReserveSound)
        }

        const newState = { ...prev }
        const players = [...newState.players]
        const player = { ...players[playerId] }

        if (player.reservedCards.length >= 3) {
            return prev
        }

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

        return finalizeTurn(newState)
    }

    const takeGemsLogic = (prev: GameState, playerId: number, selectedGems: Record<GemColor, number>): GameState => {
        if (playerId === 0) {
            playSound(gemCollectSound)
        }

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

        return finalizeTurn(newState)
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
                    // Prioritize cards that help with nobles or give high points
                    reservableCards.sort((a, b) => {
                        // Simple heuristic: points + (helps with noble ? 2 : 0)
                        const aScore = a.card.points
                        const bScore = b.card.points
                        return bScore - aScore
                    })

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
                        need: Math.max(0, 3 - bonuses[color]), // Simplified need calculation
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

                // Prefer buying if possible
                if (buyActions.length > 0) {
                    buyActions.sort((a, b) => b.card.points - a.card.points)
                    chosenAction = buyActions[0]
                } else if (nonBuyActions.length > 0) {
                    // Prefer reserving high value cards if can't buy
                    const reserveActions = nonBuyActions.filter(a => a.type === 'reserve')
                    if (reserveActions.length > 0 && Math.random() > 0.5) {
                        chosenAction = reserveActions[Math.floor(Math.random() * reserveActions.length)]
                    } else {
                        chosenAction = nonBuyActions[Math.floor(Math.random() * nonBuyActions.length)]
                    }
                }

                if (!chosenAction && possibleActions.length > 0) {
                    chosenAction = possibleActions[Math.floor(Math.random() * possibleActions.length)]
                }

                if (chosenAction) {
                    switch (chosenAction.type) {
                        case "buyReserved":
                            currentBotState = buyReservedCardLogic(currentBotState, 1, chosenAction.card)
                            botAction = `Bot membeli kartu cadangan ${chosenAction.card.provides} untuk ${chosenAction.card.points} poin`
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
                            break
                        case "takeGems":
                            currentBotState = takeGemsLogic(currentBotState, 1, chosenAction.selectedGems)
                            const takenColors = GEM_COLORS.filter((color) => chosenAction.selectedGems[color] > 0)
                            botAction = `Bot mengambil ${takenColors.map((color) => `${chosenAction.selectedGems[color]} ${color}`).join(", ")} permata`
                            break
                    }
                } else {
                    botAction = "Bot melewati giliran"
                    // Force turn change if bot is stuck
                    currentBotState = finalizeTurn(currentBotState)
                }

                const finalState = {
                    ...currentBotState,
                    botThinking: false,
                    botThinkingStage: "",
                    lastBotAction: botAction,
                }

                if (finalState.animatingCard !== null) {
                    setTimeout(() => setGameState((current) => ({ ...current, animatingCard: null })), 500)
                }
                return finalState
            })
        }, 4000)
    }, [gameState, isSoundEnabled])

    useEffect(() => {
        if (gameState.gameMode === "pve" && gameState.currentPlayer === 1 && !gameState.winner && !gameState.botThinking) {
            makeBotMove()
        }
    }, [gameState.currentPlayer, gameState.gameMode, gameState.winner, makeBotMove])

    const saveGameHistory = (gameState: GameState) => {
        if (gameState.winner === null) return

        const endTime = Date.now()
        const duration = Math.floor((endTime - gameState.gameStartTime) / 1000)

        const historyId = `game_${gameState.gameStartTime}_${gameState.winner}`

        const existingHistory = getGameHistory()
        const isDuplicate = existingHistory.some(game => game.id === historyId)

        if (isDuplicate) {
            return
        }

        const history: GameHistory = {
            id: historyId,
            timestamp: endTime,
            gameMode: gameState.gameMode as "pvp" | "pve",
            players: gameState.players.map(player => ({
                name: player.name,
                isBot: player.isBot,
                finalPoints: player.points,
                finalCards: player.cards.length,
                finalNobles: player.nobles.length,
            })),
            winner: {
                id: gameState.winner,
                name: gameState.players[gameState.winner].name,
                points: gameState.players[gameState.winner].points,
            },
            duration,
            totalTurns: gameState.turnCount,
        }

        const updatedHistory = [history, ...existingHistory]
        const limitedHistory = updatedHistory.slice(0, 50)

        localStorage.setItem('splendorGameHistory', JSON.stringify(limitedHistory))
    }

    const getGameHistory = (): GameHistory[] => {
        try {
            const stored = localStorage.getItem('splendorGameHistory')
            return stored ? JSON.parse(stored) : []
        } catch (error) {
            console.warn('Error loading game history:', error)
            return []
        }
    }

    const toggleSound = () => setIsSoundEnabled(prev => !prev)

    return {
        gameState,
        setGameState,
        botNotif,
        gameHistory,
        initializeGame,
        buyCard: (card: DevelopmentCard, tier: keyof GameState["availableCards"], index: number) =>
            setGameState(prev => buyCardLogic(prev, prev.currentPlayer, card, tier, index)),
        reserveCard: (card: DevelopmentCard, tier: keyof GameState["availableCards"], index: number) =>
            setGameState(prev => reserveCardLogic(prev, prev.currentPlayer, card, tier, index)),
        buyReservedCard: (card: DevelopmentCard) =>
            setGameState(prev => buyReservedCardLogic(prev, prev.currentPlayer, card)),
        takeGems: (selectedGems: Record<GemColor, number>) =>
            setGameState(prev => takeGemsLogic(prev, prev.currentPlayer, selectedGems)),
        updateSelectedGems,
        canTakeSelectedGems,
        canAffordCard,
        getTotalGems,
        isSoundEnabled,
        toggleSound
    }
}
