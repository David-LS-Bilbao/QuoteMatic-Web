export type Quote = {
  _id: string
  text: string
  authorText?: string
  contentRating?: 'all' | 'teen' | 'adult'
  language?: string
  sourceType?: string
  sourceReference?: string
}

export type QuoteFilters = {
  situation?: string
  quoteType?: string
  contentRating?: 'all' | 'teen' | 'adult'
  author?: string
  search?: string
  page?: number
  limit?: number
}