import { ArrowRight, RefreshCw } from 'lucide-react'
import { Link } from 'react-router'

import { useRandomQuote } from '../../hooks/useRandomQuote'
import { Badge, QuoteCard } from '../ui'

export function HomeQuoteSpotlight() {
  const {
    quote,
    isLoading,
    isQuoteTransitioning,
    errorMessage,
    loadRandomQuote,
  } = useRandomQuote()

  return (
    <div className="home-hero">
      <div className="home-hero-content">
        <div className="home-badges" aria-label="Características principales">
          <Badge>Frases por situación</Badge>
          <Badge variant="accent">Inspiración diaria</Badge>
        </div>

        <h1>Frases para cada momento, situación y estado mental.</h1>

        <p className="page-lead">
          Explora frases organizadas por situación y estilo. Encuentra
          inspiración para estudiar, trabajar, tomar decisiones o afrontar
          momentos de estrés.
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
  )
}
