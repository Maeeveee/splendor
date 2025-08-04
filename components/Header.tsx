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
        onClick={() => {
          setGameState(initialGameState)
          setPendingMode(null)
        }}
        className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 transition-colors duration-200"
      >
        Permainan Baru
      </Button>
    </div>
  )
}