import { Button } from "@/components/ui/button"
import { Trophy, Star, User, Bot } from "lucide-react"

const WinnerModal = ({ 
  gameState, 
  setGameState, 
  setPendingMode, 
  initializeGame, 
  initialGameState 
}: any) => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-xs w-full text-center animate-fade-in">
        <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-2" />
        <h2 className="text-2xl font-bold mb-2">
          {gameState.players[gameState.winner].id === 0 ? "Anda Menang!" : gameState.players[gameState.winner].isBot ? "Bot Menang!" : "Pemain 2 Menang!"}
        </h2>
        <div className="mb-4">
          <p className="font-semibold mb-1">Skor Akhir:</p>
          <div className="flex flex-col gap-2">
            {gameState.players.map((p: any, i: number) => (
              <div key={p.id} className={`flex items-center justify-between px-4 py-1 rounded ${i === gameState.winner ? "bg-green-100 font-bold" : "bg-gray-100"}`}>
                <span>
                  {p.isBot ? <Bot className="inline w-4 h-4 mr-1" /> : <User className="inline w-4 h-4 mr-1" />}
                  {p.name}
                </span>
                <span className="text-lg">{p.points} <Star className="inline w-4 h-4 text-yellow-500" /></span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4 justify-center">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => initializeGame(gameState.gameMode === "pve" ? "pve" : "pvp")}
          >
            Main Lagi
          </Button>
          <Button
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={() => {
              setGameState(initialGameState)
              setPendingMode(null)
            }}
          >
            Kembali ke Menu
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WinnerModal