import { Bookmark, RefreshCw, Send, Share2, Sparkles } from 'lucide-react'

import type { UseExploreQuotesResult } from '../../hooks/useExploreQuotes'
import { buildQuoteMeta, getAuthorName } from '../../utils/quoteHelpers'
import { EmptyState, QuoteCard } from '../ui'

type ExploreResultsProps = Pick<
  UseExploreQuotesResult,
  | 'quotesError'
  | 'isLoading'
  | 'quotes'
  | 'filters'
  | 'totalPages'
  | 'handleGenerateMore'
  | 'handleClearFilters'
>

export function ExploreResults({
  quotesError,
  isLoading,
  quotes,
  filters,
  totalPages,
  handleGenerateMore,
  handleClearFilters,
}: ExploreResultsProps) {
  const mainQuote = quotes[0]
  const secondaryQuote = quotes[1]

  if (quotesError) {
    return (
      <EmptyState title="No se pudieron cargar las frases" description={quotesError}>
        <button
          className="ui-button ui-button-secondary ui-button-md"
          type="button"
          onClick={handleGenerateMore}
        >
          Reintentar
        </button>
      </EmptyState>
    )
  }

  if (isLoading) {
    return (
      <div className="explore-result" aria-label="Frase cargando">
        <div className="explore-main-card">
          <QuoteCard
            quote="Buscando una frase en el universo QuoteMatic..."
            meta="Conectando con la API"
            isMock
          />
        </div>
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <EmptyState
        title="No hay frases con estos filtros"
        description="Prueba a limpiar la búsqueda o seleccionar otra situación."
      >
        <button
          className="ui-button ui-button-secondary ui-button-md"
          type="button"
          onClick={handleClearFilters}
        >
          Limpiar filtros
        </button>
      </EmptyState>
    )
  }

  return (
    <div className="explore-result" aria-label="Frase recomendada">
      <div className="explore-main-card">
        <div className="explore-result-label">
          <Sparkles aria-hidden="true" size={18} />
          Recomendación principal
        </div>

        <QuoteCard
          quote={mainQuote.text}
          author={getAuthorName(mainQuote)}
          meta={buildQuoteMeta(mainQuote) || 'Frase pública'}
        />
      </div>

      {secondaryQuote ? (
        <aside className="explore-secondary-card">
          <p className="explore-secondary-title">También puedes probar</p>

          <QuoteCard
            quote={secondaryQuote.text}
            author={getAuthorName(secondaryQuote)}
            meta={buildQuoteMeta(secondaryQuote) || 'Alternativa'}
          />
        </aside>
      ) : null}

      <div className="explore-actions" aria-label="Acciones de la frase recomendada">
        <div className="explore-actions-primary">
          <button
            className="ui-button ui-button-primary ui-button-md"
            type="button"
            onClick={handleGenerateMore}
            disabled={isLoading}
          >
            <RefreshCw aria-hidden="true" size={18} />
            Otra frase
          </button>

          {totalPages > 1 ? (
            <span className="explore-selection">
              Selección {filters.page} de {totalPages}
            </span>
          ) : null}
        </div>

        <div className="explore-actions-secondary" aria-label="Acciones futuras">
          <button
            className="ui-button ui-button-secondary ui-button-md explore-action-disabled"
            type="button"
            disabled
            title="Función de compartir preparada para una próxima versión"
            aria-label="Compartir frase próximamente"
          >
            <Share2 aria-hidden="true" size={18} />
            Compartir
            <span className="action-pill">Pronto</span>
          </button>

          <button
            className="ui-button ui-button-secondary ui-button-md explore-action-disabled"
            type="button"
            disabled
            title="Guardar favoritos estará disponible con autenticación"
            aria-label="Guardar frase próximamente"
          >
            <Bookmark aria-hidden="true" size={18} />
            Guardar
            <span className="action-pill">Pronto</span>
          </button>

          <button
            className="ui-button ui-button-secondary ui-button-md explore-action-disabled"
            type="button"
            disabled
            title="Enviar frase estará disponible en una próxima versión"
            aria-label="Enviar frase próximamente"
          >
            <Send aria-hidden="true" size={18} />
            Enviar
            <span className="action-pill">Pronto</span>
          </button>
        </div>
      </div>
    </div>
  )
}
