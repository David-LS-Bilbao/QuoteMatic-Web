// este fichero define los tipos de respuesta de la API

// tipo de respuesta de éxito genérica
export type ApiSuccessResponse<T> = {
  success: true
  data: T
}

// tipo de respuesta de éxito para respuestas paginadas
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

// tipo de respuesta de error genérica
export type ApiErrorResponse = {
  success?: false
  message?: string
  error?: string
  code?: string
}