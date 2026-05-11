
import { ArrowRight, Code2, Compass, Heart, Sparkles } from 'lucide-react'
import { Link } from 'react-router'

import { Badge, QuoteCard } from '../components/ui'

const featureCards = [
  {
    icon: Compass,
    title: 'Explora por situación',
    description:
      'Encuentra frases pensadas para trabajo, estudios, estrés o decisiones difíciles.',
    badge: 'Disponible pronto',
  },
  {
    icon: Sparkles,
    title: 'Filtra por estilo',
    description:
      'Combina tipos de frase como estoicas, filosóficas, motivacionales o reflexivas.',
    badge: 'API preparada',
  },
  {
    icon: Heart,
    title: 'Guarda tus favoritas',
    description:
      'La base visual queda preparada para favoritos y frases personales en próximas ramas.',
    badge: 'Próximamente',
  },
]

// Componente HomePage
export function HomePage() {
  return (
    <section className="page-section home-page">
      <div className="home-hero">
        <div className="home-hero-content">
          <div className="home-badges" aria-label="Estado del proyecto">
            <Badge>React + TypeScript</Badge>
            <Badge variant="accent">Cosmos UI</Badge>
            <Badge variant="muted">API REST</Badge>
          </div>

          <p className="eyebrow">Frontend React independiente</p>

          <h1>Frases para cada momento, situación y estado mental.</h1>

          <p className="page-lead">
            QuoteMatic Web es una interfaz visual para explorar frases,
            autores y situaciones consumiendo una API REST propia creada con
            Node, Express, TypeScript y MongoDB.
          </p>

          <div className="home-hero-actions">
            <Link className="ui-button ui-button-primary ui-button-md" to="/explore">
              Explorar frases
              <ArrowRight aria-hidden="true" size={18} />
            </Link>

            <a
              className="ui-button ui-button-secondary ui-button-md"
              href="https://quotematic.davlos.es/api-docs/"
              target="_blank"
              rel="noreferrer"
            >
              Ver API
              <Code2 aria-hidden="true" size={18} />
            </a>
          </div>
        </div>

        <div className="home-hero-card" aria-label="Frase destacada temporal">
          <QuoteCard
            quote="La inspiración existe, pero tiene que encontrarte trabajando."
            author="Pablo Picasso"
            meta="Demo visual — datos temporales hasta conectar la API real"
            isMock
          />
        </div>
      </div>

      <div className="feature-grid" aria-label="Funciones principales">
        {featureCards.map((feature) => {
          const Icon = feature.icon

          return (
            <article className="feature-card" key={feature.title}>
              <div className="feature-card-icon" aria-hidden="true">
                <Icon size={22} />
              </div>

              <Badge variant="muted">{feature.badge}</Badge>

              <h2 className="feature-card-title">{feature.title}</h2>

              <p className="feature-card-description">{feature.description}</p>
            </article>
          )
        })}
      </div>

      <aside className="tech-panel" aria-label="Resumen tecnico del proyecto">
        <div>
          <p className="eyebrow">Preparado para portfolio</p>
          <h2>Una landing visual, pero honesta con el estado del proyecto.</h2>
        </div>

        <p>
          Esta Home usa contenido temporal para validar el diseño. La conexión
          con frases reales, favoritos, autenticación y CRUD privado se
          implementará después en ramas separadas.
        </p>
      </aside>
    </section>
  )
}