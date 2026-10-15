import type { Match, LeaderboardEntry } from '../types/api'
import { getAccessToken } from './auth'
import type { Prediction, PredictionResult } from '../types/api'
import type { CreatePredictionRequest } from '../types/api'
import type { UpdatePredictionRequest } from '../types/api'
import type { UpdateMatchResultRequest } from '../types/api'

async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getMatches(): Promise<Match[]> {
  return apiGet<Match[]>('/api/matches')
}

export function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return apiGet<LeaderboardEntry[]>('/api/leaderboard')
}

async function authenticatedGet<T>(endpoint: string): Promise<T> {
  const token = getAccessToken()

  if (!token) {
    throw new Error('Vous devez être connecté.')
  }

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 401) {
    throw new Error('Session expirée. Veuillez vous reconnecter.')
  }

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getMyPredictions(): Promise<Prediction[]> {
  return authenticatedGet<Prediction[]>('/api/predictions/me')
}

export function getMyPredictionResults(): Promise<PredictionResult[]> {
  return authenticatedGet<PredictionResult[]>(
    '/api/predictions/me/results'
  )
}

export async function createPrediction(
  prediction: CreatePredictionRequest
): Promise<Prediction> {
  const token = getAccessToken()

  if (!token) {
    throw new Error('Vous devez être connecté.')
  }

  const response = await fetch('/api/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prediction),
  })

  if (!response.ok) {
  const errorBody: unknown = await response.json().catch(() => null)

  let backendMessage: string | null = null

  if (errorBody && typeof errorBody === 'object') {
    const body = errorBody as Record<string, unknown>

    if (typeof body.message === 'string') {
      backendMessage = body.message
    } else if (typeof body.error === 'string') {
      backendMessage = body.error
    }
  }

  if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
    }

    if (response.status === 403) {
        throw new Error('Vous ne pouvez plus pronostiquer cette journée.')
    }

    throw new Error(
        backendMessage || `Impossible de créer le pronostic (${response.status}).`
    )
    }

  return response.json() as Promise<Prediction>
}

export async function updatePrediction(
  predictionId: number,
  prediction: UpdatePredictionRequest
): Promise<Prediction> {
  const token = getAccessToken()

  if (!token) {
    throw new Error('Vous devez être connecté.')
  }

  const response = await fetch(`/api/predictions/${predictionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prediction),
  })

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => null)

    let backendMessage: string | null = null

    if (errorBody && typeof errorBody === 'object') {
      const body = errorBody as Record<string, unknown>

      if (typeof body.message === 'string') {
        backendMessage = body.message
      } else if (typeof body.error === 'string') {
        backendMessage = body.error
      }
    }

    if (response.status === 401) {
      throw new Error('Session expirée. Veuillez vous reconnecter.')
    }

    if (response.status === 403) {
      throw new Error('Modification interdite ou journée verrouillée.')
    }

    throw new Error(
      backendMessage ||
        `Impossible de modifier le pronostic (${response.status}).`
    )
  }

  return response.json() as Promise<Prediction>
}


export async function updateMatchResult(
  matchId: number,
  result: UpdateMatchResultRequest
): Promise<void> {
  const token = getAccessToken()

  if (!token) {
    throw new Error('Vous devez être connecté.')
  }

  const response = await fetch(`/api/admin/matches/${matchId}/result`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(result),
  })

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => null)

    let message: string | null = null

    if (errorBody && typeof errorBody === 'object') {
      const body = errorBody as Record<string, unknown>

      if (typeof body.message === 'string') {
        message = body.message
      } else if (typeof body.error === 'string') {
        message = body.error
      }
    }

    if (response.status === 401) {
      throw new Error('Session expirée. Reconnectez-vous.')
    }

    if (response.status === 403) {
      throw new Error('Accès réservé aux administrateurs.')
    }

    throw new Error(
      message ?? `Impossible d'enregistrer le résultat (${response.status}).`
    )
  }
}
