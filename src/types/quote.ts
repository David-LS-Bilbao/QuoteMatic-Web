// este fichero define los tipos relacionados con las citas


// tipo que representa una cita
export type Quote = {
  _id: string
  text: string
  authorText?: string
  contentRating?: 'all' | 'teen' | 'adult'
  language?: string
  sourceType?: string
  sourceReference?: string
}

// tipo que representa los filtros para obtener citas
export type QuoteFilters = {
  situation?: string
  quoteType?: string
  contentRating?: 'all' | 'teen' | 'adult'
  author?: string
  search?: string
  page?: number
  limit?: number
}