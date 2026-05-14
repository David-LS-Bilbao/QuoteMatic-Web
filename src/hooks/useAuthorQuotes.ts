import { useCallback, useEffect, useState } from 'react'

import { getAuthors } from '../services/authorsService'
import { getQuotes } from '../services/quotesService'
import type { Author } from '../types/author'
import type { Quote } from '../types/quote'

export type UseAuthorQuotesResult = {
  author: Author | null
  quotes: Quote[]
  isLoading: boolean
  error: string | null
  retry: () => void
}

export function useAuthorQuotes(authorId: string | undefined): UseAuthorQuotesResult {
  const [author, setAuthor] = useState<Author | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    if (!authorId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthor(null)
      setQuotes([])
      setError('No hemos podido identificar el autor solicitado.')
      setIsLoading(false)
      return () => {
        isMounted = false
      }
    }

    Promise.all([
      getAuthors(),
      getQuotes({
        author: authorId,
        page: 1,
        limit: 100,
      }),
    ])
      .then(([authorsData, quotesResponse]) => {
        if (!isMounted) return

        const selectedAuthor =
          authorsData.find((item) => item._id === authorId) ?? null

        if (!selectedAuthor) {
          setAuthor(null)
          setQuotes([])
          setError('No hemos encontrado este autor en el catálogo.')
          setIsLoading(false)
          return
        }

        setAuthor(selectedAuthor)
        setQuotes(quotesResponse.data)
        setError(null)
        setIsLoading(false)
      })
      .catch(() => {
        if (!isMounted) return

        setAuthor(null)
        setQuotes([])
        setError(
          'No hemos podido cargar las frases de este autor. Revisa la conexión e inténtalo de nuevo.',
        )
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [authorId, retryCount])

  const retry = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setRetryCount((current) => current + 1)
  }, [])

  return {
    author,
    quotes,
    isLoading,
    error,
    retry,
  }
}

/*

Centraliza la carga de datos de la página /authors/:authorId.
Reutiliza servicios existentes: getAuthors() y getQuotes().
No toca backend.
Evita duplicar lógica dentro de AuthorDetailPage.
Permite manejar loading, error, vacío y retry de forma limpia.

*/ 