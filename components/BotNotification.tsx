import { Bot } from "lucide-react"

const BotNotification = ({ botNotif }: { botNotif: string | null }) => {
  if (!botNotif) return null

  return (
    <div className="fixed top-6 left-6 z-[9999] animate-fade-in">
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 shadow-xl rounded-lg px-5 py-3 text-blue-700 font-semibold text-base">
        <Bot className="w-5 h-5" />
        <span>{botNotif}</span>
      </div>
    </div>
  )
}

export default BotNotification