import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Star } from "lucide-react"

const GEM_COLORS = ["white", "blue", "green", "red", "black"] as const

const NobleGemToken = ({ color, count, size = "small" }: any) => {
  const getSize = () => {
    switch (size) {
      case "tiny":
        return "w-4 h-6 text-xs"
      case "small":
        return "w-6 h-8 text-xs"
      default:
        return "w-6 h-8 text-xs"
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
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Star className="w-3 h-3 mr-1" />
              {noble.points}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-gray-600 font-medium">Kartu dibutuhkan:</div>
            <div className="grid grid-cols-5 gap-1">
              {GEM_COLORS.map((color) => {
                const required = noble.requirements[color]
                const playerHas = playerBonuses[color]

                if (required === 0) return null

                return (
                  <div key={color} className="flex flex-col items-center">
                    <NobleGemToken color={color} count={required} size="small" />
                    <div
                      className={`text-xs mt-1 ${
                        playerHas >= required ? "text-green-600 font-bold" : "text-red-500"
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
            <div className="mt-3 text-center">
              <div className="text-xs text-yellow-700 font-bold animate-pulse">
                ✨ Anda dapat mengunjungi Noble ini!
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
      w-32 h-40 flex-shrink-0
    `}
    >
      <CardContent className="p-3 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <Crown className="w-4 h-4 text-yellow-600" />
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
            <Star className="w-2 h-2 mr-1" />
            {noble.points}
          </Badge>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-xs text-gray-600 mb-2">Butuh (You):</div>
          <div className="grid grid-cols-2 gap-1">
            {GEM_COLORS.map((color) => {
              const required = noble.requirements[color]
              const playerHas = playerBonuses[color]

              if (required === 0) return null

              return (
                <div key={color} className="flex flex-col items-center">
                  <NobleGemToken color={color} count={required} size="tiny" />
                  <div className={`text-xs mt-1 ${playerHas >= required ? "text-green-600" : "text-red-500"}`}>
                    {playerHas}/{required}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {canVisit && (
          <div className="text-center mt-2">
            <div className="text-xs text-yellow-700 font-bold">✨</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default NobleComponent