import { Card } from "@/components/ui/card"

const DeckCounter = ({ count }: { count: number }) => (
  <Card className="w-32 h-36 relative shadow-lg bg-slate-800 text-white flex flex-col items-center justify-center p-2">
    <div className="text-3xl font-bold">{count}</div>
    <div className="text-sm mt-2 text-center">Kartu Tersisa</div>
  </Card>
)

export default DeckCounter