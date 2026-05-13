import { createContext } from 'react'

import type { AuthContextValue } from '../types/auth'


// Contexto de autenticación al que se le pasa el estado de autenticación.
export const AuthContext = createContext<AuthContextValue | null>(null)