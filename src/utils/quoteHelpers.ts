import type { Quote } from '../types/quote'

export function getAuthorName(quote: Quote): string {
  if (quote.authorText) {
    return quote.authorText
  }

  if (typeof quote.author === 'object' && quote.author?.name) {
    return quote.author.name
  }

  if (typeof quote.author === 'string') {
    return quote.author
  }

  return 'Autor desconocido'
}

export function getAuthorId(quote: Quote): string | undefined {
  if (typeof quote.author === 'object' && quote.author?._id) {
    return quote.author._id
  }

  return undefined
}

export function getCategoryName(
  value: Quote['situation'] | Quote['quoteType'],
): string | undefined {
  if (!value) {
    return undefined
  }

  if (typeof value === 'string') {
    return value
  }

  return value.name ?? value.slug
}

export function buildQuoteMeta(quote: Quote): string {
  return [getCategoryName(quote.situation), getCategoryName(quote.quoteType)]
    .filter(Boolean)
    .join(' · ')
}
