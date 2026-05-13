import { useCallback, useEffect, useState } from 'react'

import {
  createMyQuote,
  deleteMyQuote,
  getMyQuotes,
  updateMyQuote,
} from '../services/myQuotesService'
import type {
  MyQuotePayload,
  MyQuotesMeta,
  MyQuoteUpdatePayload,
} from '../types/myQuote'
import type { Quote } from '../types/quote'

const DEFAULT_META: MyQuotesMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'No se pudo completar la operación'
}

export function useMyQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [meta, setMeta] = useState<MyQuotesMeta>(DEFAULT_META)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadMyQuotes = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const result = await getMyQuotes()

      setQuotes(result.quotes)
      setMeta(result.meta)
    } catch (error) {
      setQuotes([])
      setMeta(DEFAULT_META)
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const fetchQuotes = async () => {
      await loadMyQuotes()
    }

    fetchQuotes()
  }, [loadMyQuotes])

  const createQuote = useCallback(
    async (payload: MyQuotePayload) => {
      try {
        setIsMutating(true)
        setErrorMessage(null)

        await createMyQuote(payload)
        await loadMyQuotes()
      } catch (error) {
        setErrorMessage(getErrorMessage(error))
        throw error
      } finally {
        setIsMutating(false)
      }
    },
    [loadMyQuotes],
  )

  const updateQuote = useCallback(
    async (id: string, payload: MyQuoteUpdatePayload) => {
      try {
        setIsMutating(true)
        setErrorMessage(null)

        await updateMyQuote(id, payload)
        await loadMyQuotes()
      } catch (error) {
        setErrorMessage(getErrorMessage(error))
        throw error
      } finally {
        setIsMutating(false)
      }
    },
    [loadMyQuotes],
  )

  const removeQuote = useCallback(
    async (id: string) => {
      try {
        setIsMutating(true)
        setErrorMessage(null)

        await deleteMyQuote(id)
        await loadMyQuotes()
      } catch (error) {
        setErrorMessage(getErrorMessage(error))
        throw error
      } finally {
        setIsMutating(false)
      }
    },
    [loadMyQuotes],
  )

  return {
    quotes,
    meta,
    isLoading,
    isMutating,
    errorMessage,
    loadMyQuotes,
    createQuote,
    updateQuote,
    removeQuote,
  }
}