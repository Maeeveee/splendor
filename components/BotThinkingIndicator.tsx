import { Brain } from "lucide-react"

export default function BotThinkingIndicator({ stage }: { stage: string }) {
  return (
    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
      <Brain className="w-4 h-4 animate-spin" />
      <span className="text-sm animate-pulse">{stage}</span>
    </div>
  )
}