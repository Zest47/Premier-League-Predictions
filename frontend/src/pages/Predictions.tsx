import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Target, Trophy } from 'lucide-react'

import { useAuth } from '../context/useAuth'

import {
  getMatches,
  getMyPredictions,
  getMyPredictionResults,
  createPrediction,
  updatePrediction,
} from '../services/api'

import type {
  Match,
  Prediction,
  PredictionResult,
} from '../types/api'

import {
  getGameweekLockDate,
  isGameweekLocked,
} from '../utils/predictionLock'

export default function Predictions() {
  const { user } = useAuth()

  const [matches, setMatches] = useState<Match[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [results, setResults] = useState<PredictionResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null)
  const [homeScore, setHomeScore] = useState('0')
  const [awayScore, setAwayScore] = useState('0')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingPredictionId, setEditingPredictionId] = useState<number | null>(null)
  const [editHomeScore, setEditHomeScore] = useState('0')
  const [editAwayScore, setEditAwayScore] = useState('0')
  const [updating, setUpdating] = useState(false)

  type PredictionTab = 'available' | 'mine' | 'results'

  const [activeTab, setActiveTab] = useState<PredictionTab>('available')

  useEffect(() => {
    if (!user) return

    let active = true

    Promise.all([
      getMatches(),
      getMyPredictions(),
      getMyPredictionResults(),
    ])
      .then(([matchesData, predictionsData, resultsData]) => {
        if (!active) return

        setMatches(matchesData)
        setPredictions(predictionsData)
        setResults(resultsData)
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'Impossible de charger les pronostics.'
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

  async function handleCreatePrediction(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (selectedMatchId === null) return

        setSaving(true)
        setError(null)
        setSuccess(null)

        try {
            await createPrediction({
            matchId: selectedMatchId,
            homeScore: Number(homeScore),
            awayScore: Number(awayScore),
            })

            const [updatedPredictions, updatedResults] = await Promise.all([
            getMyPredictions(),
            getMyPredictionResults(),
            ])

            setPredictions(updatedPredictions)
            setResults(updatedResults)

            setSelectedMatchId(null)
            setHomeScore('0')
            setAwayScore('0')

            setSuccess('Votre pronostic a été enregistré avec succès !')
        } catch (err) {
            setError(
            err instanceof Error
                ? err.message
                : 'Impossible de créer le pronostic.'
            )
        } finally {
            setSaving(false)
        }
        }

        
        function startEditing(prediction: Prediction) {
        setEditingPredictionId(prediction.id)
        setEditHomeScore(String(prediction.predictedHomeScore))
        setEditAwayScore(String(prediction.predictedAwayScore))
        setError(null)
        setSuccess(null)
        }

        async function handleUpdatePrediction(
        event: FormEvent<HTMLFormElement>
        ) {
        event.preventDefault()

        if (editingPredictionId === null) return

        setUpdating(true)
        setError(null)
        setSuccess(null)

        try {
            await updatePrediction(editingPredictionId, {
            homeScore: Number(editHomeScore),
            awayScore: Number(editAwayScore),
            })

            const [updatedPredictions, updatedResults] = await Promise.all([
            getMyPredictions(),
            getMyPredictionResults(),
            ])

            setPredictions(updatedPredictions)
            setResults(updatedResults)
            setEditingPredictionId(null)

            setSuccess('Votre pronostic a été modifié avec succès !')
        } catch (err) {
            setError(
            err instanceof Error
                ? err.message
                : 'Impossible de modifier le pronostic.'
            )
        } finally {
            setUpdating(false)
        }
        }


  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-black">Mes pronostics</h1>
        <p className="text-gray-400">
          Connectez-vous pour consulter vos pronostics.
        </p>

        <Link
          to="/login"
          className="inline-block rounded-xl bg-lime-400 px-6 py-3 font-bold text-black"
        >
          Se connecter
        </Link>
      </div>
    )
  }

  const totalPoints = results.reduce(
    (sum, result) => sum + result.points,
    0
  )

  const predictedMatchIds = new Set(
   predictions.map((prediction) => prediction.matchId)
  )

  const availableMatches = matches
  .filter(
    (match) =>
      match.status === 'SCHEDULED' &&
      !predictedMatchIds.has(match.id) &&
      !isGameweekLocked(matches, match.gameweek)
  )
  .sort(
    (a, b) =>
      new Date(a.startDate).getTime() -
      new Date(b.startDate).getTime()
  )

  const activePredictions = predictions.filter((prediction) => {
    const match = matches.find((item) => item.id === prediction.matchId)
    return match?.status !== 'FINISHED'
  })

  const finishedPredictions = predictions.filter((prediction) => {
    const match = matches.find((item) => item.id === prediction.matchId)
    return match?.status === 'FINISHED'
  })

  const displayedPredictions =
  activeTab === 'mine'
    ? activePredictions
    : activeTab === 'results'
      ? finishedPredictions
      : []

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-lime-400">
          ESPACE JOUEUR
        </p>
        <h1 className="mt-2 text-3xl font-black">
          Mes pronostics
        </h1>
        <p className="mt-2 text-gray-400">
          Retrouvez vos pronostics et vos points.
        </p>
      </header>

      {loading && (
        <p className="text-gray-400">Chargement des pronostics...</p>
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
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#19232e] p-6">
              <Target size={22} className="text-lime-400" />
              <p className="mt-4 text-sm text-gray-400">
                Pronostics enregistrés
              </p>
              <p className="mt-2 text-3xl font-black">
                {predictions.length}
              </p>
            </div>

            <div className="rounded-2xl bg-[#19232e] p-6">
              <Trophy size={22} className="text-lime-400" />
              <p className="mt-4 text-sm text-gray-400">
                Points obtenus
              </p>
              <p className="mt-2 text-3xl font-black">
                {totalPoints}
              </p>
            </div>
          </section>

          
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
            {[
                {
                id: 'available',
                label: 'À pronostiquer',
                count: availableMatches.length,
                },
                {
                id: 'mine',
                label: 'Mes pronostics',
                count: activePredictions.length,
                },
                {
                id: 'results',
                label: 'Résultats',
                count: finishedPredictions.length,
                },
            ].map((tab) => (
                <button
                key={tab.id}
                type="button"
                onClick={() => {
                    setActiveTab(tab.id as PredictionTab)
                    setError(null)
                    setSuccess(null)
                }}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    activeTab === tab.id
                    ? 'bg-lime-400 text-black'
                    : 'bg-[#19232e] text-gray-400 hover:text-white'
                }`}
                >
                {tab.label}
                <span className="ml-2 opacity-70">({tab.count})</span>
                </button>
            ))}
            </div>

        {activeTab === 'available' && (
        <>
                <section className="space-y-5">
                    <div>
                        <h2 className="text-xl font-bold">
                        Pronostiquer les matchs
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                        Sélectionnez un match et indiquez votre score.
                        </p>
                    </div>

                    {success && (
                        <div
                        role="status"
                        className="rounded-xl border border-lime-400/30 bg-lime-400/10 p-4 text-lime-300"
                        >
                        {success}
                        </div>
                    )}

                    {availableMatches.length === 0 ? (
                        <p className="rounded-2xl bg-[#19232e] p-6 text-gray-400">
                        Aucun match disponible pour un nouveau pronostic.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                        {availableMatches.map((match) => (
                            <div
                            key={match.id}
                            className="rounded-2xl border border-white/5 bg-[#19232e] p-6"
                            >
                            <p className="mb-4 text-xs font-bold text-lime-400">
                                JOURNÉE {match.gameweek}
                            </p>

                            <h3 className="font-bold">
                                {match.homeTeam.name} - {match.awayTeam.name}
                            </h3>

                            <p className="mt-2 text-sm text-gray-400">
                                {new Date(match.startDate).toLocaleString('fr-BE')}
                            </p>

                            <p className="mt-2 text-xs text-amber-300">
                                Pronostics ouverts jusqu'au{' '}
                                {getGameweekLockDate(matches, match.gameweek)?.toLocaleString(
                                    'fr-BE',
                                    {
                                    dateStyle: 'short',
                                    timeStyle: 'short',
                                    }
                                )}
                            </p>

                            {selectedMatchId === match.id ? (
                                <form
                                onSubmit={handleCreatePrediction}
                                className="mt-5 space-y-4"
                                >
                                <div className="flex items-center justify-center gap-3">
                                    <input
                                    type="number"
                                    min="0"
                                    max="30"
                                    required
                                    value={homeScore}
                                    onChange={(event) => setHomeScore(event.target.value)}
                                    className="w-20 rounded-xl border border-white/10 bg-[#121a24] p-3 text-center text-xl font-bold text-white"
                                    aria-label={`Buts ${match.homeTeam.name}`}
                                    />

                                    <span className="text-xl font-black text-gray-500">
                                    -
                                    </span>

                                    <input
                                    type="number"
                                    min="0"
                                    max="30"
                                    required
                                    value={awayScore}
                                    onChange={(event) => setAwayScore(event.target.value)}
                                    className="w-20 rounded-xl border border-white/10 bg-[#121a24] p-3 text-center text-xl font-bold text-white"
                                    aria-label={`Buts ${match.awayTeam.name}`}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full rounded-xl bg-lime-400 px-4 py-3 font-bold text-black hover:bg-lime-300 disabled:opacity-50"
                                >
                                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                                </form>
                            ) : (
                                <button
                                type="button"
                                onClick={() => {
                                    setSelectedMatchId(match.id)
                                    setHomeScore('0')
                                    setAwayScore('0')
                                    setSuccess(null)
                                }}
                                className="mt-5 w-full rounded-xl border border-lime-400/30 px-4 py-3 font-semibold text-lime-400 hover:bg-lime-400/10"
                                >
                                Pronostiquer
                                </button>
                            )}
                            </div>
                        ))}
                        </div>
                    )}
                </section>
        </>
        )}

        {activeTab !== 'available' && (
        <>
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">
                {activeTab === 'results'
                    ? 'Résultats de mes pronostics'
                    : 'Mes pronostics enregistrés'}
                </h2>

            {predictions.length === 0 && (
              <p className="text-gray-400">
                Vous n'avez pas encore enregistré de pronostic.
              </p>
            )}

            {displayedPredictions.map((prediction) => {
              const match = matches.find(
                (item) => item.id === prediction.matchId
              )

              const result = results.find(
                (item) => item.predictionId === prediction.id
              )

              return (
                <div
                  key={prediction.id}
                  className="rounded-2xl border border-white/5 bg-[#19232e] p-6"
                >
                  <p className="mb-4 text-xs font-semibold text-lime-400">
                    {match
                      ? `Journée ${match.gameweek}`
                      : `Match #${prediction.matchId}`}
                  </p>

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <p className="font-bold">
                        {match?.homeTeam.name ?? 'Équipe domicile'}
                      </p>
                      <p className="font-bold">
                        {match?.awayTeam.name ?? 'Équipe extérieur'}
                      </p>
                    </div>

                    <div className="space-y-2 text-right text-xl font-black">
                      <p>{prediction.predictedHomeScore}</p>
                      <p>{prediction.predictedAwayScore}</p>
                    </div>
                  </div>

                  
            {match?.status === 'SCHEDULED' &&
                !isGameweekLocked(matches, match.gameweek) && (
            <div className="mt-5">
                {editingPredictionId === prediction.id ? (
                <form
                    onSubmit={handleUpdatePrediction}
                    className="space-y-4 rounded-xl bg-[#121a24] p-4"
                >
                    <p className="text-sm font-semibold text-gray-300">
                    Modifier mon pronostic
                    </p>

                    <div className="flex items-center justify-center gap-3">
                    <input
                        type="number"
                        min="0"
                        max="30"
                        required
                        value={editHomeScore}
                        onChange={(event) => setEditHomeScore(event.target.value)}
                        aria-label={`Buts ${match.homeTeam.name}`}
                        className="w-20 rounded-xl border border-white/10 bg-[#19232e] p-3 text-center text-xl font-bold text-white"
                    />

                    <span className="text-xl font-black text-gray-500">-</span>

                    <input
                        type="number"
                        min="0"
                        max="30"
                        required
                        value={editAwayScore}
                        onChange={(event) => setEditAwayScore(event.target.value)}
                        aria-label={`Buts ${match.awayTeam.name}`}
                        className="w-20 rounded-xl border border-white/10 bg-[#19232e] p-3 text-center text-xl font-bold text-white"
                    />
                    </div>

                    <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 rounded-xl bg-lime-400 px-4 py-3 font-bold text-black disabled:opacity-50"
                    >
                        {updating ? 'Modification...' : 'Enregistrer'}
                    </button>

                    <button
                        type="button"
                        disabled={updating}
                        onClick={() => setEditingPredictionId(null)}
                        className="rounded-xl border border-white/10 px-4 py-3 text-gray-300 hover:bg-white/5"
                    >
                        Annuler
                    </button>
                    </div>
                </form>
                ) : (
                <button
                    type="button"
                    onClick={() => startEditing(prediction)}
                    className="rounded-xl border border-lime-400/30 px-4 py-2 text-sm font-semibold text-lime-400 hover:bg-lime-400/10"
                >
                    Modifier mon pronostic
                </button>
                )}

                {match && isGameweekLocked(matches, match.gameweek) && (
                    <p className="mt-4 text-xs font-semibold text-amber-300">
                        <span aria-hidden="true">🔒</span> Journée verrouillée
                    </p>
                    )}
            </div>
            )}

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                    <span className="text-gray-400">
                      {match?.status === 'FINISHED'
                        ? 'Match terminé'
                        : 'En attente du résultat'}
                    </span>

                    {result && (
                      <span className="font-bold text-lime-400">
                        +{result.points} pts
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </section>
          </>
        )}
        </>
      )}
      
    </div>
  )
}
