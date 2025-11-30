import { useState, useEffect, useRef } from "react"
import { Diamond, Gem, Coins } from "lucide-react"

const getGemColor = (color: string) => {
  const colors: Record<string, string> = {
    white: "bg-gray-100 border-gray-400 text-gray-800",
    blue: "bg-blue-500 border-blue-600 text-white",
    green: "bg-green-500 border-green-600 text-white",
    red: "bg-red-500 border-red-600 text-white",
    black: "bg-gray-800 border-gray-900 text-white",
    gold: "bg-yellow-400 border-yellow-500 text-black",
  }
  return colors[color] || colors.white
}

const getGemIcon = (color: string) => {
  const icons: Record<string, any> = {
    white: Diamond,
    blue: Gem,
    green: Gem,
    red: Gem,
    black: Gem,
    gold: Coins,
  }
  const IconComponent = icons[color] || Diamond
  return <IconComponent className="w-3 h-3" />
}

const GemToken = ({
  color,
  count,
  size = "normal",
}: {
  color: string;
  count?: number;
  size?: "tiny" | "small" | "medium" | "normal" | "large"
}) => {
  const sizeClasses = {
    tiny: "w-4 h-4 text-[10px]",
    small: "w-5 h-5 text-xs",
    medium: "w-6 h-6 text-xs",
    normal: "w-8 h-8 text-sm",
    large: "w-10 h-10 text-base",
  }

  const [flash, setFlash] = useState(false)
  const prevCountRef = useRef(count)

  useEffect(() => {
    if (count !== prevCountRef.current) {
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), 300)
      return () => clearTimeout(timer)
    }
    prevCountRef.current = count
  }, [count])

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-2 ${getGemColor(color)} flex items-center justify-center font-bold shadow-md transition-all duration-300 hover:scale-110 ${flash ? "scale-125 ring-2 ring-yellow-400" : ""}`}
    >
      {count !== undefined && count > 0 ? count : getGemIcon(color)}
    </div>
  )
}

export default GemToken