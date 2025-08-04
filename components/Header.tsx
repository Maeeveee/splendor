import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gem, Trophy, User, Bot, Brain } from "lucide-react"

export default function Header({ 
  gameState, 
  currentPlayer, 
  setGameState, 
  setPendingMode, 
  initialGameState
}: any) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-lg p-4 shadow-lg shadow-pink-100 border border-pink-200 animate-slide-down">
      <div className="flex items-center gap-3">
        <Gem className="w-8 h-8 text-pink-600 animate-pulse" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          Splendor
        </h1>
      </div>
      {gameState.winner !== null ? (
        <div className="flex items-center gap-3 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg animate-bounce border border-yellow-200">
          <Trophy className="w-8 h-8" />
          <span className="font-bold text-xl">{gameState.players[gameState.winner].name} Menang!</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="font-semibold text-pink-700">Giliran Saat Ini:</span>
          <Badge
            variant={currentPlayer.isBot ? "secondary" : "default"}
            className={`px-3 py-1 text-sm animate-pulse ${
              currentPlayer.isBot 
                ? "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200"
                : "bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200"
            }`}
          >
            {currentPlayer.isBot ? <Bot className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
            {currentPlayer.name}
          </Badge>
          {gameState.botThinking && (
            <div className="flex items-center gap-2 text-pink-600 bg-pink-50 px-3 py-1 rounded-lg border border-pink-200">
              <Brain className="w-4 h-4 animate-spin" />
              <span className="text-sm animate-pulse">{gameState.botThinkingStage}</span>
            </div>
          )}
        </div>
      )}
      <Button
        variant="outline"
        onClick={() => {
          setGameState(initialGameState)
          setPendingMode(null)
        }}
        className="bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-300 hover:border-rose-400 transition-colors duration-200"
      >
        Permainan Baru
      </Button>
    </div>
  )
}