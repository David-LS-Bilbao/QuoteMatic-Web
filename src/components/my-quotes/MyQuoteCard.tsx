import { Pencil, Trash2 } from 'lucide-react'

import type { Quote } from '../../types/quote'
import { buildQuoteMeta, getAuthorName } from '../../utils/quoteHelpers'
import { QuoteCard } from '../ui'

type MyQuoteCardProps = {
  quote: Quote
  isMutating: boolean
  onEdit: (quote: Quote) => void
  onDelete: (quoteId: string) => void
}

export function MyQuoteCard({
  quote,
  isMutating,
  onEdit,
  onDelete,
}: MyQuoteCardProps) {
  return (
    <article className="my-quote-item">
      <QuoteCard
        quote={quote.text}
        author={getAuthorName(quote)}
        meta={buildQuoteMeta(quote) || 'Frase privada'}
      />

      <div className="my-quote-actions">
        <button
          className="ui-button ui-button-secondary ui-button-md"
          type="button"
          onClick={() => onEdit(quote)}
          disabled={isMutating}
        >
          <Pencil aria-hidden="true" size={18} />
          Editar
        </button>

        <button
          className="ui-button ui-button-ghost ui-button-md my-quote-delete"
          type="button"
          onClick={() => onDelete(quote._id)}
          disabled={isMutating}
        >
          <Trash2 aria-hidden="true" size={18} />
          Borrar
        </button>
      </div>
    </article>
  )
}