export type ApiSuccessResponse<T> = {
  success: true
  data: T
}

export type ApiPaginatedResponse<T> = {
  success: true
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type ApiErrorResponse = {
  success?: false
  message?: string
  error?: string
  code?: string
}