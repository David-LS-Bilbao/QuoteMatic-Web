import { Badge } from '../ui'

type ExploreSummaryProps = {
  catalogError: string | null
  isLoading: boolean
  totalQuotes: number
  hasActiveFilters: boolean
}

export function ExploreSummary({
  catalogError,
  isLoading,
  totalQuotes,
  hasActiveFilters,
}: ExploreSummaryProps) {
  return (
    <>
      {catalogError ? (
        <p className="explore-warning" role="status">
          {catalogError}
        </p>
      ) : null}

      <div className="explore-summary" aria-live="polite">
        {isLoading ? (
          <span>Afinando recomendación...</span>
        ) : (
          <span>
            {totalQuotes}{' '}
            {totalQuotes === 1 ? 'frase disponible' : 'frases disponibles'}
          </span>
        )}

        {hasActiveFilters ? <Badge variant="muted">Filtros activos</Badge> : null}
      </div>
    </>
  )
}
