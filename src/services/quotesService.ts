// este fichero define las funciones para interactuar con la API de citas

import { apiClient } from './apiClient'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '../types/api'
import type { Quote, QuoteFilters } from '../types/quote'

// función para obtener una cita aleatoria con filtros opcionales
export function getRandomQuote(filters?: QuoteFilters) {
  return apiClient<ApiSuccessResponse<Quote>>('/api/quotes/random', {
    query: filters,
  })
}

// función para obtener una lista de citas con filtros y paginación
export function getQuotes(filters?: QuoteFilters) {
  return apiClient<ApiPaginatedResponse<Quote>>('/api/quotes', {
    query: filters,
  })
}

// función para obtener una cita por su ID
export function getQuoteById(id: string) {
  return apiClient<ApiSuccessResponse<Quote>>(`/api/quotes/${id}`)
}