import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getQuoteTypes, getSituations } from '../services/catalogService'
import { getQuotes } from '../services/quotesService'
import type { QuoteType, Situation } from '../types/catalog'
import type { Quote } from '../types/quote'

const STORAGE_KEY = 'quotematic:explore-filters'
const PAGE_SIZE = 2
const TRANSITION_DELAY_MS = 180

export type ExploreFilters = {
  search: string
  situation: string
  quoteType: string
  page: number
}

type SavedExploreFilters = Partial<Omit<ExploreFilters, 'page'>>

export type ActiveFilterDrawer = 'situation' | 'quoteType' | null

export type UseExploreQuotesResult = {
  filters: ExploreFilters
  searchInput: string
  quotes: Quote[]
  situations: Situation[]
  quoteTypes: QuoteType[]
  totalPages: number
  totalQuotes: number
  isLoading: boolean
  isResultsTransitioning: boolean
  hasCompletedInitialLoad: boolean
  catalogError: string | null
  quotesError: string | null
  activeFilterDrawer: ActiveFilterDrawer
  hasActiveFilters: boolean
  selectedSituationLabel: string
  selectedQuoteTypeLabel: string
  setSearchInput: (value: string) => void
  setActiveFilterDrawer: Dispatch<SetStateAction<ActiveFilterDrawer>>
  handleSearchSubmit: (event: FormEvent<HTMLFormElement>) => void
  handleSituationChange: (value: string) => void
  handleQuoteTypeChange: (value: string) => void
  handleGenerateMore: () => void
  handleClearFilters: () => void
}

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

export function useExploreQuotes(): UseExploreQuotesResult {
  const [filters, setFilters] = useState<ExploreFilters>(getInitialFilters)
  const [searchInput, setSearchInput] = useState(filters.search)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [situations, setSituations] = useState<Situation[]>([])
  const [quoteTypes, setQuoteTypes] = useState<QuoteType[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalQuotes, setTotalQuotes] = useState(0)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isResultsTransitioning, setIsResultsTransitioning] = useState(false)
  const [hasCompletedInitialLoad, setHasCompletedInitialLoad] = useState(false)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [quotesError, setQuotesError] = useState<string | null>(null)
  const [activeFilterDrawer, setActiveFilterDrawer] =
    useState<ActiveFilterDrawer>(null)
  const hasVisibleQuotesRef = useRef(false)
  const transitionTimeoutRef = useRef<number | null>(null)

  const hasActiveFilters = useMemo(
    () => Boolean(filters.search || filters.situation || filters.quoteType),
    [filters.search, filters.situation, filters.quoteType],
  )

  const selectedSituationLabel = useMemo(() => {
    if (!filters.situation) {
      return 'Todas las situaciones'
    }

    return (
      situations.find((s) => s.slug === filters.situation)?.name ??
      'Situación seleccionada'
    )
  }, [filters.situation, situations])

  const selectedQuoteTypeLabel = useMemo(() => {
    if (!filters.quoteType) {
      return 'Todos los tipos'
    }

    return (
      quoteTypes.find((qt) => qt.slug === filters.quoteType)?.name ??
      'Tipo seleccionado'
    )
  }, [filters.quoteType, quoteTypes])

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
    const shouldTransition = hasVisibleQuotesRef.current

    function finish(apply: () => void) {
      if (shouldTransition) {
        transitionTimeoutRef.current = window.setTimeout(() => {
          if (!isMounted) return
          apply()
          setHasCompletedInitialLoad(true)
          setIsLoading(false)
          setIsResultsTransitioning(false)
          transitionTimeoutRef.current = null
        }, TRANSITION_DELAY_MS)
      } else {
        apply()
        setHasCompletedInitialLoad(true)
        setIsLoading(false)
        setIsResultsTransitioning(false)
      }
    }

    getQuotes({
      search: filters.search || undefined,
      situation: filters.situation || undefined,
      quoteType: filters.quoteType || undefined,
      page: filters.page,
      limit: PAGE_SIZE,
    })
      .then((response) => {
        if (!isMounted) return

        finish(() => {
          setQuotes(response.data)
          setTotalPages(response.meta.totalPages || 1)
          setTotalQuotes(response.meta.total)
          setQuotesError(null)
          hasVisibleQuotesRef.current = response.data.length > 0
        })
      })
      .catch(() => {
        if (!isMounted) return

        finish(() => {
          setQuotes([])
          setTotalPages(1)
          setTotalQuotes(0)
          hasVisibleQuotesRef.current = false
          setQuotesError(
            'No hemos podido cargar frases. Revisa la conexión o prueba otros filtros.',
          )
        })
      })

    return () => {
      isMounted = false
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current)
        transitionTimeoutRef.current = null
      }
    }
  }, [filters, refreshIndex])

  function prepareQuoteRequest() {
    setIsLoading(true)

    if (hasVisibleQuotesRef.current) {
      setIsResultsTransitioning(true)
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    prepareQuoteRequest()
    setFilters((f) => ({ ...f, search: searchInput.trim(), page: 1 }))
  }

  function handleSituationChange(value: string) {
    prepareQuoteRequest()
    setActiveFilterDrawer(null)
    setFilters((f) => ({ ...f, situation: value, page: 1 }))
  }

  function handleQuoteTypeChange(value: string) {
    prepareQuoteRequest()
    setActiveFilterDrawer(null)
    setFilters((f) => ({ ...f, quoteType: value, page: 1 }))
  }

  function handleGenerateMore() {
    prepareQuoteRequest()

    setFilters((f) => ({
      ...f,
      page: f.page >= totalPages || totalPages <= 1 ? 1 : f.page + 1,
    }))

    setRefreshIndex((v) => v + 1)
  }

  function handleClearFilters() {
    prepareQuoteRequest()
    setActiveFilterDrawer(null)
    setSearchInput('')
    setFilters({ search: '', situation: '', quoteType: '', page: 1 })
  }

  return {
    filters,
    searchInput,
    quotes,
    situations,
    quoteTypes,
    totalPages,
    totalQuotes,
    isLoading,
    isResultsTransitioning,
    hasCompletedInitialLoad,
    catalogError,
    quotesError,
    activeFilterDrawer,
    hasActiveFilters,
    selectedSituationLabel,
    selectedQuoteTypeLabel,
    setSearchInput,
    setActiveFilterDrawer,
    handleSearchSubmit,
    handleSituationChange,
    handleQuoteTypeChange,
    handleGenerateMore,
    handleClearFilters,
  }
}
