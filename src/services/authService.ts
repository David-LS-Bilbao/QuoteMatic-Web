import { apiClient } from './apiClient'
import type { AuthUser, LoginCredentials, RegisterCredentials } from '../types/auth'

type AuthResponse =
  | {
      success?: boolean
      data?: AuthUser | { user?: AuthUser }
      user?: AuthUser
      message?: string
    }
  | AuthUser

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isAuthUser(value: unknown): value is AuthUser {
  return (
    isObject(value) &&
    (typeof value.id === 'string' || typeof value._id === 'string')
  )
}

function normalizeAuthUser(response: AuthResponse): AuthUser {
  if (isAuthUser(response)) {
    return response
  }

  if (!isObject(response)) {
    throw new Error('Respuesta de autenticación no válida')
  }

  if (isAuthUser(response.user)) {
    return response.user
  }

  const data = response.data

  if (isAuthUser(data)) {
    return data
  }

  if (isObject(data) && isAuthUser(data.user)) {
    return data.user
  }

  throw new Error('No se pudo obtener el usuario autenticado')
}

export async function loginUser(credentials: LoginCredentials) {
  const response = await apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: credentials,
  })

  return normalizeAuthUser(response)
}

export async function registerUser(credentials: RegisterCredentials) {
  const response = await apiClient<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: credentials,
  })

  return normalizeAuthUser(response)
}

export async function getCurrentUser() {
  const response = await apiClient<AuthResponse>('/api/auth/me')

  return normalizeAuthUser(response)
}

export async function logoutUser() {
  await apiClient('/api/auth/logout', {
    method: 'POST',
  })
}