import { apiClient } from './apiClient'
import type { QuoteType, Situation } from '../types/catalog'

type ApiArrayResponse<T> =
  | T[]
  | {
      success?: boolean
      data?: T[]
    }

function normalizeArrayResponse<T>(response: ApiArrayResponse<T>): T[] {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response.data)) {
    return response.data
  }

  return []
}

export async function getSituations() {
  const response = await apiClient<ApiArrayResponse<Situation>>('/api/situations')

  return normalizeArrayResponse(response)
}

export async function getQuoteTypes() {
  const response = await apiClient<ApiArrayResponse<QuoteType>>('/api/quote-types')

  return normalizeArrayResponse(response)
}