import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Diamond } from "lucide-react"
import DeckCounter from "./DeckCounter"
import CardSlot from "./CardSlot"

const DevelopmentCardsBoard = ({ 
  gameState, 
  currentPlayer, 
  setGameState, 
  buyCardLogic, 
  reserveCardLogic, 
  canAffordCard 
}: any) => {
  return (
    <Card className="shadow-lg bg-gradient-to-br from-white to-gray-50 w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Diamond className="w-5 h-5 text-purple-600" />
          Kartu Sumber Daya
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(["tier3", "tier2", "tier1"] as const).map((tier) => (
            <div key={tier}>
              <div className="grid grid-cols-5 gap-2 place-items-center">
                <DeckCounter count={gameState.decks[tier].length} />
                {gameState.availableCards[tier].map((card: any, index: number) => {
                  const isReservedByAnyone =
                    card &&
                    gameState.players.some((player: any) =>
                      player.reservedCards.some((reserved: any) => reserved.id === card.id)
                    )

                  return (
                    <CardSlot
                      key={card ? card.id : `empty-${tier}-${index}`}
                      card={isReservedByAnyone ? null : card}
                      tier={tier}
                      canBuy={card && !isReservedByAnyone ? canAffordCard(currentPlayer, card) : false}
                      onBuy={
                        card && !isReservedByAnyone
                          ? () => {
                              setGameState((prev: any) => {
                                const newState = buyCardLogic(prev, gameState.currentPlayer, card, tier, index)
                                return {
                                  ...newState,
                                  currentPlayer: (newState.currentPlayer + 1) % 2,
                                  lastBotAction: null,
                                }
                              })
                            }
                          : undefined
                      }
                      onReserve={
                        card && !isReservedByAnyone
                          ? () => {
                              if (gameState.gems.gold > 0) {
                                setGameState((prev: any) => {
                                  const newState = reserveCardLogic(
                                    prev,
                                    gameState.currentPlayer,
                                    card,
                                    tier,
                                    index,
                                  )
                                  return {
                                    ...newState,
                                    currentPlayer: (newState.currentPlayer + 1) % 2,
                                    lastBotAction: null,
                                  }
                                })
                              }
                            }
                          : undefined
                      }
                      showActions={!currentPlayer.isBot && !gameState.winner}
                      animatingCardId={gameState.animatingCard}
                      index={index}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default DevelopmentCardsBoard