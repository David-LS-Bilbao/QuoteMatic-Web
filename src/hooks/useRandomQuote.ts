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

  function clearTransitionTimeout() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const finishTransition = useCallback(
    (callback: () => void) => {
      clearTransitionTimeout()

      timeoutRef.current = window.setTimeout(() => {
        callback()
        setIsQuoteTransitioning(false)
        setIsLoading(false)
        timeoutRef.current = null
      }, TRANSITION_DELAY_MS)
    },
    [],
  )

  const hasLoadedOnceRef = useRef(false)

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRandomQuote()

    return () => {
      clearTransitionTimeout()
    }
  }, [loadRandomQuote])

  return {
    quote,
    isLoading,
    isQuoteTransitioning,
    errorMessage,
    loadRandomQuote,
  }
}