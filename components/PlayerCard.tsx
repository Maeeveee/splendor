import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Bot, Star } from "lucide-react"
import GemToken from "./GemToken"
import DevelopmentCardComponent from "./DevelopmentCard"

const GEM_COLORS = ["white", "blue", "green", "red", "black"] as const

const getGemColor = (color: string) => {
  const colors = {
    white: "bg-gray-100 border-gray-400 text-gray-800",
    blue: "bg-blue-500 border-blue-600 text-white",
    green: "bg-green-500 border-green-600 text-white",
    red: "bg-red-500 border-red-600 text-white",
    black: "bg-gray-800 border-gray-900 text-white",
    gold: "bg-yellow-400 border-yellow-500 text-black",
  }
  return colors[color as keyof typeof colors]
}

const PlayerCard = ({ 
  player, 
  isCurrentPlayer, 
  canAffordCard, 
  buyReservedCardLogic, 
  setGameState, 
  gameState,
  currentPlayer 
}: any) => {
  const getTotalGems = (playerGems: any) =>
    GEM_COLORS.reduce((sum, color) => sum + playerGems[color], 0) + playerGems.gold

  return (
    <Card
      className={`${isCurrentPlayer ? "ring-2 ring-blue-600 bg-blue-50 shadow-lg shadow-blue-200" : "bg-white"} shadow-md transition-all duration-300`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {player.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
          <span className="truncate">{player.name}</span>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 ml-auto">
            <Star className="w-3 h-3 mr-1" />
            {player.points}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-medium mb-2 text-xs text-gray-600 flex items-center justify-between">
            Permata
            <span className="text-xs text-gray-700 font-medium">
              Total: {getTotalGems(player.gems)}
            </span>
          </h4>
          <div className="grid grid-cols-6 gap-2 place-items-center">
            {[...GEM_COLORS, "gold" as const].map((color) => (
              <div key={color} className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 flex items-center justify-center">
                  <GemToken color={color} count={player.gems[color]} size="small" />
                </div>
                <span className="text-xs text-gray-500 font-medium min-w-[16px] text-center">
                  {player.gems[color]}
                </span>
              </div>
            ))}
          </div>
        </div>

<div>
  <h4 className="font-medium mb-2 text-xs text-gray-600">Bonus</h4>
  <div className="grid grid-cols-5 gap-2 place-items-center">
    {GEM_COLORS.map((color) => {
      const count = player.cards.filter((card: any) => card.provides === color).length
      return (
        <div key={color} className="flex flex-col items-center space-y-1">
          <div
            className={`w-6 h-8 rounded border-2 ${getGemColor(color)} flex items-center justify-center text-xs font-bold`}
          >
            {count}
          </div>
        </div>
      )
    })}
  </div>
</div>

        {player.reservedCards.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-xs text-gray-600 flex items-center gap-2">
              Cadangan
              <span className="bg-blue-100 text-blue-700 rounded px-1 py-0.5 text-xs font-medium">
                {player.reservedCards.length}
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {player.reservedCards.map((card: any) => (
                <div key={card.id} className="w-full">
                  <DevelopmentCardComponent
                    card={card}
                    canBuy={canAffordCard(player, card)}
                    onBuy={() => {
                      setGameState((prev: any) => {
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
                    size="mini"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PlayerCard