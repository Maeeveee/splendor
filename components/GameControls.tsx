import { Button } from "@/components/ui/button"

export default function GameControls({ initializeGame, setGameState, setPendingMode }: any) {
  return (
    <div className="flex gap-2 mt-4 justify-center">
      <Button
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => initializeGame("pvp")}
      >
        Main Lagi
      </Button>
      <Button
        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
        onClick={() => {
          setGameState((prev: any) => ({
            ...prev,
            gameMode: "menu",
            winner: null,
          }))
          setPendingMode(null)
        }}
      >
        Kembali ke Menu
      </Button>
    </div>
  )
}