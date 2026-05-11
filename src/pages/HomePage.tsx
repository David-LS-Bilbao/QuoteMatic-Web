import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Code2,
  Compass,
  Heart,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router'

import { Badge, QuoteCard } from '../components/ui'
import { getRandomQuote } from '../services/quotesService'
import type { Quote } from '../types/quote'

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

export function HomePage() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function loadRandomQuote() {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await getRandomQuote()
      setQuote(response.data)
    } catch {
      setErrorMessage(
        'No hemos podido cargar una frase real ahora mismo. Inténtalo de nuevo.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    getRandomQuote()
      .then((response) => {
        if (!isMounted) return

        setQuote(response.data)
        setErrorMessage(null)
      })
      .catch(() => {
        if (!isMounted) return

        setErrorMessage(
          'No hemos podido cargar una frase real ahora mismo. Inténtalo de nuevo.',
        )
      })
      .finally(() => {
        if (!isMounted) return

        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

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

            <button
              className="ui-button ui-button-secondary ui-button-md"
              type="button"
              onClick={loadRandomQuote}
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Nueva frase'}
              <RefreshCw aria-hidden="true" size={18} />
            </button>

            <a
              className="ui-button ui-button-ghost ui-button-md"
              href="https://quotematic.davlos.es/api-docs/"
              target="_blank"
              rel="noreferrer"
            >
              Ver API
              <Code2 aria-hidden="true" size={18} />
            </a>
          </div>
        </div>

        <div className="home-hero-card" aria-label="Frase destacada">
          {isLoading ? (
            <QuoteCard
              quote="Buscando una frase en el universo QuoteMatic..."
              meta="Conectando con la API real"
              isMock
            />
          ) : errorMessage ? (
            <QuoteCard quote={errorMessage} meta="Error controlado" isMock />
          ) : quote ? (
            <QuoteCard
              quote={quote.text}
              author={quote.authorText ?? 'QuoteMatic'}
              meta="Frase real desde la API"
            />
          ) : (
            <QuoteCard
              quote="No hay frase disponible en este momento."
              meta="Estado vacío"
              isMock
            />
          )}
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
          <h2>Una landing visual conectada con datos reales.</h2>
        </div>

        <p>
          Esta Home ya consume una frase aleatoria desde la API REST de
          QuoteMatic. Las siguientes ramas añadirán explorador público,
          autenticación, favoritos y CRUD privado.
        </p>
      </aside>
    </section>
  )
}