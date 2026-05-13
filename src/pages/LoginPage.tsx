
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { LogIn } from 'lucide-react'

import { Badge } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'No se pudo iniciar sesión'
}

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to="/account" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setFormError(null)

      await login({
        email: email.trim(),
        password,
      })

      navigate('/account')
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <section className="page-section auth-page">
      <div className="auth-card">
        <div className="home-badges">
          <Badge>Acceso usuario</Badge>
          <Badge variant="accent">Sesión con cookie</Badge>
        </div>

        <div>
          <p className="eyebrow">QuoteMatic</p>
          <h1>Inicia sesión</h1>
          <p className="page-lead">
            Accede para guardar frases, crear tu colección privada y preparar
            futuras acciones como enviar o compartir frases.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="auth-field">
            <span>Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {formError ? (
            <p className="auth-error" role="alert">
              {formError}
            </p>
          ) : null}

          <button
            className="ui-button ui-button-primary ui-button-md"
            type="submit"
            disabled={isLoading}
          >
            <LogIn aria-hidden="true" size={18} />
            {isLoading ? 'Accediendo...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </section>
  )
}