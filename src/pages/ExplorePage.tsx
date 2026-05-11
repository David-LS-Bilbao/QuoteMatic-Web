import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'

import { Badge, EmptyState, QuoteCard } from '../components/ui'
import { getQuoteTypes, getSituations } from '../services/catalogService'
import { getQuotes } from '../services/quotesService'
import type { Quote } from '../types/quote'
import type { QuoteType, Situation } from '../types/catalog'

const STORAGE_KEY = 'quotematic:explore-filters'
const PAGE_SIZE = 2

type ExploreFilters = {
  search: string
  situation: string
  quoteType: string
  page: number
}

type SavedExploreFilters = Partial<Omit<ExploreFilters, 'page'>>

function getInitialFilters(): ExploreFilters {
  const fallback: ExploreFilters = {
    search: '',
    situation: '',
    quoteType: '',
    page: 1,
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return fallback
    }

    const saved = JSON.parse(raw) as SavedExploreFilters

    return {
      search: saved.search ?? '',
      situation: saved.situation ?? '',
      quoteType: saved.quoteType ?? '',
      page: 1,
    }
  } catch {
    return fallback
  }
}

function getAuthorName(quote: Quote) {
  if (quote.authorText) {
    return quote.authorText
  }

  if (typeof quote.author === 'object' && quote.author?.name) {
    return quote.author.name
  }

  if (typeof quote.author === 'string') {
    return quote.author
  }

  return 'Autor desconocido'
}

function getCategoryName(value: Quote['situation'] | Quote['quoteType']) {
  if (!value) {
    return undefined
  }

  if (typeof value === 'string') {
    return value
  }

  return value.name ?? value.slug
}

function buildQuoteMeta(quote: Quote) {
  return [getCategoryName(quote.situation), getCategoryName(quote.quoteType)]
    .filter(Boolean)
    .join(' · ')
}

