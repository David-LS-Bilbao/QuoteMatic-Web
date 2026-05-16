import { apiClient } from './apiClient'
import type {
  ApiPaginatedResponse,
  ApiRandomPoolResponse,
  ApiSuccessResponse,
} from '../types/api'
import type { Quote, QuoteFilters, RandomQuoteFilters } from '../types/quote'

export function getRandomQuote(filters?: QuoteFilters) {
  return apiClient<ApiSuccessResponse<Quote>>('/api/quotes/random', {
    query: filters,
  })
}

export function getRandomQuotesPool(filters?: RandomQuoteFilters) {
  return apiClient<ApiRandomPoolResponse<Quote>>('/api/quotes/random', {
    query: filters,
  })
}

export function getQuotes(filters?: QuoteFilters) {
  return apiClient<ApiPaginatedResponse<Quote>>('/api/quotes', {
    query: filters,
  })
}

export function getQuoteById(id: string) {
  return apiClient<ApiSuccessResponse<Quote>>(`/api/quotes/${id}`)
}