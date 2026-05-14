import { useCallback, useEffect, useState } from 'react'

import { getAuthors } from '../services/authorsService'
import { getQuoteTypes, getSituations } from '../services/catalogService'
import { getQuotes } from '../services/quotesService'

export type AdminDashboardStats = {
  totalQuotes: number
  totalAuthors: number
  totalSituations: number
  totalQuoteTypes: number
}

export type UseAdminDashboardResult = {
  stats: AdminDashboardStats | null
  isLoading: boolean
  error: string | null
  retry: () => void
}

export function useAdminDashboard(): UseAdminDashboardResult {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      getQuotes({ page: 1, limit: 1 }),
      getAuthors(),
      getSituations(),
      getQuoteTypes(),
    ])
      .then(([quotesResponse, authors, situations, quoteTypes]) => {
        if (!isMounted) return

        setStats({
          totalQuotes: quotesResponse.meta.total,
          totalAuthors: authors.length,
          totalSituations: situations.length,
          totalQuoteTypes: quoteTypes.length,
        })
        setError(null)
        setIsLoading(false)
      })
      .catch(() => {
        if (!isMounted) return

        setStats(null)
        setError(
          'No hemos podido cargar el resumen del panel admin. Revisa la conexión con la API.',
        )
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [retryCount])

  const retry = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setRetryCount((current) => current + 1)
  }, [])

  return {
    stats,
    isLoading,
    error,
    retry,
  }
}