import { apiClient } from './apiClient'
import type { ApiSuccessResponse } from '../types/api'
import type { QuoteType, Situation } from '../types/catalog'

export function getSituations() {
  return apiClient<ApiSuccessResponse<Situation[]>>('/api/situations')
}

export function getQuoteTypes() {
  return apiClient<ApiSuccessResponse<QuoteType[]>>('/api/quote-types')
}
