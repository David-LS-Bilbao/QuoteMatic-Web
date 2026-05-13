import { apiClient } from './apiClient'
import type { Favorite } from '../types/favorite'
import type { Quote } from '../types/quote'

type FavoritesApiResponse =
  | Favorite[]
  | Quote[]
  | {
      success?: boolean
      data?: Favorite[] | Quote[] | { favorites?: Favorite[] | Quote[] }
      favorites?: Favorite[] | Quote[]
    }

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isQuote(value: unknown): value is Quote {
  return isObject(value) && typeof value._id === 'string' && typeof value.text === 'string'
}

function normalizeFavoriteItem(item: Favorite | Quote): Favorite {
  if (isQuote(item)) {
    return {
      quote: item,
      quoteId: item._id,
    }
  }

  return item
}

function normalizeFavorites(response: FavoritesApiResponse): Favorite[] {
  if (Array.isArray(response)) {
    return response.map(normalizeFavoriteItem)
  }

  if (!isObject(response)) {
    return []
  }

  if (Array.isArray(response.favorites)) {
    return response.favorites.map(normalizeFavoriteItem)
  }

  const data = response.data

  if (Array.isArray(data)) {
    return data.map(normalizeFavoriteItem)
  }

  if (isObject(data) && Array.isArray(data.favorites)) {
    return data.favorites.map(normalizeFavoriteItem)
  }

  return []
}

export async function getMyFavorites() {
  const response = await apiClient<FavoritesApiResponse>('/api/favorites/me')

  return normalizeFavorites(response)
}

export async function addFavorite(quoteId: string) {
  return apiClient('/api/favorites/' + quoteId, {
    method: 'POST',
  })
}

export async function removeFavorite(quoteId: string) {
  return apiClient('/api/favorites/' + quoteId, {
    method: 'DELETE',
  })
}