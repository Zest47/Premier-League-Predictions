
import type { Match } from '../types/api'

export function getCurrentGameweek(matches: Match[]): number | null {
  if (matches.length === 0) {
    return null
  }

  const now = Date.now()

  const gameweeks = [...new Set(matches.map((match) => match.gameweek))]
    .sort((a, b) => a - b)

  // Chercher la première journée ayant un match futur
  const nextGameweek = gameweeks.find((gameweek) =>
    matches.some(
      (match) =>
        match.gameweek === gameweek &&
        match.status === 'SCHEDULED' &&
        new Date(match.startDate).getTime() >= now
    )
  )

  if (nextGameweek !== undefined) {
    return nextGameweek
  }

  // Aucun match futur : sélectionner la journée la plus récente
  const mostRecentMatch = [...matches].sort(
    (a, b) =>
      new Date(b.startDate).getTime() -
      new Date(a.startDate).getTime()
  )[0]

  return mostRecentMatch.gameweek
}
