import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gem } from "lucide-react"
import GemToken from "./GemToken"

const GEM_COLORS = ["white", "blue", "green", "red", "black"] as const

const GemSupply = ({ 
  gameState, 
  currentPlayer, 
  setGameState, 
  updateSelectedGems, 
  canTakeSelectedGems, 
  getTotalGems, 
  takeGemsLogic, 
  gemCollectSound 
}: any) => {
  return (
    <Card className="shadow-lg bg-white w-full max-w-full sm:max-w-3xl mx-auto mt-4 p-2 sm:p-4">
      <CardContent>
        <div className="mt-4">
          <div className="flex gap-3 justify-center">
            {[...GEM_COLORS, "gold" as const].map((color) => (
              <div key={color} className="flex flex-col items-center justify-center">
                <button
                  type="button"
                  className={`${gameState.gems[color] === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}transition-all duration-200`}
                  onClick={() => {
                    if (
                      color !== "gold" &&
                      gameState.gems[color] > 0 &&
                      !currentPlayer.isBot &&
                      !gameState.winner
                    ) {
                      updateSelectedGems(color)
                    }
                  }}
                  disabled={
                    color === "gold" ||
                    gameState.gems[color] === 0 ||
                    currentPlayer.isBot ||
                    !!gameState.winner
                  }
                >
                  <GemToken
                    color={color}
                    count={gameState.selectedGems[color] > 0 ? gameState.selectedGems[color] : undefined}
                    size="large"
                  />
                </button>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  Persediaan: {gameState.gems[color]}
                </p>
              </div>
            ))}
          </div>
          {!currentPlayer.isBot && !gameState.winner && (
            <div className="flex gap-2 justify-center mt-2">
              <Button
                onClick={() => {
                  setGameState((prev: any) => {
                    const newState = takeGemsLogic(prev, gameState.currentPlayer, gameState.selectedGems)
                    gemCollectSound.current?.play()
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
                  Object.values(gameState.selectedGems).reduce((a: number, b: number) => a + b, 0) > 10
                }
                className="bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
              >
                <Gem className="w-4 h-4 mr-2" />
                Ambil Permata Terpilih
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setGameState((prev: any) => ({
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
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default GemSupply