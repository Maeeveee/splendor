import GemToken from "./GemToken"

export default function PlayerStats({ player }: any) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-700">{player.name}</h3>
      <p className="text-sm text-gray-500">Poin: {player.points}</p>
      <div className="flex gap-2 mt-2">
        {Object.entries(player.gems).map(([color, count]) => (
          <GemToken key={color} color={color} count={count} size="small" />
        ))}
      </div>
    </div>
  )
}