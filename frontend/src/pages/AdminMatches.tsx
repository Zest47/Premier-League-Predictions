
import { useEffect, useState, type FormEvent } from 'react'
import { ShieldCheck, Trophy } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { getMatches, updateMatchResult } from '../services/api'
import type { Match } from '../types/api'

export default function AdminMatches() {
  const { user } = useAuth()

  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingMatchId, setEditingMatchId] = useState<number | null>(null)
  const [homeScore, setHomeScore] = useState('0')
  const [awayScore, setAwayScore] = useState('0')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'ADMIN') return

    let active = true

    getMatches()
      .then((data) => {
        if (active) setMatches(data)
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Impossible de charger les matchs.'
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  function startEditing(match: Match) {
    setEditingMatchId(match.id)
    setHomeScore(String(match.homeScore ?? 0))
    setAwayScore(String(match.awayScore ?? 0))
    setError(null)
    setSuccess(null)
  }

  async function handleSaveResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (editingMatchId === null || saving) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await updateMatchResult(editingMatchId, {
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
      })

      const updatedMatches = await getMatches()
      setMatches(updatedMatches)

      setEditingMatchId(null)
      setSuccess('Résultat enregistré avec succès !')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer le résultat."
      )
    } finally {
      setSaving(false)
    }
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="rounded-2xl bg-[#19232e] p-6">
        <h1 className="text-xl font-bold text-white">
          Accès refusé
        </h1>
        <p className="mt-2 text-gray-400">
          Cette page est réservée aux administrateurs.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-lime-400" />

        <div>
          <h1 className="text-3xl font-black text-white">
            Administration
          </h1>
          <p className="text-gray-400">
            Gestion des résultats des matchs
          </p>
        </div>
      </div>

      {success && (
        <p className="rounded-xl border border-lime-400/20 bg-lime-400/10 p-4 text-lime-400">
          {success}
        </p>
      )}

      {loading && (
        <p className="text-gray-400">
          Chargement des matchs...
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-500/10 p-4 text-red-400">
          {error}
        </p>
      )}

      {!loading && (
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="rounded-2xl border border-white/10 bg-[#19232e] p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Journée {match.gameweek}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    match.status === 'FINISHED'
                      ? 'bg-lime-400/10 text-lime-400'
                      : 'bg-amber-400/10 text-amber-400'
                  }`}
                >
                  {match.status === 'FINISHED'
                    ? 'Terminé'
                    : 'Programmé'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex-1 font-semibold text-white">
                  {match.homeTeam.name}
                </span>

                <div className="text-center">
                  <Trophy className="mx-auto mb-2 h-5 w-5 text-gray-500" />

                  <span className="text-xl font-black text-white">
                    {match.homeScore ?? '-'}
                    {' - '}
                    {match.awayScore ?? '-'}
                  </span>
                </div>

                <span className="flex-1 text-right font-semibold text-white">
                  {match.awayTeam.name}
                </span>
              </div>

              <p className="mt-4 text-center text-xs text-gray-500">
                {new Date(match.startDate).toLocaleString('fr-BE')}
              </p>

              <div className="mt-5 border-t border-white/10 pt-4">
                {editingMatchId === match.id ? (
                  <form
                    onSubmit={handleSaveResult}
                    className="space-y-4"
                  >
                    <p className="text-sm font-semibold text-gray-300">
                      Saisir le résultat final
                    </p>

                    <div className="flex items-center justify-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        required
                        value={homeScore}
                        onChange={(event) =>
                          setHomeScore(event.target.value)
                        }
                        aria-label={`Buts ${match.homeTeam.name}`}
                        className="w-20 rounded-xl border border-white/10 bg-[#121a24] p-3 text-center text-xl font-bold text-white"
                      />

                      <span className="text-xl font-bold text-gray-500">
                        -
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="30"
                        required
                        value={awayScore}
                        onChange={(event) =>
                          setAwayScore(event.target.value)
                        }
                        aria-label={`Buts ${match.awayTeam.name}`}
                        className="w-20 rounded-xl border border-white/10 bg-[#121a24] p-3 text-center text-xl font-bold text-white"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 rounded-xl bg-lime-400 px-4 py-3 font-bold text-black disabled:opacity-50"
                      >
                        {saving
                          ? 'Enregistrement...'
                          : 'Enregistrer le résultat'}
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => setEditingMatchId(null)}
                        className="rounded-xl border border-white/10 px-4 py-3 text-gray-300 hover:bg-white/5"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEditing(match)}
                    className="w-full rounded-xl border border-lime-400/30 px-4 py-3 text-sm font-semibold text-lime-400 hover:bg-lime-400/10"
                  >
                    {match.status === 'FINISHED'
                      ? 'Modifier le résultat'
                      : 'Saisir le résultat'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
