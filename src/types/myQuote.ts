import type { ContentRating, Quote } from './quote'

export type MyQuotePayload = {
  text: string
  authorText?: string
  language?: string
  contentRating: ContentRating
  sourceType: 'original'
  sourceReference?: string
}

export type MyQuoteUpdatePayload = Partial<MyQuotePayload>

export type MyQuotesMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type MyQuotesResult = {
  quotes: Quote[]
  meta: MyQuotesMeta
}