import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Bot, Star, Crown } from "lucide-react"
import GemToken from "./GemToken"
import DevelopmentCardComponent from "./DevelopmentCard"

const GEM_COLORS = ["white", "blue", "green", "red", "black"] as const

const getGemColor = (color: string) => {
    const colors = {
        white: "bg-slate-100 border-slate-300 text-slate-800",
        blue: "bg-blue-100 border-blue-300 text-blue-800",
        green: "bg-emerald-100 border-emerald-300 text-emerald-800",
        red: "bg-rose-100 border-rose-300 text-rose-800",
        black: "bg-slate-800 border-slate-600 text-slate-100",
        gold: "bg-amber-100 border-amber-300 text-amber-800",
    }
    return colors[color as keyof typeof colors]
}

const PlayerCard = ({
    player,
    isCurrentPlayer,
    canAffordCard,
    onBuyReservedCard,
    gameState,
    currentPlayer,
    className = ""
}: any) => {
    const getTotalGems = (playerGems: any) =>
        GEM_COLORS.reduce((sum, color) => sum + playerGems[color], 0) + playerGems.gold

    return (
        <Card
            className={`
        relative transition-all duration-300
        ${isCurrentPlayer
                    ? "ring-2 ring-blue-500 shadow-lg scale-[1.01] bg-white z-10"
                    : "bg-slate-50/50 hover:bg-white hover:shadow-sm border-slate-200"
                }
        ${className}
      `}
        >
            {isCurrentPlayer && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full shadow-lg animate-bounce">
                    <Crown className="w-3 h-3" />
                </div>
            )}

            <CardHeader className="pb-0.5 pt-1.5 px-1.5">
                <CardTitle className="flex items-center gap-1.5 text-sm">
                    <div className={`p-1 rounded-full ${player.isBot ? "bg-slate-200" : "bg-blue-100"}`}>
                        {player.isBot ? <Bot className="w-3.5 h-3.5 text-slate-600" /> : <User className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 truncate max-w-[80px] text-xs">{player.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                            {isCurrentPlayer ? "Giliranmu" : "Menunggu"}
                        </span>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 ml-auto px-1.5 py-0 text-[10px] h-5">
                        <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                        {player.points}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-1 px-1.5 pb-1.5">
                {/* Unified Resources Section */}
                <div className="bg-slate-100/50 rounded-md p-1 border border-slate-100">
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[10px] font-medium text-slate-500">Sumber Daya</span>
                        <span className="text-[10px] font-medium text-slate-700">Total: {getTotalGems(player.gems)}</span>
                    </div>
                    <div className="grid grid-cols-6 gap-0.5">
                        {/* Standard Colors */}
                        {GEM_COLORS.map((color) => {
                            const gemCount = player.gems[color]
                            const cardCount = player.cards.filter((card: any) => card.provides === color).length

                            return (
                                <div key={color} className={`
                  flex flex-col items-center gap-0.5 p-0.5 rounded border
                  ${getGemColor(color).replace("bg-", "border-").replace("text-", "text-")}
                  bg-white
                `}>
                                    {/* Gem Count */}
                                    <div className="relative">
                                        <GemToken color={color} count={gemCount} size="tiny" />
                                    </div>

                                    {/* Card Bonus Count */}
                                    <div className="w-full flex items-center justify-center bg-slate-50 rounded-[2px] h-3.5 border border-slate-100">
                                        <span className="text-[10px] font-bold leading-none text-slate-600">{cardCount}</span>
                                    </div>
                                </div>
                            )
                        })}

                        {/* Gold */}
                        <div className="flex flex-col items-center gap-0.5 p-0.5 rounded border border-amber-200 bg-white">
                            <div className="relative">
                                <GemToken color="gold" count={player.gems.gold} size="tiny" />
                            </div>
                            {/* Spacer for alignment with cards */}
                            <div className="w-full h-3.5" />
                        </div>
                    </div>
                </div>

                {/* Reserved Cards */}
                {player.reservedCards.length > 0 && (
                    <div className="border-t border-slate-100 pt-1">
                        <div className="grid grid-cols-3 gap-1">
                            {player.reservedCards.map((card: any) => (
                                <div key={card.id} className="w-full transform scale-90 origin-top-left">
                                    <DevelopmentCardComponent
                                        card={card}
                                        canBuy={canAffordCard(player, card)}
                                        onBuy={() => onBuyReservedCard(card)}
                                        showActions={isCurrentPlayer && !player.isBot && !gameState.winner}
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
