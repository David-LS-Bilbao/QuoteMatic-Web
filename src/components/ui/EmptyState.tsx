// Componente EmptyState reutilizable

import type { ReactNode } from 'react'

// Tipos de propiedades
type EmptyStateProps = {
  title: string
  description?: string
  children?: ReactNode
}

// Componente EmptyState
export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <h2 className="empty-state-title">{title}</h2>

      {description ? (
        <p className="empty-state-description">{description}</p>
      ) : null}

      {children ? <div className="empty-state-actions">{children}</div> : null}
    </section>
  )
}

/*
crea un estado vacío simple para páginas todavía no conectadas a la API.
*/
