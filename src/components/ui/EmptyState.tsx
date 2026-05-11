import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  children?: ReactNode
}

/** Estado vacío para páginas pendientes de conexión con la API. */
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
