import { Compass, LogOut, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { NavLink } from 'react-router'

import { useAuth } from '../../hooks/useAuth'

const publicNavItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/explore', label: 'Explorar' },
  { to: '/authors', label: 'Autores' },
  { to: '/about', label: 'Proyecto' },
]

export function Navbar() {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth()

  function handleLogout() {
    void logout()
  }

  return (
    <header className="site-header">
      <NavLink to="/" className="brand" aria-label="QuoteMatic Web">
        <span className="brand-mark" aria-hidden="true">
          <Sparkles size={20} />
        </span>
        <span className="brand-text">
          <strong>QuoteMatic</strong>
          <small>Frases con intención</small>
        </span>
      </NavLink>

      <nav className="site-nav" aria-label="Navegacion principal">
        {publicNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            {item.label}
          </NavLink>
        ))}

        {isAuthenticated ? (
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Mi cuenta
          </NavLink>
        ) : null}

        {isAdmin ? (
          <NavLink
            to="/admin/dev-panel"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Admin
          </NavLink>
        ) : null}
      </nav>

      <div className="nav-actions">
        {isLoading ? (
          <span className="nav-user-pill">Sesión...</span>
        ) : isAuthenticated ? (
          <>
            <span className="nav-user-pill">
              {isAdmin ? (
                <ShieldCheck aria-hidden="true" size={15} />
              ) : (
                <UserRound aria-hidden="true" size={15} />
              )}
              {user?.name ?? 'Usuario'}
            </span>

            <button
              className="nav-cta nav-cta-button"
              type="button"
              onClick={handleLogout}
            >
              <LogOut aria-hidden="true" size={16} />
              Salir
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-cta">
            <Compass aria-hidden="true" size={16} />
            Acceder
          </NavLink>
        )}
      </div>
    </header>
  )
}