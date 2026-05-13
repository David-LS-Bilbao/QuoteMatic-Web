import { useCallback, useEffect, useState } from 'react'

import type { Author } from '../types/author'
import { getAuthors } from '../services/authorsService'

export type UseAuthorsResult = {
  authors: Author[]
  isLoading: boolean
  error: string | null
  retry: () => void
}

export function useAuthors(): UseAuthorsResult {
  const [authors, setAuthors] = useState<Author[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    getAuthors()
      .then((data) => {
        if (!isMounted) return
        setAuthors(data)
        setError(null)
        setIsLoading(false)
      })
      .catch(() => {
        if (!isMounted) return
        setAuthors([])
        setError(
          'No hemos podido cargar los autores. Revisa la conexión e inténtalo de nuevo.',
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
    setRetryCount((c) => c + 1)
  }, [])

  return { authors, isLoading, error, retry }
}
