import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router'

import { EmptyState } from '../ui'
import { useAuth } from '../../hooks/useAuth'


type ProtectedRouteProps = {
  children?: ReactNode
  requireAdmin?: boolean
}


export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <EmptyState
        title="Comprobando sesión"
        description="Estamos verificando tu acceso a QuoteMatic."
      />
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <EmptyState
        title="Acceso restringido"
        description="Esta zona está reservada para usuarios administradores."
      />
    )
  }

  return children ?? <Outlet />
}