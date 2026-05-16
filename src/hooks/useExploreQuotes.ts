import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

import { getQuoteTypes, getSituations } from '../services/catalogService'
import { getQuoteById, getQuotes } from '../services/quotesService'
import type { QuoteType, Situation } from '../types/catalog'
import type { Quote } from '../types/quote'

const QUOTE_QUERY_PARAM = 'quote'

const STORAGE_KEY = 'quotematic:explore-filters'
const POOL_SIZE = 10
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

// Returns a stable key for the author of a quote.
// Falls back to a per-quote synthetic key so anonymous quotes
// each count as a distinct "author" for diversity tracking.
function getAuthorKey(quote: Quote): string {
  if (quote.authorText) return quote.authorText.toLowerCase()
  if (typeof quote.author === 'object' && quote.author?.name) {
    return quote.author.name.toLowerCase()
  }
  if (typeof quote.author === 'string') return quote.author.toLowerCase()
  return `__unknown_author_${quote._id}`
}

// Returns a Fisher-Yates shuffled copy without mutating the original array.
function shuffleQuotes(quotes: Quote[]): Quote[] {
  const copy = [...quotes]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Picks the best next quote from a pool, avoiding seen ids/authors.
// Priority: (1) unseen id + unseen/unknown author → (2) unseen id → (3) null (all seen)
function pickQuote(
  candidates: Quote[],
  seenIds: Set<string>,
  seenAuthors: Set<string>,
  currentId?: string,
): Quote | null {
  if (candidates.length === 0) return null

  // Exclude the currently displayed quote when there are alternatives
  const available =
    currentId && candidates.length > 1
      ? candidates.filter((q) => q._id !== currentId)
      : candidates

  const pool = available.length > 0 ? available : candidates

  // P1: unseen id + unseen author
  const p1 = pool.filter((q) => {
    if (seenIds.has(q._id)) return false
    return !seenAuthors.has(getAuthorKey(q))
  })
  if (p1.length) return p1[Math.floor(Math.random() * p1.length)]

  // P2: unseen id (author may repeat)
  const p2 = pool.filter((q) => !seenIds.has(q._id))
  if (p2.length) return p2[Math.floor(Math.random() * p2.length)]

  // P3: all ids seen → signal exhaustion
  return null
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
  const [pool, setPool] = useState<Quote[]>([])
  const [displayed, setDisplayed] = useState<Quote | null>(null)
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
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedQuoteId = searchParams.get(QUOTE_QUERY_PARAM) ?? ''

  const hasVisibleQuotesRef = useRef(false)
  const transitionTimeoutRef = useRef<number | null>(null)
  const seenQuoteIdsRef = useRef<Set<string>>(new Set())
  const seenAuthorKeysRef = useRef<Set<string>>(new Set())

  const clearQuoteParam = useCallback(() => {
    setSearchParams(
      (current) => {
        if (!current.has(QUOTE_QUERY_PARAM)) return current
        const next = new URLSearchParams(current)
        next.delete(QUOTE_QUERY_PARAM)
        return next
      },
      { replace: true },
    )
  }, [setSearchParams])

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

    // Mode A — single quote selected via ?quote=<id> (typically from /authors)
    if (selectedQuoteId) {
      getQuoteById(selectedQuoteId)
        .then((response) => {
          if (!isMounted) return

          finish(() => {
            const quote = response.data
            setPool([])
            setDisplayed(quote)
            // Remember the seeded quote so the next "Otra frase" does not
            // immediately surface the same id/author from the random pool.
            seenQuoteIdsRef.current.add(quote._id)
            seenAuthorKeysRef.current.add(getAuthorKey(quote))
            setTotalPages(1)
            setTotalQuotes(1)
            setQuotesError(null)
            hasVisibleQuotesRef.current = true
          })
        })
        .catch(() => {
          if (!isMounted) return
          // Safe fallback: drop the param so the effect re-runs in Mode B.
          // We avoid setting an error here — the random pool will take over.
          clearQuoteParam()
        })

      return () => {
        isMounted = false
        if (transitionTimeoutRef.current !== null) {
          window.clearTimeout(transitionTimeoutRef.current)
          transitionTimeoutRef.current = null
        }
      }
    }

    // Mode B — normal pool driven by filters
    getQuotes({
      search: filters.search || undefined,
      situation: filters.situation || undefined,
      quoteType: filters.quoteType || undefined,
      page: filters.page,
      limit: POOL_SIZE,
    })
      .then((response) => {
        if (!isMounted) return

        finish(() => {
          const newPool = shuffleQuotes(response.data)
          const selected = pickQuote(
            newPool,
            seenQuoteIdsRef.current,
            seenAuthorKeysRef.current,
          )
          setPool(newPool)
          setDisplayed(selected ?? newPool[0] ?? null)
          setTotalPages(response.meta.totalPages || 1)
          setTotalQuotes(response.meta.total)
          setQuotesError(null)
          hasVisibleQuotesRef.current = newPool.length > 0
        })
      })
      .catch(() => {
        if (!isMounted) return

        finish(() => {
          setPool([])
          setDisplayed(null)
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
  }, [filters, refreshIndex, selectedQuoteId, clearQuoteParam])

  function resetHistory() {
    seenQuoteIdsRef.current = new Set()
    seenAuthorKeysRef.current = new Set()
  }

  function prepareQuoteRequest() {
    setIsLoading(true)

    if (hasVisibleQuotesRef.current) {
      setIsResultsTransitioning(true)
    }
  }

  // Switches to a new quote within the current pool with a CSS transition.
  function navigateInPool(next: Quote) {
    if (hasVisibleQuotesRef.current) {
      setIsResultsTransitioning(true)
      transitionTimeoutRef.current = window.setTimeout(() => {
        setDisplayed(next)
        setIsResultsTransitioning(false)
        transitionTimeoutRef.current = null
      }, TRANSITION_DELAY_MS)
    } else {
      setDisplayed(next)
      hasVisibleQuotesRef.current = true
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    resetHistory()
    prepareQuoteRequest()
    clearQuoteParam()
    setFilters((f) => ({ ...f, search: searchInput.trim(), page: 1 }))
  }

  function handleSituationChange(value: string) {
    resetHistory()
    prepareQuoteRequest()
    setActiveFilterDrawer(null)
    clearQuoteParam()
    setFilters((f) => ({ ...f, situation: value, page: 1 }))
  }

  function handleQuoteTypeChange(value: string) {
    resetHistory()
    prepareQuoteRequest()
    setActiveFilterDrawer(null)
    clearQuoteParam()
    setFilters((f) => ({ ...f, quoteType: value, page: 1 }))
  }

  function handleGenerateMore() {
    // Mark the currently displayed quote as seen
    if (displayed) {
      seenQuoteIdsRef.current.add(displayed._id)
      seenAuthorKeysRef.current.add(getAuthorKey(displayed))
    }

    // If we are in single-quote mode (?quote=<id>), drop the param and let the
    // effect re-run in pool mode — that will pick a fresh random quote while
    // still respecting the seen ids/authors marked above.
    if (selectedQuoteId) {
      prepareQuoteRequest()
      clearQuoteParam()
      return
    }

    const next = pickQuote(
      pool,
      seenQuoteIdsRef.current,
      seenAuthorKeysRef.current,
      displayed?._id,
    )

    if (next) {
      navigateInPool(next)
      return
    }

    // Pool exhausted — reset only quote ids (keep author history across pools)
    seenQuoteIdsRef.current = new Set()
    prepareQuoteRequest()
    setFilters((f) => ({
      ...f,
      // Random page instead of sequential to avoid predictable page grouping
      page: totalPages <= 1 ? 1 : Math.floor(Math.random() * totalPages) + 1,
    }))
    setRefreshIndex((v) => v + 1)
  }

  function handleClearFilters() {
    resetHistory()
    prepareQuoteRequest()
    setActiveFilterDrawer(null)
    setSearchInput('')
    clearQuoteParam()
    setFilters({ search: '', situation: '', quoteType: '', page: 1 })
  }

  return {
    filters,
    searchInput,
    // Expose only the displayed quote; keeps ExploreResults compatible (quotes[0])
    quotes: displayed ? [displayed] : [],
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
