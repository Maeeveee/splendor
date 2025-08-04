import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown } from "lucide-react"
import NobleComponent from "./NobleComponent"

const NoblesBoard = ({ gameState, currentPlayerBonuses }: any) => {
  const humanPlayerBonuses = gameState.players[0] ? gameState.players[0].cards.reduce((bonuses: any, card: any) => {
    bonuses[card.provides] = (bonuses[card.provides] || 0) + 1
    return bonuses
  }, { white: 0, blue: 0, green: 0, red: 0, black: 0 }) : { white: 0, blue: 0, green: 0, red: 0, black: 0 }

  return (
    <Card className="shadow-lg bg-gradient-to-br from-white to-gray-50 h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crown className="w-5 h-5 text-yellow-600" />
          Bangsawan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {gameState.availableNobles?.map((noble: any) => (
          <div key={noble.id} className="w-full">
            <NobleComponent 
              noble={noble} 
              playerBonuses={humanPlayerBonuses}
              layout="vertical"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default NoblesBoard