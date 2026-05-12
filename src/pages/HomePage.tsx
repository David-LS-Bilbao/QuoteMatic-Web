import { useEffect, useState } from 'react'
import {
  ArrowRight,
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
    badge: 'Contexto',
  },
  {
    icon: Sparkles,
    title: 'Filtra por estilo',
    description:
      'Combina cada situación con frases estoicas, filosóficas, motivacionales o reflexivas.',
    badge: 'Estilo',
  },
  {
    icon: Heart,
    title: 'Guarda tus favoritas',
    description:
      'Crea tu propia biblioteca de frases y vuelve a ellas cuando necesites inspiración.',
    badge: 'Favoritos',
  },
]

export function HomePage() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isQuoteTransitioning, setIsQuoteTransitioning] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

async function loadRandomQuote() {
  setIsLoading(true)
  setIsQuoteTransitioning(true)
  setErrorMessage(null)

  try {
    const response = await getRandomQuote()

    window.setTimeout(() => {
      setQuote(response.data)
      setIsQuoteTransitioning(false)
      setIsLoading(false)
    }, 180)
  } catch {
    window.setTimeout(() => {
      setErrorMessage(
        'No hemos podido cargar una frase ahora mismo. Inténtalo de nuevo.',
      )
      setIsQuoteTransitioning(false)
      setIsLoading(false)
    }, 180)
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
          'No hemos podido cargar una frase ahora mismo. Inténtalo de nuevo.',
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



        <div className="home-badges" aria-label="Características principales">
  <Badge>Frases por situación</Badge>
  <Badge variant="accent">Inspiración diaria</Badge>
  <Badge variant="muted">Favoritos personales</Badge>
</div>



          <h1>Frases para cada momento, situación y estado mental.</h1>

          <p className="page-lead">
            Explora frases organizadas por situación y estilo. Encuentra inspiración
            para estudiar, trabajar, tomar decisiones o afrontar momentos de estrés.
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
              {isLoading && !quote ? 'Cargando...' : 'Sorpréndeme'}
              <RefreshCw aria-hidden="true" size={18} />
            </button>
      
          </div>
        </div>

       <div className="home-hero-card" aria-label="Frase destacada">
  <div
    className={
      isQuoteTransitioning
        ? 'home-quote-transition home-quote-transition-active'
        : 'home-quote-transition'
    }
  >
    {isLoading && !quote ? (
      <QuoteCard
        quote="Buscando una frase para ti..."
        meta="Preparando inspiración"
        isMock
      />
    ) : errorMessage ? (
      <QuoteCard quote={errorMessage} meta="Inténtalo de nuevo" isMock />
    ) : quote ? (
      <QuoteCard
        quote={quote.text}
        author={quote.authorText ?? 'QuoteMatic'}
        meta="Frase destacada"
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

          <aside className="tech-panel" aria-label="Cómo funciona QuoteMatic">
        <div>
          <p className="eyebrow">Cómo funciona</p>
          <h2>Elige un contexto y encuentra una frase que encaje contigo.</h2>
        </div>

        <p>
          QuoteMatic organiza frases por situación y estilo para ayudarte a
          encontrar inspiración de forma rápida, clara y sin ruido visual.
        </p>
      </aside>
    </section>
  )
}