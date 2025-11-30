import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown } from "lucide-react"
import NobleComponent from "./NobleComponent"

const NoblesBoard = ({ gameState, currentPlayerBonuses }: any) => {
  return (
    <Card className="shadow-lg bg-gradient-to-br from-white to-gray-50 h-full">
      <CardHeader className="pb-0.5 pt-1.5 px-1.5">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <Crown className="w-4 h-4 text-yellow-600" />
          <span className="bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-bold">
            Para Raja
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-1.5 h-full overflow-y-auto">
        <div className="flex flex-col gap-1 h-full">
          {gameState.availableNobles.map((noble: any) => (
            <NobleComponent
              key={noble.id}
              noble={noble}
              playerBonuses={currentPlayerBonuses.gems}
              layout="vertical"
            />
          ))}
          {gameState.availableNobles.length === 0 && (
            <div className="text-center text-gray-400 text-xs py-4 italic">
              Tidak ada bangsawan tersisa
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default NoblesBoard