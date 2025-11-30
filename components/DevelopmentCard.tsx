import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Diamond, Eye, Gem, Coins } from "lucide-react"
import GemToken from "./GemToken"

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

const getGemIcon = (color: string) => {
    const icons = {
        white: Diamond,
        blue: Gem,
        green: Gem,
        red: Gem,
        black: Gem,
        gold: Coins,
    }
    const IconComponent = icons[color as keyof typeof icons]
    return <IconComponent className="w-3 h-3" />
}

const DevelopmentCardComponent = ({
    card,
    tier,
    canBuy,
    onBuy,
    onReserve,
    showActions = true,
    animatingCardId,
    isReserved = false,
    size = "normal"
}: {
    card: any
    tier?: string
    canBuy: boolean
    onBuy: () => void
    onReserve?: () => void
    showActions?: boolean
    animatingCardId: number | null
    isReserved?: boolean
    size?: "normal" | "mini"
}) => {
    const isMini = size === "mini"

    return (
        <Card
            className={`
${isMini ? "w-24 h-28" : "w-32 h-36"} relative
shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105
${animatingCardId === card.id ? "animate-pulse ring-2 ring-green-400" : ""}
${isReserved ? "border-blue-400 border-2" : ""}
${card.provides === "white"
                    ? "bg-gray-100"
                    : card.provides === "blue"
                        ? "bg-blue-100"
                        : card.provides === "green"
                            ? "bg-green-100"
                            : card.provides === "red"
                                ? "bg-red-100"
                                : card.provides === "black"
                                    ? "bg-gray-700"
                                    : ""
                }
`}
        >
            <CardHeader className={`${isMini ? "p-1.5 pb-0.5" : "p-2 pb-1"}`}>
                <div className="flex justify-between items-center">
                    <div
                        className={`${isMini ? "w-5 h-5" : "w-6 h-6"} rounded-full border-2 ${getGemColor(card.provides)} flex items-center justify-center transition-all duration-300`}
                    >
                        {getGemIcon(card.provides)}
                    </div>
                    {card.points > 0 && (
                        <Badge variant="secondary" className={`bg-yellow-100 text-yellow-800 border-yellow-300 ${isMini ? "text-xs px-0.5 py-0" : "text-sm px-1 py-0"}`}>
                            <Star className={`${isMini ? "w-2.5 h-2.5" : "w-3 h-3"} mr-1`} />
                            {card.points}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className={`${isMini ? "p-1.5 pt-0 pb-2" : "p-2 pt-0 pb-4"}`}>
                <div className="space-y-1">
                    {!isMini && (
                        <div className={`text-sm font-semibold mb-1 ${card.provides === "black" ? "text-white" : "text-gray-600"}`}>
                            Biaya:
                        </div>
                    )}
                    <div className={`grid grid-cols-2 gap-x-2 gap-y-1 ${isMini ? "max-h-16" : "max-h-20"} overflow-y-auto`}>
                        {GEM_COLORS.map(
                            (color) =>
                                card.cost[color] > 0 && (
                                    <div key={color} className="flex items-center gap-1">
                                        <div className={`${isMini ? "w-2.5 h-2.5" : "w-3 h-3"} rounded-full border ${getGemColor(color)} flex items-center justify-center`}>
                                            {getGemIcon(color)}
                                        </div>
                                        <span className={`${isMini ? "text-xs" : "text-sm"} font-medium ${card.provides === "black" ? "text-white" : "text-gray-700"}`}>
                                            {card.cost[color]}
                                        </span>
                                    </div>
                                ),
                        )}
                    </div>
                </div>
                {showActions && (
                    <div className="absolute bottom-1 left-1 right-1 flex gap-1">
                        <Button
                            size="sm"
                            className={`text-xs ${isMini ? "h-5" : "h-6"} flex-1 bg-green-600 hover:bg-green-700 transition-colors duration-200 px-1`}
                            disabled={!canBuy}
                            onClick={onBuy}
                        >
                            <Diamond className="w-3 h-3 mr-1" />
                            {(!isMini || isReserved) && "Beli"}
                        </Button>
                        {!isReserved &&
                            onReserve && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className={`text-xs ${isMini ? "h-5 px-0.5" : "h-6 px-1"} bg-blue-50 hover:bg-blue-100 transition-colors duration-200`}
                                    onClick={onReserve}
                                >
                                    <Eye className="w-3 h-3" />
                                </Button>
                            )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default DevelopmentCardComponent
