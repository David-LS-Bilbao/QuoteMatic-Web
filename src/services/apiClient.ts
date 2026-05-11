
import type { ApiErrorResponse } from '../types/api'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://quotematic.davlos.es'

type QueryParams = Record<string, string | number | boolean | null | undefined>

type ApiClientOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  query?: QueryParams
}

export class ApiError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

function buildUrl(path: string, query?: QueryParams) {
  const url = new URL(path, API_BASE_URL)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text()

  if (!text) {
    return null as T
  }

  return JSON.parse(text) as T
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { body, query, headers, ...fetchOptions } = options

  const requestHeaders = new Headers(headers)

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(buildUrl(path, query), {
    ...fetchOptions,
    credentials: 'include',
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await parseResponse<T | ApiErrorResponse>(response)

  if (!response.ok) {
    const errorData = data as ApiErrorResponse

    throw new ApiError(
      errorData.message ?? errorData.error ?? 'Error en la petición',
      response.status,
      errorData.code,
    )
  }

  return data as T
}