import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { Badge, EmptyState } from '../components/ui'
import { useAuthorQuotes } from '../hooks/useAuthorQuotes'
import { buildQuoteMeta } from '../utils/quoteHelpers'

export function AuthorDetailPage() {
  const { authorId } = useParams<{ authorId: string }>()
  const { author, quotes, isLoading, error, retry } = useAuthorQuotes(authorId)

  if (error) {
    return (
      <section className="page-section authors-page">
        <EmptyState title="No se pudo cargar el autor" description={error}>
          <div className="author-detail-actions">
            <button
              className="ui-button ui-button-secondary ui-button-md"
              type="button"
              onClick={retry}
            >
              <RefreshCw aria-hidden="true" size={18} />
              Reintentar
            </button>

            <Link className="ui-button ui-button-ghost ui-button-md" to="/authors">
              <ArrowLeft aria-hidden="true" size={18} />
              Volver a autores
            </Link>
          </div>
        </EmptyState>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="page-section authors-page">
        <div className="author-detail-card author-detail-skeleton">
          Cargando frases del autor...
        </div>
      </section>
    )
  }

  if (!author) {
    return (
      <section className="page-section authors-page">
        <EmptyState
          title="Autor no encontrado"
          description="No hemos encontrado este autor en el catálogo."
        >
          <Link className="ui-button ui-button-secondary ui-button-md" to="/authors">
            <ArrowLeft aria-hidden="true" size={18} />
            Volver a autores
          </Link>
        </EmptyState>
      </section>
    )
  }

  return (
    <section className="page-section authors-page">
      <div className="placeholder-header">
        <div className="home-badges">
          <Badge>Autor</Badge>
          {author.authorType ? <Badge variant="accent">{author.authorType}</Badge> : null}
        </div>

        <p className="eyebrow">Frases de autor</p>
        <h1>{author.name}</h1>

        <p className="page-lead">
          {author.description ??
            'Listado de frases asociadas a este autor dentro del catálogo público de QuoteMatic.'}
        </p>

        <Link
          className="ui-button ui-button-secondary ui-button-md author-detail-back"
          to="/authors"
        >
          <ArrowLeft aria-hidden="true" size={18} />
          Volver a autores
        </Link>
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          title="Este autor todavía no tiene frases"
          description="No hay frases activas asociadas a este autor en la API pública."
        />
      ) : (
        <div className="author-quotes-panel">
          <div className="author-quotes-header">
            <h2>Frases encontradas</h2>
            <span>
              {quotes.length} {quotes.length === 1 ? 'frase' : 'frases'}
            </span>
          </div>

          <div className="author-quotes-table-wrapper">
            <table className="author-quotes-table">
              <thead>
                <tr>
                  <th>Frase</th>
                  <th>Clasificación</th>
                  <th>Rating</th>
                  <th>Idioma</th>
                  <th>Fuente</th>
                </tr>
              </thead>

              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote._id}>
                    <td className="author-quote-text">
                      <Link
                        className="author-quote-link"
                        to={`/explore?quote=${encodeURIComponent(quote._id)}`}
                        title="Abrir esta frase en Explore"
                      >
                        <span className="author-quote-link-text">{quote.text}</span>
                        <span
                          className="author-quote-link-hint"
                          aria-hidden="true"
                        >
                          <Sparkles size={14} />
                          Abrir en Explore
                        </span>
                      </Link>
                    </td>
                    <td>{buildQuoteMeta(quote) || 'Sin clasificación'}</td>
                    <td>{quote.contentRating ?? '—'}</td>
                    <td>{quote.language ?? '—'}</td>
                    <td>{quote.sourceReference ?? quote.sourceType ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}