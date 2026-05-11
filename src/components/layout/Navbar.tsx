import { Compass, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router'

const navItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/explore', label: 'Explorar' },
  { to: '/authors', label: 'Autores' },
  { to: '/about', label: 'Proyecto' },
]

export function Navbar() {
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
        {navItems.map((item) => (
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

      <NavLink to="/explore" className="nav-cta">
        <Compass aria-hidden="true" size={16} />
        Explorar
      </NavLink>
    </header>
  )
}
