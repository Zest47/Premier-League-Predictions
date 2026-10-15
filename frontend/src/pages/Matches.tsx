
import { useEffect, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

import { getMatches } from '../services/api'
import type { Match } from '../types/api'

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGameweek, setSelectedGameweek] = useState<number | null>(null)

  
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

    // Liste des journées disponibles
    const gameweeks = [...new Set(matches.map((match) => match.gameweek))]
        .sort((a, b) => a - b)

    // Journée sélectionnée (première journée par défaut)
    const currentGameweek = selectedGameweek ?? gameweeks[0] ?? null

    const currentGameweekIndex = gameweeks.findIndex(
    (gameweek) => gameweek === currentGameweek
    )

    const previousGameweek =
    currentGameweekIndex > 0
        ? gameweeks[currentGameweekIndex - 1]
        : null

    const nextGameweek =
    currentGameweekIndex >= 0 &&
    currentGameweekIndex < gameweeks.length - 1
        ? gameweeks[currentGameweekIndex + 1]
        : null

    // Matchs de la journée sélectionnée
    const filteredMatches = matches.filter(
        (match) => match.gameweek === currentGameweek
    )


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Matchs</h1>
        <p className="mt-2 text-gray-400">
          Calendrier des rencontres de Premier League.
        </p>
      </div>

      
    
        {gameweeks.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#19232e] p-4">
            <button
            type="button"
            disabled={previousGameweek === null}
            onClick={() => setSelectedGameweek(previousGameweek)}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Précédente</span>
            </button>

            <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
                Journée
            </span>

            <select
                value={currentGameweek ?? ''}
                onChange={(event) =>
                setSelectedGameweek(Number(event.target.value))
                }
                className="rounded-xl border border-white/10 bg-[#121a24] px-4 py-2 font-bold text-white outline-none focus:border-lime-400"
            >
                {gameweeks.map((gameweek) => (
                <option key={gameweek} value={gameweek}>
                    {gameweek}
                </option>
                ))}
            </select>
            </div>

            <button
            type="button"
            disabled={nextGameweek === null}
            onClick={() => setSelectedGameweek(nextGameweek)}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            >
            <span className="hidden sm:inline">Suivante</span>
            <ChevronRight size={18} />
            </button>
        </div>
        )}


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
          {filteredMatches.map((match) => (
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
