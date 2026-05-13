import { Check, Copy, Share2, X } from 'lucide-react'

import type { Quote } from '../../types/quote'
import type { ShareFeedback } from '../../hooks/useShareQuote'
import { useShareQuote } from '../../hooks/useShareQuote'

type ShareQuoteButtonProps = {
  quote: Quote
  className?: string
}

function getIcon(status: ShareFeedback) {
  if (status === 'shared') return <Check aria-hidden="true" size={18} />
  if (status === 'copied') return <Copy aria-hidden="true" size={18} />
  if (status === 'error') return <X aria-hidden="true" size={18} />
  return <Share2 aria-hidden="true" size={18} />
}

function getLabel(status: ShareFeedback): string {
  if (status === 'shared') return 'Compartido'
  if (status === 'copied') return 'Copiado'
  if (status === 'error') return 'Error'
  return 'Compartir'
}

export function ShareQuoteButton({ quote, className }: ShareQuoteButtonProps) {
  const { status, share } = useShareQuote()
  const isActive = status !== 'idle'

  const cls = [
    'ui-button ui-button-secondary ui-button-md share-quote-button',
    isActive ? `share-quote-button--${status}` : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={cls}
      type="button"
      onClick={() => void share(quote)}
      disabled={isActive}
      aria-label={getLabel(status)}
    >
      {getIcon(status)}
      {getLabel(status)}
    </button>
  )
}
