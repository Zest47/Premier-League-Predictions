
export interface Team {
  id: number
  name: string
}

export interface Match {
  id: number
  gameweek: number
  homeTeam: Team
  awayTeam: Team
  startDate: string
  homeScore: number | null
  awayScore: number | null
  status: string
}

export interface LeaderboardEntry {
  rank: number
  userId: number
  totalPoints: number
  exactScores: number
  correctResults: number
  predictionsCount: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userId: number
  username: string
  role: string
}

export interface AuthUser {
  userId: number
  username: string
  role: string
}

export interface Prediction {
  id: number
  userId: number
  matchId: number
  predictedHomeScore: number
  predictedAwayScore: number
  createdAt: string
  updatedAt: string
}

export interface PredictionResult {
  predictionId: number
  matchId: number
  predictedHomeScore: number
  predictedAwayScore: number
  actualHomeScore: number | null
  actualAwayScore: number | null
  matchStatus: string
  points: number
}

export interface CreatePredictionRequest {
  matchId: number
  homeScore: number
  awayScore: number
}

export interface UpdatePredictionRequest {
  homeScore: number
  awayScore: number
}

export interface UpdateMatchResultRequest {
  homeScore: number
  awayScore: number
}