import { useCallback, useEffect, useRef, useState } from 'react'

import { getRandomQuote } from '../services/quotesService'
import type { Quote } from '../types/quote'

const TRANSITION_DELAY_MS = 180
const ERROR_MESSAGE =
  'No hemos podido cargar una frase ahora mismo. Inténtalo de nuevo.'

type UseRandomQuoteResult = {
  quote: Quote | null
  isLoading: boolean
  isQuoteTransitioning: boolean
  errorMessage: string | null
  loadRandomQuote: () => Promise<void>
}

export function useRandomQuote(): UseRandomQuoteResult {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isQuoteTransitioning, setIsQuoteTransitioning] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const timeoutRef = useRef<number | null>(null)
  const hasLoadedOnceRef = useRef(false)

  function clearTransitionTimeout() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const finishTransition = useCallback((callback: () => void) => {
    clearTransitionTimeout()

    timeoutRef.current = window.setTimeout(() => {
      callback()
      setIsQuoteTransitioning(false)
      setIsLoading(false)
      timeoutRef.current = null
    }, TRANSITION_DELAY_MS)
  }, [])

  const loadRandomQuote = useCallback(async () => {
    setIsLoading(true)
    setIsQuoteTransitioning(hasLoadedOnceRef.current)
    setErrorMessage(null)

    try {
      const response = await getRandomQuote()

      finishTransition(() => {
        setQuote(response.data)
        hasLoadedOnceRef.current = true
      })
    } catch {
      finishTransition(() => {
        setErrorMessage(ERROR_MESSAGE)
        hasLoadedOnceRef.current = true
      })
    }
  }, [finishTransition])

  useEffect(() => {
    let isMounted = true

    getRandomQuote()
      .then((response) => {
        if (!isMounted) return

        finishTransition(() => {
          setQuote(response.data)
          hasLoadedOnceRef.current = true
        })
      })
      .catch(() => {
        if (!isMounted) return

        finishTransition(() => {
          setErrorMessage(ERROR_MESSAGE)
          hasLoadedOnceRef.current = true
        })
      })

    return () => {
      isMounted = false
      clearTransitionTimeout()
    }
  }, [finishTransition])

  return {
    quote,
    isLoading,
    isQuoteTransitioning,
    errorMessage,
    loadRandomQuote,
  }
}