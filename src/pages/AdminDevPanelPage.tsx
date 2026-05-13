import { Code2, ShieldCheck } from 'lucide-react'

import { Badge, EmptyState } from '../components/ui'

export function AdminDevPanelPage() {
  return (
    <section className="page-section placeholder-page">
      <div className="placeholder-header">
        <div className="home-badges">
          <Badge>Admin</Badge>
          <Badge variant="accent">Dev Panel</Badge>
        </div>

        <p className="eyebrow">Zona administrativa</p>
        <h1>Panel admin/dev</h1>

        <p className="page-lead">
          Espacio reservado para futuras herramientas de administración,
          documentación técnica, acceso rápido a API y componentes usados.
        </p>
      </div>

      <EmptyState
        title="Panel en preparación"
        description="La autenticación admin ya queda preparada. El CRUD global y herramientas dev se implementarán en una rama posterior."
      >
        <div className="placeholder-actions">
          <span>
            <ShieldCheck aria-hidden="true" size={16} />
            Acceso admin
          </span>
          <span>
            <Code2 aria-hidden="true" size={16} />
            API y componentes
          </span>
        </div>
      </EmptyState>
    </section>
  )
}