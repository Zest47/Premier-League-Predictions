
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Trophy,
  Users,
  Target,
  ArrowRight,
} from 'lucide-react'

import { getMatches, getLeaderboard } from '../services/api'
import type { Match, LeaderboardEntry } from '../types/api'

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    Promise.all([getMatches(), getLeaderboard()])
      .then(([matchesData, leaderboardData]) => {
        if (!active) return
        setMatches(matchesData)
        setLeaderboard(leaderboardData)
      })
      .catch(() => {
        if (active) {
          setError('Impossible de charger le Dashboard.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const upcomingMatches = matches
    .filter((match) => match.status === 'SCHEDULED')
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() -
        new Date(b.startDate).getTime()
    )
    .slice(0, 3)

  const finishedMatches = matches
    .filter((match) => match.status === 'FINISHED')
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() -
        new Date(a.startDate).getTime()
    )
    .slice(0, 3)

  const totalPredictions = leaderboard.reduce(
    (sum, entry) => sum + entry.predictionsCount,
    0
  )

  const stats = [
    {
      label: 'Matchs disponibles',
      value: matches.length,
      icon: CalendarDays,
    },
    {
      label: 'Participants classés',
      value: leaderboard.length,
      icon: Users,
    },
    {
      label: 'Pronostics évalués',
      value: totalPredictions,
      icon: Target,
    },
  ]

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-lime-400">
          Premier League 2026/27
        </p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-400">
          Suivez les rencontres et les meilleurs pronostiqueurs.
        </p>
      </header>

      <section className="rounded-3xl border border-lime-400/20 bg-[#19232e] p-8">
        <h2 className="text-2xl font-black md:text-3xl">
          Prédisez. Gagnez. Dominez.
        </h2>
        <p className="mt-3 text-gray-400">
          Pronostiquez les matchs de Premier League et grimpez au classement.
        </p>

        <Link
          to="/predictions"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 font-bold text-black hover:bg-lime-300"
        >
          Mes pronostics
          <ArrowRight size={18} />
        </Link>
      </section>

      {loading && (
        <p className="text-gray-400">Chargement du Dashboard...</p>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300"
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/5 bg-[#19232e] p-6"
              >
                <Icon size={22} className="text-lime-400" />
                <p className="mt-4 text-sm text-gray-400">{label}</p>
                <p className="mt-2 text-3xl font-black">{value}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl bg-[#19232e] p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Prochains matchs</h2>
                <Link
                  to="/matches"
                  className="text-sm text-lime-400 hover:underline"
                >
                  Voir tout
                </Link>
              </div>

              {upcomingMatches.length === 0 && (
                <p className="text-gray-400">
                  Aucun prochain match disponible.
                </p>
              )}

              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-white/5 bg-[#121a24] p-4"
                  >
                    <p className="mb-3 text-xs font-semibold text-lime-400">
                      Journée {match.gameweek}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">
                        <p>{match.homeTeam.name}</p>
                        <p className="mt-2">{match.awayTeam.name}</p>
                      </div>
                      <span className="font-black text-gray-400">VS</span>
                    </div>
                    <p className="mt-4 text-xs text-gray-400">
                      {new Date(match.startDate).toLocaleString('fr-BE', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#19232e] p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Trophy size={20} className="text-lime-400" />
                  Top joueurs
                </h2>
                <Link
                  to="/leaderboard"
                  className="text-sm text-lime-400 hover:underline"
                >
                  Classement
                </Link>
              </div>

              {leaderboard.length === 0 && (
                <p className="text-gray-400">
                  Aucun joueur classé pour le moment.
                </p>
              )}

              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry) => (
                  <div
                    key={entry.userId}
                    className="flex items-center justify-between rounded-xl bg-[#121a24] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-lime-400">
                        #{entry.rank}
                      </span>
                      <span className="font-semibold">
                        Joueur #{entry.userId}
                      </span>
                    </div>
                    <span className="font-black">
                      {entry.totalPoints} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-[#19232e] p-6">
            <h2 className="mb-6 text-xl font-bold">Derniers résultats</h2>

            {finishedMatches.length === 0 && (
              <p className="text-gray-400">
                Aucun résultat disponible.
              </p>
            )}

            <div className="space-y-3">
              {finishedMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between gap-4 rounded-xl bg-[#121a24] p-4"
                >
                  <div>
                    <p className="font-semibold">{match.homeTeam.name}</p>
                    <p className="mt-2 font-semibold">
                      {match.awayTeam.name}
                    </p>
                  </div>

                  <div className="space-y-2 text-right text-xl font-black">
                    <p>{match.homeScore}</p>
                    <p>{match.awayScore}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
