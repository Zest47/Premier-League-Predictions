
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

import { register } from '../services/auth'

export default function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      })

      navigate('/login', {
        replace: true,
        state: { registrationSuccess: true },
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'inscription."
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-[#121a24] px-4 py-3 text-white outline-none focus:border-lime-400'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c1118] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#19232e] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-400 text-black">
            <UserPlus size={30} />
          </div>

          <h1 className="text-3xl font-black text-white">
            Créer un compte
          </h1>

          <p className="mt-3 text-gray-400">
            Rejoignez Premier League Predictions et commencez à pronostiquer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="register-username" className="mb-2 block text-sm font-semibold text-gray-300">
              Identifiant
            </label>
            <input
              id="register-username"
              type="text"
              autoComplete="username"
              required
              minLength={3}
              maxLength={50}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              placeholder="Votre identifiant"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-gray-300">
              Adresse email
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-gray-300">
              Mot de passe
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="8 caractères minimum"
            />
          </div>

          <div>
            <label htmlFor="register-confirm" className="mb-2 block text-sm font-semibold text-gray-300">
              Confirmer le mot de passe
            </label>
            <input
              id="register-confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="Répétez votre mot de passe"
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
            <UserPlus size={19} />
            {loading ? 'Création du compte...' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-semibold text-lime-400 hover:text-lime-300">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}
