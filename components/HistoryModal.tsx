import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Trophy, Clock, Users, Bot, User, BarChart3 } from "lucide-react"

interface GameHistory {
  id: string
  timestamp: number
  gameMode: "pvp" | "pve"
  players: {
    name: string
    isBot: boolean
    finalPoints: number
    finalCards: number
    finalNobles: number
  }[]
  winner: {
    id: number
    name: string
    points: number
  }
  duration: number
  totalTurns: number
}

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
  history: GameHistory[]
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const HistoryList = ({ history }: { history: GameHistory[] }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Belum ada riwayat permainan</p>
        <p className="text-sm">Mulai bermain untuk melihat riwayat!</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {history.map((game) => (
        <div key={game.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Badge
                variant={game.gameMode === 'pve' ? 'destructive' : 'default'}
                className="text-xs"
              >
                {game.gameMode === 'pve' ? (
                  <>
                    <Bot className="w-3 h-3 mr-1" />
                    vs Bot
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3 mr-1" />
                    PvP
                  </>
                )}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatDate(game.timestamp)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {formatDuration(game.duration)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {game.players.map((player, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  game.winner.id === index
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {player.isBot ? (
                    <Bot className="w-4 h-4 text-gray-600" />
                  ) : (
                    <User className="w-4 h-4 text-blue-600" />
                  )}
                  <span className="font-medium">{player.name}</span>
                  {game.winner.id === index && (
                    <Trophy className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div className="text-right text-sm">
                  <div className="font-bold text-lg">{player.finalPoints}</div>
                  <div className="text-gray-500">
                    {player.finalCards}K • {player.finalNobles}N
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 text-xs text-gray-500 text-center">
            {game.totalTurns} giliran total
          </div>
        </div>
      ))}
    </div>
  )
}

const StatisticsView = ({ history }: { history: GameHistory[] }) => {
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalGames: 0,
        winsAsHuman: 0,
        winsVsBot: 0,
        averageDuration: 0,
        averagePoints: 0,
        winRate: 0,
        bestScore: 0,
        averageTurns: 0,
      }
    }

    const humanWins = history.filter(game => 
      game.winner.id === 0 && !game.players[0].isBot
    ).length
    
    const botWins = history.filter(game => 
      game.gameMode === "pve" && game.winner.id === 1
    ).length
    
    const totalDuration = history.reduce((sum, game) => sum + game.duration, 0)
    const totalPoints = history.reduce((sum, game) => sum + game.winner.points, 0)
    const totalTurns = history.reduce((sum, game) => sum + game.totalTurns, 0)
    
    const humanScores = history
      .filter(game => game.winner.id === 0 && !game.players[0].isBot)
      .map(game => game.winner.points)
    const bestScore = humanScores.length > 0 ? Math.max(...humanScores) : 0
    
    return {
      totalGames: history.length,
      winsAsHuman: humanWins,
      winsVsBot: botWins,
      averageDuration: Math.floor(totalDuration / history.length),
      averagePoints: Math.floor(totalPoints / history.length),
      winRate: Math.round((humanWins / history.length) * 100),
      bestScore,
      averageTurns: Math.floor(totalTurns / history.length),
    }
  }, [history])

  if (stats.totalGames === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Belum ada data statistik</h3>
        <p className="text-sm">Selesaikan beberapa permainan untuk melihat statistik!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg text-center border border-blue-100">
          <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalGames}</div>
          <div className="text-sm text-blue-800 font-medium">Total Permainan</div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg text-center border border-green-100">
          <div className="text-3xl font-bold text-green-600 mb-1">{stats.winsAsHuman}</div>
          <div className="text-sm text-green-800 font-medium">Kemenangan</div>
        </div>
        
        <div className="bg-red-50 p-6 rounded-lg text-center border border-red-100">
          <div className="text-3xl font-bold text-red-600 mb-1">{stats.winsVsBot}</div>
          <div className="text-sm text-red-800 font-medium">Kekalahan</div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg text-center border border-yellow-100">
          <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.winRate}%</div>
          <div className="text-sm text-yellow-800 font-medium">Win Rate</div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg text-center border border-purple-100">
          <div className="text-3xl font-bold text-purple-600 mb-1">{formatDuration(stats.averageDuration)}</div>
          <div className="text-sm text-purple-800 font-medium">Rata-rata Durasi</div>
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-lg text-center border border-indigo-100">
          <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.averagePoints}</div>
          <div className="text-sm text-indigo-800 font-medium">Rata-rata Poin</div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg text-center border border-orange-100">
          <div className="text-3xl font-bold text-orange-600 mb-1">{stats.bestScore}</div>
          <div className="text-sm text-orange-800 font-medium">Skor Terbaik</div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
          <div className="text-3xl font-bold text-gray-600 mb-1">{stats.averageTurns}</div>
          <div className="text-sm text-gray-800 font-medium">Rata-rata Giliran</div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">Ringkasan Performance</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Anda telah menyelesaikan <strong>{stats.totalGames}</strong> permainan</p>
          <p>• Win rate Anda adalah <strong>{stats.winRate}%</strong> {stats.winRate >= 50 ? '🎉' : '💪'}</p>
          <p>• Skor tertinggi yang pernah dicapai: <strong>{stats.bestScore} poin</strong></p>
          <p>• Rata-rata durasi permainan: <strong>{formatDuration(stats.averageDuration)}</strong></p>
        </div>
      </div>
    </>
  )
}

const HistoryModal = ({ isOpen, onClose, history }: HistoryModalProps) => {
  const [activeTab, setActiveTab] = useState<'history' | 'stats'>('history')

  useEffect(() => {
    if (isOpen) {
      setActiveTab('history')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            <CardTitle className="text-xl">Riwayat Permainan</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'history'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Riwayat
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'stats'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Statistik
            </button>
          </div>
        </div>

        <CardContent className="p-0">
          {activeTab === 'history' && (
            <div className="max-h-96 overflow-y-auto">
              <HistoryList history={history} />
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="p-6 max-h-96 overflow-y-auto">
              <StatisticsView history={history} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default HistoryModal