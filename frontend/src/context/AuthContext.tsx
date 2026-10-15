import { useState, type ReactNode } from 'react'

import type { AuthUser, LoginRequest } from '../types/api'
import {
  login as loginRequest,
  logout as logoutRequest,
} from '../services/auth'

import { AuthContext } from './auth-context'

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<AuthUser | null>(null)

  async function login(credentials: LoginRequest) {
    const authenticatedUser = await loginRequest(credentials)
    setUser(authenticatedUser)
  }

  function logout() {
    logoutRequest()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}