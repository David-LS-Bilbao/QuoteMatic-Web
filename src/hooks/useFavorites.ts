import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from '../services/favoritesService'
import type { Favorite } from '../types/favorite'
import { getFavoriteQuoteId } from '../utils/favoriteHelpers'
import { useAuth } from './useAuth'

type UseFavoritesResult = {
  favorites: Favorite[]
  favoriteQuoteIds: Set<string>
  pendingQuoteIds: Set<string>
  isLoading: boolean
  errorMessage: string | null
  isFavorite: (quoteId: string) => boolean
  loadFavorites: () => Promise<void>
  toggleFavorite: (quoteId: string) => Promise<void>
  removeFavoriteByQuoteId: (quoteId: string) => Promise<void>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'No se pudo actualizar favoritos'
}

export function useFavorites(): UseFavoritesResult {
  const { isAuthenticated } = useAuth()

  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [pendingQuoteIds, setPendingQuoteIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const favoriteQuoteIds = useMemo(() => {
    const ids = new Set<string>()

    favorites.forEach((favorite) => {
      const quoteId = getFavoriteQuoteId(favorite)

      if (quoteId) {
        ids.add(quoteId)
      }
    })

    return ids
  }, [favorites])

  const isFavorite = useCallback(
    (quoteId: string) => favoriteQuoteIds.has(quoteId),
    [favoriteQuoteIds],
  )

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([])
      setErrorMessage(null)
      return
    }

    try {
      setIsLoading(true)
      setErrorMessage(null)

      const data = await getMyFavorites()

      setFavorites(data)
    } catch (error) {
      setFavorites([])
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    const fetchFavorites = async () => {
      await loadFavorites()
    }

    fetchFavorites()
  }, [loadFavorites])

  const toggleFavorite = useCallback(
    async (quoteId: string) => {
      if (!isAuthenticated) {
        throw new Error('Debes iniciar sesión para guardar favoritos')
      }

      try {
        setPendingQuoteIds((current) => new Set(current).add(quoteId))
        setErrorMessage(null)

        if (favoriteQuoteIds.has(quoteId)) {
          await removeFavorite(quoteId)
        } else {
          await addFavorite(quoteId)
        }

        await loadFavorites()
      } catch (error) {
        setErrorMessage(getErrorMessage(error))
        throw error
      } finally {
        setPendingQuoteIds((current) => {
          const next = new Set(current)
          next.delete(quoteId)
          return next
        })
      }
    },
    [favoriteQuoteIds, isAuthenticated, loadFavorites],
  )

  const removeFavoriteByQuoteId = useCallback(
    async (quoteId: string) => {
      if (!isAuthenticated) {
        throw new Error('Debes iniciar sesión para modificar favoritos')
      }

      try {
        setPendingQuoteIds((current) => new Set(current).add(quoteId))
        setErrorMessage(null)

        await removeFavorite(quoteId)
        await loadFavorites()
      } catch (error) {
        setErrorMessage(getErrorMessage(error))
        throw error
      } finally {
        setPendingQuoteIds((current) => {
          const next = new Set(current)
          next.delete(quoteId)
          return next
        })
      }
    },
    [isAuthenticated, loadFavorites],
  )

  return {
    favorites,
    favoriteQuoteIds,
    pendingQuoteIds,
    isLoading,
    errorMessage,
    isFavorite,
    loadFavorites,
    toggleFavorite,
    removeFavoriteByQuoteId,
  }
}