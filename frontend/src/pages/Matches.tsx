
import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'

import { getMatches } from '../services/api'
import type { Match } from '../types/api'

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getMatches()
      .then((data) => {
        if (active) setMatches(data)
      })
      .catch(() => {
        if (active) {
          setError('Impossible de charger les rencontres.')
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
        <h1 className="text-3xl font-black">Matchs</h1>
        <p className="mt-2 text-gray-400">
          Calendrier des rencontres de Premier League.
        </p>
      </div>

      {loading && (
        <p className="text-gray-400">Chargement des matchs...</p>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
        <p className="text-gray-400">Aucun match disponible.</p>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="rounded-2xl border border-white/5 bg-[#19232e] p-6"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-lime-400">
                  Journée {match.gameweek}
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                  {match.status}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-lg font-bold">{match.homeTeam.name}</p>
                  <p className="mt-2 text-lg font-bold">{match.awayTeam.name}</p>
                </div>

                <div className="text-right">
                  {match.status === 'FINISHED' &&
                  match.homeScore !== null &&
                  match.awayScore !== null ? (
                    <div className="space-y-2 text-2xl font-black">
                      <p>{match.homeScore}</p>
                      <p>{match.awayScore}</p>
                    </div>
                  ) : (
                    <p className="text-xl font-black text-gray-400">VS</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-gray-400">
                <CalendarDays size={16} />
                <span>
                  {new Date(match.startDate).toLocaleString('fr-BE', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
