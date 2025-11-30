import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers } from "lucide-react"
import CardSlot from "./CardSlot"

const DevelopmentCardsBoard = ({
  gameState,
  currentPlayer,
  onBuyCard,
  onReserveCard,
  canAffordCard
}: any) => {
  const tiers = ["tier3", "tier2", "tier1"] as const

  const buyCard = (card: any, tier: string) => {
    const index = gameState.availableCards[tier].findIndex((c: any) => c && c.id === card.id)
    if (index !== -1) {
      onBuyCard(card, tier, index)
    }
  }

  const reserveCard = (card: any, tier: string) => {
    const index = gameState.availableCards[tier].findIndex((c: any) => c && c.id === card.id)
    if (index !== -1) {
      onReserveCard(card, tier, index)
    }
  }

  return (
    <Card className="shadow-lg bg-gradient-to-br from-white to-gray-50 w-full h-full">
      <CardHeader className="pb-1 pt-2 px-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Layers className="w-5 h-5 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
            Kartu Pembangunan
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 h-full">
        <div className="grid grid-cols-1 gap-0.5 h-full">
          {tiers.map((tier) => (
            <div key={tier} className="flex items-center gap-2 h-full">
              {/* Deck Counter */}
              <div className="flex flex-col items-center justify-center w-24 h-36 bg-slate-100 rounded-lg border border-slate-200 shadow-sm p-1 flex-shrink-0">
                <div className={`w-4 h-4 rounded-full mb-1 ${tier === "tier3" ? "bg-blue-500" : tier === "tier2" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                <span className="text-xs font-bold text-slate-600 text-center leading-tight">
                  Tier {tier === "tier3" ? "3" : tier === "tier2" ? "2" : "1"}
                </span>
                <span className="text-xs text-slate-400 font-medium mt-1">
                  {gameState.decks[tier].length}
                </span>
              </div>

              {/* Cards Row */}
              <div className="grid grid-cols-4 gap-1 flex-1 h-full">
                {gameState.availableCards[tier].map((card: any, index: number) => (
                  <div key={card ? card.id : `empty-${tier}-${index}`} className="h-full flex items-center justify-center">
                    <CardSlot
                      card={card}
                      tier={tier}
                      canBuy={card && canAffordCard(currentPlayer, card)}
                      onBuy={() => buyCard(card, tier)}
                      onReserve={currentPlayer.reservedCards.length < 3 ? () => reserveCard(card, tier) : undefined}
                      showActions={!currentPlayer.isBot && !gameState.winner}
                      animatingCardId={gameState.animatingCard}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default DevelopmentCardsBoard