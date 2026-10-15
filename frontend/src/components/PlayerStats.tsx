
import { Medal, Target, Trophy, ChartNoAxesColumn } from 'lucide-react'
import type { LeaderboardEntry, PredictionResult } from '../types/api'

interface PlayerStatsProps {
  entry: LeaderboardEntry | null
  results: PredictionResult[]
}

export default function PlayerStats({ entry, results }: PlayerStatsProps) {
  const finishedResults = results.filter(
    (result) => result.matchStatus === 'FINISHED'
  )

  const successfulPredictions = finishedResults.filter(
    (result) => result.points > 0
  ).length

  const successRate =
    finishedResults.length > 0
      ? Math.round(
          (successfulPredictions / finishedResults.length) * 100
        )
      : 0

  const stats = [
    {
      label: 'Mes points',
      value: entry?.totalPoints ?? 0,
      icon: Trophy,
    },
    {
      label: 'Mon classement',
      value: entry ? `#${entry.rank}` : '—',
      icon: Medal,
    },
    {
      label: 'Scores exacts',
      value: entry?.exactScores ?? 0,
      icon: Target,
    },
    {
      label: 'Taux de réussite',
      value: `${successRate} %`,
      icon: ChartNoAxesColumn,
    },
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-white">
        Mes statistiques
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-[#19232e] p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {stat.label}
                </span>

                <Icon className="h-5 w-5 text-lime-400" />
              </div>

              <p className="text-3xl font-black text-white">
                {stat.value}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
