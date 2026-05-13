import { Compass, Moon, Sun } from 'lucide-react'
import { NavLink } from 'react-router'

import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { UserMenu } from './UserMenu'

const publicNavItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/explore', label: 'Explorar' },
  { to: '/authors', label: 'Autores' },
  { to: '/about', label: 'Proyecto' },
]

export function Navbar() {
  const { isAuthenticated, isLoading } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <header className="site-header">
      <NavLink to="/" className="brand" aria-label="QuoteMatic Web">
        <span className="brand-mark" aria-hidden="true">
          <img src="/quotematic-logo.svg" width="22" height="22" alt="" />
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
      </nav>

      <div className="nav-actions">
        <button
          className="nav-theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark ? (
            <Sun aria-hidden="true" size={18} />
          ) : (
            <Moon aria-hidden="true" size={18} />
          )}
        </button>

        {isLoading ? (
          <span className="nav-user-pill">Sesión...</span>
        ) : isAuthenticated ? (
          <UserMenu />
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
