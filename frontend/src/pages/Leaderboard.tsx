
import { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'

import { getLeaderboard } from '../services/api'
import type { LeaderboardEntry } from '../types/api'

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getLeaderboard()
      .then((data) => {
        if (active) setEntries(data)
      })
      .catch(() => {
        if (active) {
          setError('Impossible de charger le classement.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Classement général</h1>
        <p className="mt-2 text-gray-400">
          Classement des participants selon leurs points.
        </p>
      </div>

      {loading && (
        <p className="text-gray-400">Chargement du classement...</p>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="text-gray-400">
          Aucun pronostic évalué pour le moment.
        </p>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#19232e]">
          <table className="w-full min-w-[620px] text-left">
            <thead className="border-b border-white/10 text-sm text-gray-400">
              <tr>
                <th className="p-5">Position</th>
                <th className="p-5">Joueur</th>
                <th className="p-5">Points</th>
                <th className="p-5">Scores exacts</th>
                <th className="p-5">Bons résultats</th>
                <th className="p-5">Pronostics</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.userId}
                  className="border-b border-white/5 last:border-b-0"
                >
                  <td className="p-5">
                    <span className="flex items-center gap-2 font-bold">
                      {entry.rank === 1 && (
                        <Trophy size={18} className="text-lime-400" />
                      )}
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="p-5 font-semibold">
                    Joueur #{entry.userId}
                  </td>
                  <td className="p-5 font-black text-lime-400">
                    {entry.totalPoints}
                  </td>
                  <td className="p-5">{entry.exactScores}</td>
                  <td className="p-5">{entry.correctResults}</td>
                  <td className="p-5">{entry.predictionsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
