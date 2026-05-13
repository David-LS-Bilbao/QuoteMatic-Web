import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { UserPlus } from 'lucide-react'

import { Badge } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'No se pudo crear la cuenta'
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated, isLoading } = useAuth()
  const [ageRange, setAgeRange] = useState<'teen_14_17' | 'adult_18_plus'>(
  'adult_18_plus',
)
  const [name, setName] = useState('')
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

      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        ageRange,
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
          <Badge>Nuevo usuario</Badge>
          <Badge variant="accent">Cuenta QuoteMatic</Badge>
        </div>

        <div>
          <p className="eyebrow">Registro</p>
          <h1>Crea tu cuenta</h1>
          <p className="page-lead">
            Regístrate para guardar frases favoritas y preparar tu espacio
            privado de frases personales.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Nombre</span>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </label>

          {formError ? (
            <p className="auth-error" role="alert">
              {formError}
            </p>
          ) : null}


          <label className="auth-field">
  <span>Rango de edad</span>
  <select
    value={ageRange}
    onChange={(event) =>
      setAgeRange(event.target.value as 'teen_14_17' | 'adult_18_plus')
    }
    required
  >
    <option value="adult_18_plus">18 años o más</option>
    <option value="teen_14_17">Entre 14 y 17 años</option>
  </select>
</label>



          <button
            className="ui-button ui-button-primary ui-button-md"
            type="submit"
            disabled={isLoading}
          >
            <UserPlus aria-hidden="true" size={18} />
            {isLoading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </section>
  )
}