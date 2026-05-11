// author page
import { BookOpen, Search, Users } from 'lucide-react'

import { Badge, EmptyState } from '../components/ui'

// Componente AuthorsPage 
export function AuthorsPage() {
  return (
    <section className="page-section placeholder-page">
      <div className="placeholder-header">
        <div className="home-badges">
          <Badge>Catálogo</Badge>
          <Badge variant="muted">Autores</Badge>
        </div>

        <p className="eyebrow">Catálogo</p>
        <h1>Autores</h1>
      </div>

      <EmptyState
        title="Listado de autores pendiente de conexión"
        description="Aquí se mostrará el catálogo de autores disponible en la API, con búsqueda y acceso a sus frases relacionadas."
      >
        <div className="placeholder-actions">
          <span>
            <Users aria-hidden="true" size={16} />
            Autores
          </span>
          <span>
            <Search aria-hidden="true" size={16} />
            Búsqueda
          </span>
          <span>
            <BookOpen aria-hidden="true" size={16} />
            Frases asociadas
          </span>
        </div>
      </EmptyState>
    </section>
  )
}