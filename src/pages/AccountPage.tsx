import { LogOut, ShieldCheck, UserRound } from 'lucide-react'

import { Badge, EmptyState } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

export function AccountPage() {
  const { user, isAdmin, logout } = useAuth()

  if (!user) {
    return (
      <EmptyState
        title="No hay sesión activa"
        description="Inicia sesión para acceder a tu cuenta."
      />
    )
  }

  function handleLogout() {
    void logout()
  }

  return (
    <section className="page-section account-page">
      <div className="auth-card">
        <div className="home-badges">
          <Badge>Mi cuenta</Badge>
          {isAdmin ? <Badge variant="accent">Admin</Badge> : <Badge variant="muted">User</Badge>}
        </div>

        <div>
          <p className="eyebrow">Sesión activa</p>
          <h1>{user.name ?? 'Usuario'}</h1>
          <p className="page-lead">
            Desde aquí podrás gestionar tus favoritos, frases privadas y futuras
            acciones de envío.
          </p>
        </div>

        <div className="account-grid">
          <article className="account-panel">
            <UserRound aria-hidden="true" size={22} />
            <div>
              <strong>{user.email ?? 'Email no disponible'}</strong>
              <span>Usuario autenticado</span>
            </div>
          </article>

          <article className="account-panel">
            <ShieldCheck aria-hidden="true" size={22} />
            <div>
              <strong>{isAdmin ? 'Administrador' : 'Usuario'}</strong>
              <span>
                {isAdmin
                  ? 'Acceso preparado para panel admin/dev'
                  : 'Acceso preparado para favoritos y frases privadas'}
              </span>
            </div>
          </article>
        </div>

        <button
          className="ui-button ui-button-secondary ui-button-md"
          type="button"
          onClick={handleLogout}
        >
          <LogOut aria-hidden="true" size={18} />
          Cerrar sesión
        </button>
      </div>
    </section>
  )
}