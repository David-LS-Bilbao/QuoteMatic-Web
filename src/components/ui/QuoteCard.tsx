import { Link } from 'react-router'

import { Badge } from './Badge'

type QuoteCardProps = {
  quote: string
  author?: string
  /** Si se pasa, el nombre del autor se renderiza como Link a esa ruta. */
  authorHref?: string
  meta?: string
  /** Si es true, muestra una etiqueta que indica que la frase es temporal (datos mock). */
  isMock?: boolean
}

export function QuoteCard({
  quote,
  author,
  authorHref,
  meta,
  isMock = false,
}: QuoteCardProps) {
  return (
    <article className="quote-card">
      <div className="quote-card-header">
        {meta ? <span className="quote-card-meta">{meta}</span> : null}
        {isMock ? <Badge variant="accent">Frase temporal</Badge> : null}
      </div>

      <p className="quote-card-text">"{quote}"</p>

      {author ? (
        <p className="quote-card-author">
          —{' '}
          {authorHref ? (
            <Link
              className="quote-card-author-link"
              to={authorHref}
              aria-label={`Ver frases de ${author}`}
            >
              {author}
            </Link>
          ) : (
            author
          )}
        </p>
      ) : null}
    </article>
  )
}
