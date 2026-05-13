import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

// importamos el contexto para poder usarlo desde cualquier componente
import { AuthContext } from './authContext'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../services/authService'
import type {
  AuthContextValue,
  AuthStatus,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth'

type AuthProviderProps = {
  children: ReactNode
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Ha ocurrido un error de autenticación'
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('checking')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const refreshSession = useCallback(async () => {
    const sessionUser = await getCurrentUser()

    setUser(sessionUser)
    setStatus('authenticated')
    setErrorMessage(null)
  }, [])

  useEffect(() => {
    let isMounted = true

    getCurrentUser()
      .then((sessionUser) => {
        if (!isMounted) return

        setUser(sessionUser)
        setStatus('authenticated')
        setErrorMessage(null)
      })
      .catch(() => {
        if (!isMounted) return

        setUser(null)
        setStatus('anonymous')
      })
      .finally(() => {
        if (!isMounted) return

        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const loggedUser = await loginUser(credentials)

      setUser(loggedUser)
      setStatus('authenticated')
    } catch (error) {
      setUser(null)
      setStatus('anonymous')
      setErrorMessage(getErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const registeredUser = await registerUser(credentials)

      setUser(registeredUser)
      setStatus('authenticated')
    } catch (error) {
      setUser(null)
      setStatus('anonymous')
      setErrorMessage(getErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      await logoutUser()

      setUser(null)
      setStatus('anonymous')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isLoading,
      isAuthenticated: status === 'authenticated' && Boolean(user),
      isAdmin: user?.role === 'admin',
      errorMessage,
      login,
      register,
      logout,
      refreshSession,
    }),
    [errorMessage, isLoading, login, logout, refreshSession, register, status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}