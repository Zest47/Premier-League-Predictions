import { createContext } from 'react'
import type { AuthUser, LoginRequest } from '../types/api'

export interface AuthContextType {
  user: AuthUser | null
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)