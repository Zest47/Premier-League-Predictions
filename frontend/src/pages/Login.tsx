
import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LockKeyhole, LogIn } from 'lucide-react'

import { useAuth } from '../context/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login({ username, password })
      navigate('/')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c1118] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#19232e] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400 text-black">
            <LockKeyhole size={30} />
          </div>

          <h1 className="text-3xl font-black text-white">
            Connexion
          </h1>

          <p className="mt-3 text-gray-400">
            Connectez-vous à Premier League Predictions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-semibold text-gray-300"
            >
              Identifiant
            </label>

            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#121a24] px-4 py-3 text-white outline-none focus:border-lime-400"
              placeholder="Votre identifiant"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-300"
            >
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#121a24] px-4 py-3 text-white outline-none focus:border-lime-400"
              placeholder="Votre mot de passe"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 font-bold text-black hover:bg-lime-300 disabled:opacity-50"
          >
            <LogIn size={19} />
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-lime-400"
          >
            Retour au Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
