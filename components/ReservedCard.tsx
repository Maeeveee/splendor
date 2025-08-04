import { Card } from "@/components/ui/card"

export default function ReservedCard({ card, canBuy, onBuy }: any) {
  return (
    <Card
      className={`w-28 h-36 relative shadow-md ${
        canBuy ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="absolute top-2 left-2 text-lg font-bold text-gray-700">
        {card.points} Poin
      </div>
      <div className="absolute bottom-2 left-2 text-sm text-gray-500">
        {Object.entries(card.cost).map(([color, count]) => (
          <div key={color} className="flex items-center gap-1">
            <span className={`w-4 h-4 bg-${color}-500 rounded-full`}></span>
            <span>{count}</span>
          </div>
        ))}
      </div>
      {canBuy && (
        <button
          onClick={onBuy}
          className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          Beli
        </button>
      )}
    </Card>
  )
}