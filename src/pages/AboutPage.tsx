import { Database, GitBranch, LayoutDashboard, Server } from 'lucide-react'

import { Badge } from '../components/ui'

const projectItems = [
  {
    icon: LayoutDashboard,
    title: 'Frontend independiente',
    description:
      'SPA con React, Vite y TypeScript preparada para consumir el backend QuoteMatic.',
  },
  {
    icon: Server,
    title: 'API REST propia',
    description:
      'El backend existente expone endpoints documentados con Swagger para frases, autores y datos relacionados.',
  },
  {
    icon: Database,
    title: 'Stack MERN',
    description:
      'Proyecto conectado al aprendizaje del bootcamp: MongoDB, Express, React y Node.',
  },
  {
    icon: GitBranch,
    title: 'Trabajo por ramas',
    description:
      'Esta rama se limita al sistema visual base antes de implementar funcionalidades grandes.',
  },
]

export function AboutPage() {
  return (
    <section className="page-section placeholder-page">
      <div className="placeholder-header">
        <div className="home-badges">
          <Badge>React</Badge>
          <Badge variant="accent">Design System</Badge>
          <Badge variant="muted">Bootcamp project</Badge>
        </div>

        <p className="eyebrow">Sobre el proyecto</p>
        <h1>QuoteMatic como frontend React</h1>

        <p className="page-lead">
          QuoteMatic Web es una SPA creada para consumir la API pública del
          backend QuoteMatic sin modificar su lógica ni su base de datos.
        </p>
      </div>

      <div className="about-grid">
        {projectItems.map((item) => {
          const Icon = item.icon

          return (
            <article className="feature-card" key={item.title}>
              <div className="feature-card-icon" aria-hidden="true">
                <Icon size={22} />
              </div>

              <h2 className="feature-card-title">{item.title}</h2>
              <p className="feature-card-description">{item.description}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}