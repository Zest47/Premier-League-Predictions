
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../types/api'

let accessToken: string | null = null

export async function login(
  credentials: LoginRequest
): Promise<AuthUser> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Identifiant ou mot de passe incorrect.')
    }

    throw new Error(`Erreur de connexion (${response.status}).`)
  }

  const data = (await response.json()) as LoginResponse

  if (!data.token) {
    throw new Error('Aucun token reçu du serveur.')
  }

  accessToken = data.token

  return {
    userId: data.userId,
    username: data.username,
    role: data.role,
  }
}

export function logout(): void {
  accessToken = null
}

export function getAccessToken(): string | null {
  return accessToken
}

export async function register(
  data: RegisterRequest
): Promise<void> {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error(
        'Cet identifiant ou cette adresse email est déjà utilisé.'
      )
    }

    if (response.status === 400) {
      throw new Error(
        'Les informations saisies sont invalides.'
      )
    }

    throw new Error(
      `Erreur lors de l'inscription (${response.status}).`
    )
  }
}
