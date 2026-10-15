
import type { Match } from '../types/api'

const ONE_HOUR_MS = 60 * 60 * 1000

export function getGameweekLockDate(
  matches: Match[],
  gameweek: number
): Date | null {
  const gameweekMatches = matches.filter(
    (match) => match.gameweek === gameweek
  )

  if (gameweekMatches.length === 0) {
    return null
  }

  const firstKickoff = Math.min(
    ...gameweekMatches.map((match) =>
      new Date(match.startDate).getTime()
    )
  )

  if (!Number.isFinite(firstKickoff)) {
    return null
  }

  return new Date(firstKickoff - ONE_HOUR_MS)
}

export function isGameweekLocked(
  matches: Match[],
  gameweek: number,
  now = new Date()
): boolean {
  const lockDate = getGameweekLockDate(matches, gameweek)

  if (!lockDate) {
    return true
  }

  return now.getTime() >= lockDate.getTime()
}
