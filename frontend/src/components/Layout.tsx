
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  Target,
  Trophy,
  CircleUserRound,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react'

import { useAuth } from '../context/useAuth'

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Matchs', path: '/matches', icon: CalendarDays },
  { name: 'Mes pronostics', path: '/predictions', icon: Target },
  { name: 'Classement', path: '/leaderboard', icon: Trophy },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0c1118] text-white md:flex">
      <aside className="border-b border-white/10 bg-[#121a24] p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-lime-400 p-3 text-xl font-black text-black">
            PL
          </div>
          <div>
            <h1 className="font-black">PL Predictions</h1>
            <p className="text-xs text-gray-400">Saison 2026/27</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {navigation.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-lime-400 text-black'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={19} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 border-t border-white/10 pt-6">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CircleUserRound size={24} className="text-lime-400" />
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-xs text-gray-400">
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <LogOut size={19} />
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-3 rounded-xl bg-lime-400 px-4 py-3 font-bold text-black hover:bg-lime-300"
            >
              <LogIn size={19} />
              Se connecter
            </Link>
          )}
          {user?.role === 'ADMIN' && (
        <NavLink
            to="/admin/matches"
            className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                ? 'bg-lime-400 text-black'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
            }
        >
            <ShieldCheck className="h-5 w-5" />
            Administration
        </NavLink>
        )}
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
