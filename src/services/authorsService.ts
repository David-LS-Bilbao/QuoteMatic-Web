import { apiClient } from './apiClient'
import type { Author } from '../types/author'

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

export async function getAuthors(): Promise<Author[]> {
  const response = await apiClient<ApiArrayResponse<Author>>('/api/authors')

  return normalizeArrayResponse(response)
}
