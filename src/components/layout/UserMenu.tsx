import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, ShieldCheck, UserRound } from 'lucide-react'
import { NavLink } from 'react-router'

import { useAuth } from '../../hooks/useAuth'

export function UserMenu() {
  const { user, isAdmin, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function close() {
    setIsOpen(false)
  }

  function handleLogout() {
    close()
    void logout()
  }

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="user-menu" ref={containerRef}>
      <button
        className="user-menu-trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Menú de usuario"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isAdmin ? (
          <ShieldCheck aria-hidden="true" size={15} />
        ) : (
          <UserRound aria-hidden="true" size={15} />
        )}
        <span className="user-menu-name">{user?.name ?? 'Usuario'}</span>
        <ChevronDown
          aria-hidden="true"
          size={14}
          className={isOpen ? 'user-menu-chevron open' : 'user-menu-chevron'}
        />
      </button>

      {isOpen ? (
        <div className="user-menu-dropdown" role="menu">
          <NavLink
            to="/favorites"
            className="user-menu-item"
            role="menuitem"
            onClick={close}
          >
            Favoritos
          </NavLink>

          <NavLink
            to="/my-quotes"
            className="user-menu-item"
            role="menuitem"
            onClick={close}
          >
            Mis frases
          </NavLink>

          <NavLink
            to="/account"
            className="user-menu-item"
            role="menuitem"
            onClick={close}
          >
            Mi cuenta
          </NavLink>

          {isAdmin ? (
            <NavLink
              to="/admin/dev-panel"
              className="user-menu-item"
              role="menuitem"
              onClick={close}
            >
              Admin
            </NavLink>
          ) : null}

          <div className="user-menu-separator" role="separator" />

          <button
            className="user-menu-item user-menu-logout"
            type="button"
            role="menuitem"
            onClick={handleLogout}
          >
            <LogOut aria-hidden="true" size={15} />
            Salir
          </button>
        </div>
      ) : null}
    </div>
  )
}
