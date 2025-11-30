import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gem } from "lucide-react"
import GemToken from "./GemToken"

const GEM_COLORS = ["white", "blue", "green", "red", "black"] as const

const GemSupply = ({
  gameState,
  currentPlayer,
  updateSelectedGems,
  canTakeSelectedGems,
  getTotalGems,
  onTakeGems,
  onClearSelectedGems
}: any) => {
  return (
    <Card className="shadow-lg bg-white w-full max-w-full sm:max-w-3xl mx-auto mt-2 p-4">
      <CardContent className="p-0">
        <div className="mt-1">
          <div className="flex gap-2 justify-center">
            {[...GEM_COLORS, "gold" as const].map((color) => (
              <div key={color} className="flex flex-col items-center justify-center">
                <button
                  type="button"
                  className={`${gameState.gems[color] === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} transition-all duration-200 transform hover:scale-110`}
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
                    size="normal"
                  />
                </button>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  {gameState.gems[color]}
                </p>
              </div>
            ))}
          </div>
          {!currentPlayer.isBot && !gameState.winner && (
            <div className="flex gap-2 justify-center mt-3">
              <Button
                onClick={() => onTakeGems(gameState.selectedGems)}
                disabled={
                  !canTakeSelectedGems() ||
                  getTotalGems(currentPlayer.gems) +
                  Object.values(gameState.selectedGems).reduce((a: number, b: number) => a + b, 0) > 10
                }
                className="bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105 h-10 text-sm px-4"
              >
                <Gem className="w-4 h-4 mr-2" />
                Ambil
              </Button>
              <Button
                variant="outline"
                onClick={onClearSelectedGems}
                disabled={Object.values(gameState.selectedGems).every((count) => count === 0)}
                className="transition-all duration-200 hover:scale-105 h-10 text-sm px-4"
              >
                Hapus
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default GemSupply