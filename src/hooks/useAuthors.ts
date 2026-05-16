import { useCallback, useEffect, useState } from 'react'

import type { Author } from '../types/author'
import { getAuthors } from '../services/authorsService'

export type UseAuthorsResult = {
  authors: Author[]
  isLoading: boolean
  error: string | null
  retry: () => void
}

// Caché en memoria a nivel de módulo: evita refetch al volver a /authors.
let cachedAuthors: Author[] | null = null
let inFlight: Promise<Author[]> | null = null

export function useAuthors(): UseAuthorsResult {
  const [authors, setAuthors] = useState<Author[]>(() => cachedAuthors ?? [])
  const [isLoading, setIsLoading] = useState(() => cachedAuthors === null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    const request = inFlight ?? (inFlight = getAuthors())

    request
      .then((data) => {
        cachedAuthors = data
        if (!isMounted) return
        setAuthors(data)
        setError(null)
        setIsLoading(false)
      })
      .catch(() => {
        if (!isMounted) return
        if (cachedAuthors === null) {
          setAuthors([])
        }
        setError(
          'No hemos podido cargar los autores. Revisa la conexión e inténtalo de nuevo.',
        )
        setIsLoading(false)
      })
      .finally(() => {
        if (inFlight === request) {
          inFlight = null
        }
      })

    return () => {
      isMounted = false
    }
  }, [retryCount])

  const retry = useCallback(() => {
    cachedAuthors = null
    inFlight = null
    setIsLoading(true)
    setError(null)
    setRetryCount((c) => c + 1)
  }, [])

  return { authors, isLoading, error, retry }
}
