import type { Favorite } from '../types/favorite'
import type { Quote } from '../types/quote'

function isQuote(value: unknown): value is Quote {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_id' in value &&
    'text' in value
  )
}

export function getFavoriteQuote(favorite: Favorite): Quote | null {
  if (isQuote(favorite.quote)) {
    return favorite.quote
  }

  if (isQuote(favorite.quoteId)) {
    return favorite.quoteId
  }

  return null
}

export function getFavoriteQuoteId(favorite: Favorite): string | null {
  const quote = getFavoriteQuote(favorite)

  if (quote?._id) {
    return quote._id
  }

  if (typeof favorite.quoteId === 'string') {
    return favorite.quoteId
  }

  return null
}