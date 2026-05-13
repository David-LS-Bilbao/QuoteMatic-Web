import { apiClient } from './apiClient'
import type {
  MyQuotePayload,
  MyQuotesMeta,
  MyQuotesResult,
  MyQuoteUpdatePayload,
} from '../types/myQuote'
import type { Quote } from '../types/quote'

type MyQuotesApiResponse =
  | Quote[]
  | {
      success?: boolean
      data?: Quote[] | Quote
      meta?: Partial<MyQuotesMeta>
    }

const DEFAULT_META: MyQuotesMeta = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
}

function isQuote(value: unknown): value is Quote {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_id' in value &&
    'text' in value
  )
}

function normalizeQuote(response: MyQuotesApiResponse): Quote {
  if (isQuote(response)) {
    return response
  }

  if (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    isQuote(response.data)
  ) {
    return response.data
  }

  throw new Error('No se pudo leer la frase privada')
}

function normalizeQuotesResult(response: MyQuotesApiResponse): MyQuotesResult {
  if (Array.isArray(response)) {
    return {
      quotes: response,
      meta: {
        ...DEFAULT_META,
        total: response.length,
        totalPages: 1,
      },
    }
  }

  if (
    typeof response === 'object' &&
    response !== null &&
    Array.isArray(response.data)
  ) {
    return {
      quotes: response.data,
      meta: {
        ...DEFAULT_META,
        ...response.meta,
      },
    }
  }

  return {
    quotes: [],
    meta: DEFAULT_META,
  }
}

export async function getMyQuotes() {
  const response = await apiClient<MyQuotesApiResponse>('/api/me/quotes', {
    query: {
      page: 1,
      limit: 50,
    },
  })

  return normalizeQuotesResult(response)
}

export async function createMyQuote(payload: MyQuotePayload) {
  const response = await apiClient<MyQuotesApiResponse>('/api/me/quotes', {
    method: 'POST',
    body: payload,
  })

  return normalizeQuote(response)
}

export async function updateMyQuote(id: string, payload: MyQuoteUpdatePayload) {
  const response = await apiClient<MyQuotesApiResponse>(`/api/me/quotes/${id}`, {
    method: 'PUT',
    body: payload,
  })

  return normalizeQuote(response)
}

export async function deleteMyQuote(id: string) {
  await apiClient(`/api/me/quotes/${id}`, {
    method: 'DELETE',
  })
}