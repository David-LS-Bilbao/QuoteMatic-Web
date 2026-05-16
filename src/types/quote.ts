export type ContentRating = 'all' | 'teen' | 'adult'

export type QuoteAuthor = {
  _id?: string
  name?: string
}

export type QuoteCategory = {
  _id?: string
  name?: string
  slug?: string
}

export type Quote = {
  _id: string
  text: string
  authorText?: string
  author?: QuoteAuthor | string
  situation?: QuoteCategory | string
  quoteType?: QuoteCategory | string
  contentRating?: ContentRating
  language?: string
  sourceType?: string
  sourceReference?: string
}

export type QuoteFilters = {
  situation?: string
  quoteType?: string
  contentRating?: ContentRating
  author?: string
  search?: string
  page?: number
  limit?: number
}

export type RandomQuoteFilters = {
  count?: number
  situation?: string
  quoteType?: string
  contentRating?: ContentRating
}