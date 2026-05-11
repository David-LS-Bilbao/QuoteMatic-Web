// Página de exploración — placeholder hasta conectar con la API de QuoteMatic.

import { Filter, Shuffle, SlidersHorizontal } from 'lucide-react'

import { Badge, EmptyState } from '../components/ui'

export function ExplorePage() {
  return (
    <section className="page-section placeholder-page">
      <div className="placeholder-header">
        <div className="home-badges">
          <Badge>Explorador</Badge>
          <Badge variant="accent">Próxima conexión API</Badge>
        </div>

        <p className="eyebrow">MVP público</p>
        <h1>Explorar frases</h1>
      </div>

      <EmptyState
        title="Explorador de frases en preparación"
        description="Esta pantalla se conectará después con filtros, situaciones y frase aleatoria desde la API real de QuoteMatic."
      >
        <div className="placeholder-actions">
          <span>
            <Shuffle aria-hidden="true" size={16} />
            Frase aleatoria
          </span>
          <span>
            <Filter aria-hidden="true" size={16} />
            Filtros por situación
          </span>
          <span>
            <SlidersHorizontal aria-hidden="true" size={16} />
            Tipos de frase
          </span>
        </div>
      </EmptyState>
    </section>
  )
}
