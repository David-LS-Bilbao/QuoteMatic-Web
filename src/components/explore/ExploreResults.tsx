import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router'

import type { UseExploreQuotesResult } from '../../hooks/useExploreQuotes'
import { useAuth } from '../../hooks/useAuth'
import { useFavorites } from '../../hooks/useFavorites'
import {
  buildQuoteMeta,
  getAuthorId,
  getAuthorName,
} from '../../utils/quoteHelpers'
import { buildShareText, copyText } from '../../utils/shareChannels'
import { EmptyState, QuoteCard } from '../ui'
import { ShareQuoteActions } from '../share/ShareQuoteActions'

type ExploreResultsProps = Pick<
  UseExploreQuotesResult,
  | 'quotesError'
  | 'isLoading'
  | 'isResultsTransitioning'
  | 'hasCompletedInitialLoad'
  | 'quotes'
  | 'filters'
  | 'totalPages'
  | 'handleGenerateMore'
  | 'handleClearFilters'
>

export function ExploreResults({
  quotesError,
  isLoading,
  isResultsTransitioning,
  hasCompletedInitialLoad,
  quotes,
  filters,
  totalPages,
  handleGenerateMore,
  handleClearFilters,
}: ExploreResultsProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { isFavorite, pendingQuoteIds, toggleFavorite } = useFavorites()

  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const showCopyFeedback = useCallback((message: string) => {
    setCopyFeedback(message)
    if (copyTimerRef.current !== null) clearTimeout(copyTimerRef.current)
    copyTimerRef.current = setTimeout(() => setCopyFeedback(null), 2500)
  }, [])

  const mainQuote = quotes[0]
  const mainQuoteId = mainQuote?._id

  const isMainQuoteFavorite = mainQuoteId ? isFavorite(mainQuoteId) : false
  const isFavoritePending = mainQuoteId ? pendingQuoteIds.has(mainQuoteId) : false

  function handleFavoriteClick() {
    if (!mainQuoteId) {
      return
    }

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    void toggleFavorite(mainQuoteId)
  }

  async function handleCopyClick() {
    if (!mainQuote) return
    const text = buildShareText(mainQuote.text, getAuthorName(mainQuote))
    const ok = await copyText(text)
    showCopyFeedback(ok ? 'Copiado' : 'Error al copiar')
  }

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

  if (isLoading && quotes.length === 0 && !hasCompletedInitialLoad) {
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
    <div
      className={
        isResultsTransitioning
          ? 'explore-result explore-result-transition explore-result-transition-active'
          : 'explore-result explore-result-transition'
      }
      aria-label="Frase recomendada"
    >
      <div className="explore-main-card">
        <div className="explore-result-label">
          <Sparkles aria-hidden="true" size={18} />
          Frase recomendada
        </div>

        <QuoteCard
          quote={mainQuote.text}
          author={getAuthorName(mainQuote)}
          authorHref={
            getAuthorId(mainQuote)
              ? `/authors/${getAuthorId(mainQuote)}`
              : undefined
          }
          meta={buildQuoteMeta(mainQuote) || 'Frase pública'}
        />
      </div>

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

        <div className="explore-actions-secondary" aria-label="Acciones de frase">
          <button
            className={
              isMainQuoteFavorite
                ? 'ui-button ui-button-secondary ui-button-md explore-action-active'
                : 'ui-button ui-button-secondary ui-button-md'
            }
            type="button"
            onClick={handleFavoriteClick}
            disabled={!mainQuoteId || isFavoritePending}
            aria-pressed={isMainQuoteFavorite}
            title={
              isAuthenticated
                ? 'Guardar o quitar favorito'
                : 'Inicia sesión para guardar favoritos'
            }
          >
            {isMainQuoteFavorite ? (
              <BookmarkCheck aria-hidden="true" size={18} />
            ) : (
              <Bookmark aria-hidden="true" size={18} />
            )}

            {isFavoritePending
              ? 'Guardando...'
              : isMainQuoteFavorite
                ? 'Guardada'
                : 'Guardar'}

            {!isAuthenticated ? <span className="action-pill">Login</span> : null}
          </button>

          <button
            className="ui-button ui-button-secondary ui-button-md"
            type="button"
            onClick={() => void handleCopyClick()}
            disabled={!mainQuote}
            aria-label="Copiar la frase al portapapeles"
          >
            <Copy aria-hidden="true" size={18} />
            Copiar
          </button>

          {mainQuote ? (
            <ShareQuoteActions quote={mainQuote} variant="compact" />
          ) : null}
        </div>

        {copyFeedback ? (
          <p
            className="explore-actions-feedback"
            role="status"
            aria-live="polite"
          >
            {copyFeedback}
          </p>
        ) : null}
      </div>
    </div>
  )
}
