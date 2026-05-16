import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getQuoteTypes, getSituations } from '../services/catalogService'
import { getQuotes, getRandomQuotesPool } from '../services/quotesService'
import type { QuoteType, Situation } from '../types/catalog'
import type { Quote } from '../types/quote'

const STORAGE_KEY = 'quotematic:explore-filters'
const POOL_SIZE = 20
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

// Picks the best next quote from a pool, applying the following cascade:
//   P1: unseen id + unseen author + author != lastAuthorKey
//   P2: unseen id + author != lastAuthorKey
//   P3: unseen id (author may repeat the last one)
//   null: every id in the pool has been seen → caller should reset / refetch
function pickQuote(
  candidates: Quote[],
  seenIds: Set<string>,
  seenAuthors: Set<string>,
  lastAuthorKey: string | null,
  currentId?: string,
): Quote | null {
  if (candidates.length === 0) return null

  // Exclude the currently displayed quote when there are alternatives
  const available =
    currentId && candidates.length > 1
      ? candidates.filter((q) => q._id !== currentId)
      : candidates

  const pool = available.length > 0 ? available : candidates

  const isDifferentFromLastAuthor = (q: Quote) =>
    lastAuthorKey === null || getAuthorKey(q) !== lastAuthorKey

  // P1: unseen id + unseen author + distinct from last author
  const p1 = pool.filter(
    (q) =>
      !seenIds.has(q._id) &&
      !seenAuthors.has(getAuthorKey(q)) &&
      isDifferentFromLastAuthor(q),
  )
  if (p1.length) return p1[Math.floor(Math.random() * p1.length)]

  // P2: unseen id + distinct from last author
  const p2 = pool.filter(
    (q) => !seenIds.has(q._id) && isDifferentFromLastAuthor(q),
  )
  if (p2.length) return p2[Math.floor(Math.random() * p2.length)]

  // P3: unseen id (the same author as last is accepted as last resort)
  const p3 = pool.filter((q) => !seenIds.has(q._id))
  if (p3.length) return p3[Math.floor(Math.random() * p3.length)]

  // All ids seen → caller handles P4 (reset seenIds and/or refetch)
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

  const hasVisibleQuotesRef = useRef(false)
  const transitionTimeoutRef = useRef<number | null>(null)
  const seenQuoteIdsRef = useRef<Set<string>>(new Set())
  const seenAuthorKeysRef = useRef<Set<string>>(new Set())
  // Tracks the author of the quote currently being shown so we can avoid
  // showing two quotes from the same author in a row.
  const lastAuthorKeyRef = useRef<string | null>(null)
  // Guards against infinite refetch loops when no different-author candidate
  // can be found locally: at most one fallback refetch per user click.
  const hasRefetchedForDiversityRef = useRef(false)

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

    const trimmedSearch = filters.search.trim()
    const isSearchMode = trimmedSearch.length > 0

    // Random pool uses backend-side randomness; search keeps the deterministic
    // paginated endpoint because /api/quotes/random does not accept `search`.
    const fetchPool: Promise<{
      data: Quote[]
      total: number
      totalPages: number
    }> = isSearchMode
      ? getQuotes({
          search: trimmedSearch,
          situation: filters.situation || undefined,
          quoteType: filters.quoteType || undefined,
          page: filters.page,
          limit: POOL_SIZE,
        }).then((response) => ({
          data: response.data,
          total: response.meta.total,
          totalPages: response.meta.totalPages || 1,
        }))
      : getRandomQuotesPool({
          count: POOL_SIZE,
          situation: filters.situation || undefined,
          quoteType: filters.quoteType || undefined,
        }).then((response) => ({
          data: response.data,
          total: response.meta.returned,
          totalPages: 1,
        }))

    fetchPool
      .then((response) => {
        if (!isMounted) return

        finish(() => {
          const newPool = shuffleQuotes(response.data)
          const selected = pickQuote(
            newPool,
            seenQuoteIdsRef.current,
            seenAuthorKeysRef.current,
            lastAuthorKeyRef.current,
          )
          const chosen = selected ?? newPool[0] ?? null
          setPool(newPool)
          setDisplayed(chosen)
          if (chosen) {
            const newKey = getAuthorKey(chosen)
            // If the freshly chosen quote moves us off the previous author,
            // forget that we already refetched for diversity in this cycle.
            if (
              lastAuthorKeyRef.current !== null &&
              lastAuthorKeyRef.current !== newKey
            ) {
              hasRefetchedForDiversityRef.current = false
            }
            lastAuthorKeyRef.current = newKey
          }
          setTotalPages(response.totalPages)
          setTotalQuotes(response.total)
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
  }, [filters, refreshIndex])

  function resetHistory() {
    seenQuoteIdsRef.current = new Set()
    seenAuthorKeysRef.current = new Set()
    lastAuthorKeyRef.current = null
    hasRefetchedForDiversityRef.current = false
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
    setFilters((f) => ({ ...f, search: searchInput.trim(), page: 1 }))
  }

  function handleSituationChange(value: string) {
    resetHistory()
    prepareQuoteRequest()
    setActiveFilterDrawer(null)
    setFilters((f) => ({ ...f, situation: value, page: 1 }))
  }

  function handleQuoteTypeChange(value: string) {
    resetHistory()
    prepareQuoteRequest()
    setActiveFilterDrawer(null)
    setFilters((f) => ({ ...f, quoteType: value, page: 1 }))
  }

  function handleGenerateMore() {
    // Mark the currently displayed quote as seen
    if (displayed) {
      seenQuoteIdsRef.current.add(displayed._id)
      seenAuthorKeysRef.current.add(getAuthorKey(displayed))
    }

    const lastAuthor = lastAuthorKeyRef.current
    const currentId = displayed?._id

    // Rule 8: if the current local pool has no author distinct from the last
    // shown one, ask the backend for a new pool before allowing repetition.
    // Capped to a single defensive refetch per click (rule 9).
    const poolHasDifferentAuthor =
      lastAuthor === null || pool.some((q) => getAuthorKey(q) !== lastAuthor)

    if (
      !poolHasDifferentAuthor &&
      !hasRefetchedForDiversityRef.current &&
      pool.length > 0
    ) {
      hasRefetchedForDiversityRef.current = true
      prepareQuoteRequest()

      const isSearchMode = filters.search.trim().length > 0
      if (isSearchMode && totalPages > 1) {
        setFilters((f) => ({
          ...f,
          page: Math.floor(Math.random() * totalPages) + 1,
        }))
      } else {
        setRefreshIndex((v) => v + 1)
      }
      return
    }

    // Normal cascade P1 → P2 → P3
    const next = pickQuote(
      pool,
      seenQuoteIdsRef.current,
      seenAuthorKeysRef.current,
      lastAuthor,
      currentId,
    )

    if (next) {
      const newKey = getAuthorKey(next)
      if (lastAuthor !== null && newKey !== lastAuthor) {
        hasRefetchedForDiversityRef.current = false
      }
      lastAuthorKeyRef.current = newKey
      navigateInPool(next)
      return
    }

    // P4: every id in the local pool is already seen → reset seenIds (keep
    // seenAuthors / lastAuthor) and retry with the diversity rules still on.
    seenQuoteIdsRef.current = new Set()
    const retried = pickQuote(
      pool,
      seenQuoteIdsRef.current,
      seenAuthorKeysRef.current,
      lastAuthor,
      currentId,
    )
    if (retried) {
      const newKey = getAuthorKey(retried)
      if (lastAuthor !== null && newKey !== lastAuthor) {
        hasRefetchedForDiversityRef.current = false
      }
      lastAuthorKeyRef.current = newKey
      navigateInPool(retried)
      return
    }

    // Local pool truly cannot help → ask backend for a fresh pool.
    prepareQuoteRequest()

    const isSearchMode = filters.search.trim().length > 0
    if (isSearchMode && totalPages > 1) {
      // Search keeps deterministic pagination, so jump to a random page.
      setFilters((f) => ({
        ...f,
        page: Math.floor(Math.random() * totalPages) + 1,
      }))
    } else {
      // Random mode just refetches; backend will return a new random pool.
      setRefreshIndex((v) => v + 1)
    }
  }

  function handleClearFilters() {
    resetHistory()
    prepareQuoteRequest()
    setActiveFilterDrawer(null)
    setSearchInput('')
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
