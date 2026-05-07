import { Sparkles } from 'lucide-react'
import { NavLink } from 'react-router'

const navItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/explore', label: 'Explorar' },
  { to: '/authors', label: 'Autores' },
  { to: '/about', label: 'Sobre el proyecto' },
]

export function Navbar() {
  return (
    <header className="site-header">
      <NavLink to="/" className="brand" aria-label="QuoteMatic Web">
        <Sparkles aria-hidden="true" size={22} />
        <span>QuoteMatic Web</span>
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
    </header>
  )
}
