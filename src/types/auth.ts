export type AuthRole = 'user' | 'admin'

export type AgeGroup = 'teen_14_17' | 'adult_18_plus'

export type AuthUser = {
  _id?: string
  id?: string
  name?: string
  email?: string
  role?: AuthRole
  ageGroup?: AgeGroup
}

export type LoginCredentials = {
  email: string
  password: string
}

export type AgeRange = 'teen_14_17' | 'adult_18_plus'

export type RegisterCredentials = {
  name: string
  email: string
  password: string
  ageRange: AgeRange
}

export type AuthStatus = 'checking' | 'anonymous' | 'authenticated'

export type AuthContextValue = {
  user: AuthUser | null
  status: AuthStatus
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  errorMessage: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}