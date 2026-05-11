// Componente reusable para tarjetas de citas

import { Badge } from './Badge'

// Tipos de propiedades
type QuoteCardProps = {
  quote: string
  author?: string
  meta?: string
  isMock?: boolean
}


// Componente QuoteCard
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

      <p className="quote-card-text">“{quote}”</p>

      {author ? <p className="quote-card-author">— {author}</p> : null}
    </article>
  )
}

/*
crea una tarjeta de cita reutil crea una card de frase preparada para la landing. 
Si isMock es true, deja claro que la frase es temporal.izable con soporte para autor, metadatos y estado mock.
*/