import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gem, Trophy, User, Bot, Brain, Volume2, VolumeX } from "lucide-react"

export default function Header({
  gameState,
  currentPlayer,
  setGameState,
  setPendingMode,
  initialGameState,
  isSoundEnabled,
  toggleSound
}: any) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-2 bg-white rounded-lg p-2 shadow-lg shadow-pink-100 border border-pink-200 animate-slide-down">
      <div className="flex items-center gap-2">
        <Gem className="w-5 h-5 text-pink-600 animate-pulse" />
        <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          Splendor
        </h1>
      </div>
      {gameState.winner !== null ? (
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg animate-bounce border border-yellow-200">
          <Trophy className="w-5 h-5" />
          <span className="font-bold text-sm">{gameState.players[gameState.winner].name} Menang!</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-pink-700 text-xs">Giliran:</span>
          <Badge
            variant={currentPlayer.isBot ? "secondary" : "default"}
            className={`px-2 py-0.5 text-xs animate-pulse ${currentPlayer.isBot
              ? "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200"
              : "bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200"
              }`}
          >
            {currentPlayer.isBot ? <Bot className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
            {currentPlayer.name}
          </Badge>
          {gameState.botThinking && (
            <div className="flex items-center gap-1 text-pink-600 bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-200">
              <Brain className="w-3 h-3 animate-spin" />
              <span className="text-xs animate-pulse">{gameState.botThinkingStage}</span>
            </div>
          )}
        </div>
      )}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="bg-pink-50 hover:bg-pink-100 text-pink-600 border-pink-200 w-7 h-7"
        >
          {isSoundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setGameState(initialGameState)
            setPendingMode(null)
          }}
          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-300 hover:border-rose-400 transition-colors duration-200 h-7 text-xs px-2"
        >
          Baru
        </Button>
      </div>
    </div>
  )
}