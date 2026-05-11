import { Badge } from './Badge'

type QuoteCardProps = {
  quote: string
  author?: string
  meta?: string
  /** Si es true, muestra una etiqueta que indica que la frase es temporal (datos mock). */
  isMock?: boolean
}

export function QuoteCard({
  quote,
  author,
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

      {author ? <p className="quote-card-author">— {author}</p> : null}
    </article>
  )
}
