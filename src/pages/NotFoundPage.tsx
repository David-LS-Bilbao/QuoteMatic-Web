import { Home } from 'lucide-react'
import { Link } from 'react-router'

import { EmptyState } from '../components/ui'

export function NotFoundPage() {
  return (
    <section className="page-section placeholder-page">
      <EmptyState
        title="Página no encontrada"
        description="La ruta solicitada no existe dentro de QuoteMatic Web."
      >
        <Link className="ui-button ui-button-primary ui-button-md" to="/">
          <Home aria-hidden="true" size={18} />
          Volver al inicio
        </Link>
      </EmptyState>
    </section>
  )
}