export function ExplorePage() {
  const [filters, setFilters] = useState<ExploreFilters>(getInitialFilters)
  const [searchInput, setSearchInput] = useState(filters.search)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [situations, setSituations] = useState<Situation[]>([])
  const [quoteTypes, setQuoteTypes] = useState<QuoteType[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalQuotes, setTotalQuotes] = useState(0)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [quotesError, setQuotesError] = useState<string | null>(null)

  const mainQuote = quotes[0]
  const secondaryQuote = quotes[1]

  const hasActiveFilters = useMemo(
    () => Boolean(filters.search || filters.situation || filters.quoteType),
    [filters.search, filters.situation, filters.quoteType],
  )

  useEffect(() => {
    Promise.all([getSituations(), getQuoteTypes()])
      .then(([situationsData, quoteTypesData]) => {
        setSituations(situationsData)
        setQuoteTypes(quoteTypesData)
        setCatalogError(null)
      })
      .catch(() => {
        setSituations([])
        setQuoteTypes([])
        setCatalogError(
          'No hemos podido cargar los filtros. Puedes seguir explorando frases.',
        )
      })
  }, [])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        search: filters.search,
        situation: filters.situation,
        quoteType: filters.quoteType,
      }),
    )
  }, [filters.search, filters.situation, filters.quoteType])

  useEffect(() => {
    let isMounted = true

    getQuotes({
      search: filters.search || undefined,
      situation: filters.situation || undefined,
      quoteType: filters.quoteType || undefined,
      page: filters.page,
      limit: PAGE_SIZE,
    })
      .then((response) => {
        if (!isMounted) return

        setQuotes(response.data)
        setTotalPages(response.meta.totalPages || 1)
        setTotalQuotes(response.meta.total)
        setQuotesError(null)
      })
      .catch(() => {
        if (!isMounted) return

        setQuotes([])
        setTotalPages(1)
        setTotalQuotes(0)
        setQuotesError(
          'No hemos podido cargar frases. Revisa la conexión o prueba otros filtros.',
        )
      })
      .finally(() => {
        if (!isMounted) return

        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [filters, refreshIndex])

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsLoading(true)
    setFilters((currentFilters) => ({
      ...currentFilters,
      search: searchInput.trim(),
      page: 1,
    }))
  }

  function handleSituationChange(value: string) {
    setIsLoading(true)
    setFilters((currentFilters) => ({
      ...currentFilters,
      situation: value,
      page: 1,
    }))
  }

  function handleQuoteTypeChange(value: string) {
    setIsLoading(true)
    setFilters((currentFilters) => ({
      ...currentFilters,
      quoteType: value,
      page: 1,
    }))
  }

  function handleGenerateMore() {
    setIsLoading(true)

    setFilters((currentFilters) => ({
      ...currentFilters,
      page:
        currentFilters.page >= totalPages || totalPages <= 1
          ? 1
          : currentFilters.page + 1,
    }))

    setRefreshIndex((currentValue) => currentValue + 1)
  }

  function handleClearFilters() {
    setIsLoading(true)
    setSearchInput('')
    setFilters({
      search: '',
      situation: '',
      quoteType: '',
      page: 1,
    })
  }

  return (
    <section className="page-section explore-page">
      <div className="placeholder-header">
        <div className="home-badges">
          <Badge>Explorador</Badge>
          <Badge variant="accent">API real</Badge>
          <Badge variant="muted">localStorage</Badge>
        </div>

        <p className="eyebrow">Generador público</p>
        <h1>Encuentra una frase para este momento.</h1>

        <p className="page-lead">
          Filtra por texto, situación o tipo de frase. QuoteMatic te muestra una
          recomendación principal y una alternativa para seguir explorando sin
          ruido visual.
        </p>
      </div>

      <form className="explore-filters" onSubmit={handleSearchSubmit}>
        <label className="explore-search">
          <Search aria-hidden="true" size={18} />
          <span className="sr-only">Buscar frases</span>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Buscar por texto..."
          />
        </label>

        <label className="explore-select">
          <Filter aria-hidden="true" size={18} />
          <span className="sr-only">Filtrar por situación</span>
          <select
            value={filters.situation}
            onChange={(event) => handleSituationChange(event.target.value)}
          >
            <option value="">Todas las situaciones</option>
            {situations.map((situation) => (
              <option key={situation._id} value={situation.slug}>
                {situation.name}
              </option>
            ))}
          </select>
        </label>

        <label className="explore-select">
          <SlidersHorizontal aria-hidden="true" size={18} />
          <span className="sr-only">Filtrar por tipo de frase</span>
          <select
            value={filters.quoteType}
            onChange={(event) => handleQuoteTypeChange(event.target.value)}
          >
            <option value="">Todos los tipos</option>
            {quoteTypes.map((quoteType) => (
              <option key={quoteType._id} value={quoteType.slug}>
                {quoteType.name}
              </option>
            ))}
          </select>
        </label>

        <button className="ui-button ui-button-primary ui-button-md" type="submit">
          Buscar
        </button>

        {hasActiveFilters ? (
          <button
            className="ui-button ui-button-ghost ui-button-md"
            type="button"
            onClick={handleClearFilters}
          >
            <X aria-hidden="true" size={18} />
            Limpiar
          </button>
        ) : null}
      </form>

      {catalogError ? (
        <p className="explore-warning" role="status">
          {catalogError}
        </p>
      ) : null}

      <div className="explore-summary" aria-live="polite">
        {isLoading ? (
          <span>Buscando una frase...</span>
        ) : (
          <span>
            {totalQuotes} {totalQuotes === 1 ? 'frase disponible' : 'frases disponibles'}
          </span>
        )}

        {hasActiveFilters ? <Badge variant="muted">Filtros activos</Badge> : null}
      </div>

      {quotesError ? (
        <EmptyState title="No se pudieron cargar las frases" description={quotesError}>
          <button
            className="ui-button ui-button-secondary ui-button-md"
            type="button"
            onClick={handleGenerateMore}
          >
            Reintentar
          </button>
        </EmptyState>
      ) : null}

      {!quotesError && isLoading ? (
        <div className="explore-result" aria-label="Frase cargando">
          <div className="explore-main-card">
            <QuoteCard
              quote="Buscando una frase en el universo QuoteMatic..."
              meta="Conectando con la API"
              isMock
            />
          </div>
        </div>
      ) : null}

      {!quotesError && !isLoading && quotes.length === 0 ? (
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
      ) : null}

      {!quotesError && !isLoading && mainQuote ? (
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

          <div className="explore-actions">
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
              <span>
                Selección {filters.page} de {totalPages}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}