import {
  BarChart3,
  BookOpen,
  Code2,
  Database,
  FileSpreadsheet,
  Globe2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Link } from 'react-router'

import type { ReactNode } from 'react'

import { Badge, EmptyState } from '../components/ui'
import { useAdminDashboard } from '../hooks/useAdminDashboard'

const API_URL = 'https://quotematic.davlos.es'
const SWAGGER_URL = 'https://quotematic.davlos.es/api-docs/'

export function AdminDevPanelPage() {
  const { stats, isLoading, error, retry } = useAdminDashboard()

  return (
    <section className="page-section admin-page">
      <div className="placeholder-header">
        <div className="home-badges">
          <Badge>Admin</Badge>
          <Badge variant="accent">Dev Panel</Badge>
        </div>

        <p className="eyebrow">Zona administrativa</p>
        <h1>Panel admin/dev</h1>

        <p className="page-lead">
          Panel de control para revisar el estado del catálogo, acceder a la API
          y preparar las próximas herramientas de administración.
        </p>
      </div>

      {error ? (
        <EmptyState title="No se pudo cargar el panel" description={error}>
          <button
            className="ui-button ui-button-secondary ui-button-md"
            type="button"
            onClick={retry}
          >
            <RefreshCw aria-hidden="true" size={18} />
            Reintentar
          </button>
        </EmptyState>
      ) : null}

      {!error ? (
        <>
          <div className="admin-status-card">
            <div>
              <div className="admin-status-icon">
                <ShieldCheck aria-hidden="true" size={22} />
              </div>
            </div>

            <div>
              <h2>Sesión admin activa</h2>
              <p>
                Estás accediendo a una ruta protegida por rol admin. Este panel
                trabaja en modo lectura y consume la API real desplegada.
              </p>
            </div>
          </div>

          <div className="admin-stats-grid" aria-busy={isLoading}>
            <AdminStatCard
              icon={<BookOpen aria-hidden="true" size={22} />}
              label="Frases"
              value={stats?.totalQuotes}
              isLoading={isLoading}
            />

            <AdminStatCard
              icon={<Users aria-hidden="true" size={22} />}
              label="Autores"
              value={stats?.totalAuthors}
              isLoading={isLoading}
            />

            <AdminStatCard
              icon={<Sparkles aria-hidden="true" size={22} />}
              label="Situaciones"
              value={stats?.totalSituations}
              isLoading={isLoading}
            />

            <AdminStatCard
              icon={<BarChart3 aria-hidden="true" size={22} />}
              label="Tipos de frase"
              value={stats?.totalQuoteTypes}
              isLoading={isLoading}
            />
          </div>

          <div className="admin-grid">
            <section className="admin-panel-card">
              <div className="admin-panel-card-header">
                <Database aria-hidden="true" size={20} />
                <h2>Accesos rápidos</h2>
              </div>

              <div className="admin-actions-grid">
                <a
                  className="admin-action-card"
                  href={SWAGGER_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Code2 aria-hidden="true" size={19} />
                  <span>Swagger API</span>
                </a>

                <a
                  className="admin-action-card"
                  href={API_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Globe2 aria-hidden="true" size={19} />
                  <span>Backend</span>
                </a>

                <Link className="admin-action-card" to="/explore">
                  <BookOpen aria-hidden="true" size={19} />
                  <span>Explorar frases</span>
                </Link>

                <Link className="admin-action-card" to="/authors">
                  <Users aria-hidden="true" size={19} />
                  <span>Autores</span>
                </Link>
              </div>
            </section>

            <section className="admin-panel-card">
              <div className="admin-panel-card-header">
                <FileSpreadsheet aria-hidden="true" size={20} />
                <h2>Próximas herramientas</h2>
              </div>

              <div className="admin-roadmap-list">
                <div className="admin-roadmap-item">
                  <span>Panel admin funcional</span>
                  <strong>En progreso</strong>
                </div>

                <div className="admin-roadmap-item">
                  <span>Importación CSV</span>
                  <strong>Pendiente</strong>
                </div>

                <div className="admin-roadmap-item">
                  <span>Gestión global de frases</span>
                  <strong>Futuro</strong>
                </div>
              </div>
            </section>
          </div>
        </>
      ) : null}
    </section>
  )
}

type AdminStatCardProps = {
  icon: ReactNode
  label: string
  value: number | undefined
  isLoading: boolean
}

function AdminStatCard({ icon, label, value, isLoading }: AdminStatCardProps) {
  return (
    <article className="admin-stat-card">
      <div className="admin-stat-icon">{icon}</div>

      <div>
        <p>{label}</p>
        <strong>{isLoading ? '...' : (value ?? 0).toLocaleString('es-ES')}</strong>
      </div>
    </article>
  )
}