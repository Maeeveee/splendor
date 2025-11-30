"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gem, User, Bot, Trophy } from "lucide-react"

import DevelopmentCardsBoard from "@/components/DevelopmentCardsBoard"
import GemSupply from "@/components/GemSupply"
import NoblesBoard from "@/components/NoblesBoard"
import WinnerModal from "@/components/WinnerModal"
import GameHeader from "@/components/GameHeader"
import BotNotification from "@/components/BotNotification"
import HistoryModal from "@/components/HistoryModal"
import PlayerCard from "@/components/PlayerCard"

import { useSplendorGame } from "@/hooks/useSplendorGame"
import { GameState } from "@/lib/types"

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

export default function SplendorGame() {
  const {
    gameState,
    setGameState,
    botNotif,
    gameHistory,
    initializeGame,
    buyCard,
    reserveCard,
    buyReservedCard,
    takeGems,
    updateSelectedGems,
    canTakeSelectedGems,
    canAffordCard,
    getTotalGems,
    isSoundEnabled,
    toggleSound
  } = useSplendorGame()

  const [pendingMode, setPendingMode] = useState<"pvp" | "pve" | null>(null)
  const [nameInputs, setNameInputs] = useState<{ p1: string; p2: string }>({ p1: "", p2: "" })
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("splendorNames")
    if (stored) setNameInputs(JSON.parse(stored))
  }, [])

  const currentPlayer = gameState.players[gameState.currentPlayer] || gameState.players[0]

  if (gameState.gameMode === "menu") {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <Card className="shadow-2xl border-pink-200 bg-white rounded-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 shadow-pink-100">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-6 px-8">
                <div className="flex items-center gap-3 mb-2">
                  <Gem className="w-10 h-10 text-white" />
                  <h2 className="text-3xl font-bold text-white">Splendor</h2>
                </div>
                <p className="text-pink-100 text-sm">
                  selamat datang di skolah splendor kerajaan
                </p>
              </div>

              <CardContent className="p-8 space-y-8 bg-gradient-to-br from-pink-25 to-rose-25">
                {!pendingMode ? (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-pink-800">Pilih Mode Permainan</h3>
                      <p className="text-pink-600 text-sm mt-1">maen sama gw ataw sama gpt</p>
                    </div>

                    <div className="space-y-4">
                      <Button
                        onClick={() => setPendingMode("pvp")}
                        className="w-full h-20 text-lg font-semibold bg-pink-600 hover:bg-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0"
                      >
                        <div className="flex items-center justify-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center -ml-4">
                              <User className="w-6 h-6 text-pink-600" />
                            </div>
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center absolute -top-2 -right-5">
                              <User className="w-6 h-6 text-pink-600" />
                            </div>
                          </div>
                          <div className="flex flex-col items-start ml-2">
                            <span className="text-xl">Mabarrrr</span>
                            <span className="text-xs text-pink-100">mabar sama gw pliss</span>
                          </div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => setPendingMode("pve")}
                        className="w-full h-20 text-lg font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0"
                      >
                        <div className="flex items-center justify-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-rose-600" />
                            </div>
                            <div className="absolute -right-4 top-1">
                              <div className="text-white font-bold text-xl">VS</div>
                            </div>
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center absolute -top-2 right-[-32px]">
                              <Bot className="w-6 h-6 text-rose-600" />
                            </div>
                          </div>
                          <div className="flex flex-col items-start ml-6">
                            <span className="text-xl">lawan gpt</span>
                            <span className="text-xs text-rose-100">bisa ga lu lawan gpt?</span>
                          </div>
                        </div>
                      </Button>

                      <Button
                        onClick={() => setShowHistory(true)}
                        variant="outline"
                        className="w-full h-16 text-lg font-semibold border-2 border-pink-300 hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 text-pink-700 hover:text-pink-800"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <Trophy className="w-8 h-8 text-pink-600" />
                          <div className="flex flex-col items-start">
                            <span className="text-pink-700">Riwayat & Statistik</span>
                            <span className="text-xs text-pink-500">
                              {gameHistory.length} permainan tersimpan
                            </span>
                          </div>
                        </div>
                      </Button>
                    </div>

                    <div className="text-center text-xs pt-4 border-t border-pink-200">
                      <div className="flex items-center justify-center gap-1 text-sm mt-8">
                        <span className="nothint">Made with</span>
                        <span className="hint">♥ by rizal</span>
                      </div>
                    </div>
                  </>
                ) : pendingMode === "pve" ? (
                  <form
                    className="space-y-6"
                    onSubmit={e => {
                      e.preventDefault()
                      initializeGame("pve", nameInputs.p1 || "Kamu", "Bot")
                      localStorage.setItem("splendorNames", JSON.stringify(nameInputs))
                    }}
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-pink-800">lawan gpt</h3>
                      <p className="text-pink-600 text-sm mt-1">masukin nama sini </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-pink-700">Nama Kamu</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                        <input
                          className="w-full border border-pink-200 rounded-lg pl-10 pr-3 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
                        className="flex-1 bg-rose-500 hover:bg-rose-600 text-white h-12 border-0"
                      >
                        <Trophy className="w-5 h-5 mr-2" /> Mulai Bermain
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPendingMode(null)}
                        className="flex-1 h-12 border-pink-300 text-pink-700 hover:bg-pink-50 hover:text-pink-800"
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
                      initializeGame("pvp", nameInputs.p1 || "Pemain 1", nameInputs.p2 || "Pemain 2")
                      localStorage.setItem("splendorNames", JSON.stringify(nameInputs))
                    }}
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-pink-800">mabarrr</h3>
                      <p className="text-pink-600 text-sm mt-1">masukin nama kalian</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-pink-700">Nama first choice</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                          <input
                            className="w-full border border-pink-200 rounded-lg pl-10 pr-3 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Nama first choice"
                            value={nameInputs.p1}
                            onChange={e => setNameInputs(n => ({ ...n, p1: e.target.value }))
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-pink-700">Nama second choice</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                          <input
                            className="w-full border border-pink-200 rounded-lg pl-10 pr-3 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white h-12 border-0"
                      >
                        <Trophy className="w-5 h-5 mr-2" /> Mulai Bermain
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPendingMode(null)}
                        className="flex-1 h-12 border-pink-300 text-pink-700 hover:bg-pink-50 hover:text-pink-800"
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

        <HistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={gameHistory}
        />
      </>
    )
  }

  return (
    <div className="splendor-game-container">
      <BotNotification botNotif={botNotif} />

      <div className="splendor-max-width splendor-space-y-1">
        <GameHeader
          gameState={gameState}
          currentPlayer={currentPlayer}
          setGameState={setGameState}
          setPendingMode={setPendingMode}
          initialGameState={initialGameState}
          isSoundEnabled={isSoundEnabled}
          toggleSound={toggleSound}
        />

        <div className="splendor-main-grid gap-1 mt-4">
          <div className="splendor-col-left">
            <PlayerCard
              player={gameState.players[0]}
              isCurrentPlayer={gameState.currentPlayer === 0}
              canAffordCard={canAffordCard}
              onBuyReservedCard={buyReservedCard}
              gameState={gameState}
              currentPlayer={currentPlayer}
              className="flex-1"
            />
            <PlayerCard
              player={gameState.players[1]}
              isCurrentPlayer={gameState.currentPlayer === 1}
              canAffordCard={canAffordCard}
              onBuyReservedCard={buyReservedCard}
              gameState={gameState}
              currentPlayer={currentPlayer}
              className="flex-1"
            />

            <div className="splendor-hidden-lg">
              <GemSupply
                gameState={gameState}
                currentPlayer={currentPlayer}
                updateSelectedGems={updateSelectedGems}
                canTakeSelectedGems={canTakeSelectedGems}
                getTotalGems={getTotalGems}
                onTakeGems={takeGems}
                onClearSelectedGems={() => setGameState(prev => ({ ...prev, selectedGems: { white: 0, blue: 0, green: 0, red: 0, black: 0 } }))}
              />
            </div>
          </div>

          <div className="splendor-col-center">
            <DevelopmentCardsBoard
              gameState={gameState}
              currentPlayer={currentPlayer}
              onBuyCard={buyCard}
              onReserveCard={reserveCard}
              canAffordCard={canAffordCard}
            />

            <div className="splendor-hidden-mobile mt-1">
              <GemSupply
                gameState={gameState}
                currentPlayer={currentPlayer}
                updateSelectedGems={updateSelectedGems}
                canTakeSelectedGems={canTakeSelectedGems}
                getTotalGems={getTotalGems}
                onTakeGems={takeGems}
                onClearSelectedGems={() => setGameState(prev => ({ ...prev, selectedGems: { white: 0, blue: 0, green: 0, red: 0, black: 0 } }))}
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