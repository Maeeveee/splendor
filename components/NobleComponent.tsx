import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Star } from "lucide-react"

const GEM_COLORS = ["white", "blue", "green", "red", "black"] as const

const NobleGemToken = ({ color, count, size = "small" }: any) => {
  const getSize = () => {
    switch (size) {
      case "tiny":
        return "w-3 h-4 text-[8px]"
      case "small":
        return "w-4 h-6 text-[10px]"
      default:
        return "w-4 h-6 text-[10px]"
    }
  }

  const getGemColor = (color: string) => {
    const colors = {
      white: "bg-gray-100 border-gray-400 text-gray-800",
      blue: "bg-blue-500 border-blue-600 text-white",
      green: "bg-green-500 border-green-600 text-white",
      red: "bg-red-500 border-red-600 text-white",
      black: "bg-gray-800 border-gray-900 text-white",
      gold: "bg-yellow-400 border-yellow-500 text-black",
    }

    return colors[color as keyof typeof colors] || colors.white
  }

  return (
    <div
      className={`
        ${getSize()} 
        ${getGemColor(color)} 
        rounded border-2 
        flex items-center justify-center 
        font-bold
      `}
    >
      {count}
    </div>
  )
}

const NobleComponent = ({ noble, playerBonuses, layout = "horizontal" }: any) => {
  const canVisit = GEM_COLORS.every((color) => playerBonuses[color] >= noble.requirements[color])

  if (layout === "vertical") {
    return (
      <Card
        className={`
        ${canVisit ? "ring-2 ring-yellow-400 bg-yellow-50" : "bg-white"}
        shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]
        w-full
      `}
      >
        <CardContent className="p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Crown className="w-4 h-4 text-yellow-600" />
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 px-1 py-0">
              <Star className="w-2.5 h-2.5 mr-0.5" />
              {noble.points}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] text-gray-600 font-medium">Kartu dibutuhkan:</div>
            <div className="grid grid-cols-5 gap-0.5">
              {GEM_COLORS.map((color) => {
                const required = noble.requirements[color]
                const playerHas = playerBonuses[color]

                if (required === 0) return null

                return (
                  <div key={color} className="flex flex-col items-center">
                    <NobleGemToken color={color} count={required} size="small" />
                    <div
                      className={`text-[10px] mt-0.5 ${playerHas >= required ? "text-green-600 font-bold" : "text-red-500"
                        }`}
                    >
                      {playerHas}/{required}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {canVisit && (
            <div className="mt-2 text-center">
              <div className="text-[10px] text-yellow-700 font-bold animate-pulse">
                ✨ Bisa dikunjungi!
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`
      ${canVisit ? "ring-2 ring-yellow-400 bg-yellow-50" : "bg-white"}
      shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105
      w-24 h-32 flex-shrink-0
    `}
    >
      <CardContent className="p-2 h-full flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <Crown className="w-3 h-3 text-yellow-600" />
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-[10px] px-1 py-0">
            <Star className="w-2 h-2 mr-0.5" />
            {noble.points}
          </Badge>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-[10px] text-gray-600 mb-1">Butuh (You):</div>
          <div className="grid grid-cols-2 gap-0.5">
            {GEM_COLORS.map((color) => {
              const required = noble.requirements[color]
              const playerHas = playerBonuses[color]

              if (required === 0) return null

              return (
                <div key={color} className="flex flex-col items-center">
                  <NobleGemToken color={color} count={required} size="tiny" />
                  <div className={`text-[10px] mt-0.5 ${playerHas >= required ? "text-green-600" : "text-red-500"}`}>
                    {playerHas}/{required}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {canVisit && (
          <div className="text-center mt-1">
            <div className="text-[10px] text-yellow-700 font-bold">✨</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default NobleComponent