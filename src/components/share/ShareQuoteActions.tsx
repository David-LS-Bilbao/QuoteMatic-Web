import { useCallback, useEffect, useRef, useState } from 'react'
import { Copy, Hash, Mail, MessageCircle, Share2 } from 'lucide-react'

import type { Quote } from '../../types/quote'
import { getAuthorName } from '../../utils/quoteHelpers'
import { shareQuote } from '../../utils/shareQuote'
import {
  buildShareText,
  copyText,
  getEmailUrl,
  getFacebookUrl,
  getTwitterUrl,
  getWhatsAppUrl,
} from '../../utils/shareChannels'

type ShareQuoteActionsProps = {
  quote: Quote
}

export function ShareQuoteActions({ quote }: ShareQuoteActionsProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const showFeedback = useCallback((message: string) => {
    setFeedback(message)
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setFeedback(null), 2500)
  }, [])

  const author = getAuthorName(quote)
  const shareText = buildShareText(quote.text, author)

  async function handleNativeShare() {
    const result = await shareQuote(quote.text, author)
    if (result === 'shared') showFeedback('Compartido')
    else if (result === 'copied') showFeedback('Copiado')
    else if (result === 'error') showFeedback('Error al compartir')
  }

  async function handleCopy() {
    const ok = await copyText(shareText)
    showFeedback(ok ? 'Copiado' : 'Error al copiar')
  }

  async function handleDiscord() {
    const ok = await copyText(shareText)
    showFeedback(ok ? 'Copiado para Discord' : 'Error al copiar')
  }

  function openUrl(url: string, label: string) {
    window.open(url, '_blank', 'noreferrer')
    showFeedback(label)
  }

  return (
    <div className="share-quote-actions">
      <div className="share-quote-actions-row" role="group" aria-label="Canales para compartir">
        <button
          type="button"
          className="share-channel-btn"
          aria-label="Compartir frase"
          onClick={() => void handleNativeShare()}
        >
          <Share2 aria-hidden="true" size={15} />
          Compartir
        </button>

        <button
          type="button"
          className="share-channel-btn"
          aria-label="Copiar texto de la frase"
          onClick={() => void handleCopy()}
        >
          <Copy aria-hidden="true" size={15} />
          Copiar
        </button>

        <button
          type="button"
          className="share-channel-btn"
          aria-label="Compartir por WhatsApp"
          onClick={() => openUrl(getWhatsAppUrl(shareText), 'Abriendo WhatsApp')}
        >
          <MessageCircle aria-hidden="true" size={15} />
          WhatsApp
        </button>

        <button
          type="button"
          className="share-channel-btn"
          aria-label="Compartir por Email"
          onClick={() => openUrl(getEmailUrl(shareText), 'Abriendo Email')}
        >
          <Mail aria-hidden="true" size={15} />
          Email
        </button>

        <button
          type="button"
          className="share-channel-btn"
          aria-label="Compartir en X (anteriormente Twitter)"
          onClick={() => openUrl(getTwitterUrl(shareText), 'Abriendo X')}
        >
          <span aria-hidden="true" className="share-channel-letter">𝕏</span>
          X
        </button>

        <button
          type="button"
          className="share-channel-btn"
          aria-label="Compartir en Facebook"
          onClick={() => openUrl(getFacebookUrl(), 'Abriendo Facebook')}
        >
          <span aria-hidden="true" className="share-channel-letter">f</span>
          Facebook
        </button>

        <button
          type="button"
          className="share-channel-btn"
          aria-label="Copiar texto para Discord"
          onClick={() => void handleDiscord()}
        >
          <Hash aria-hidden="true" size={15} />
          Discord
        </button>
      </div>

      {feedback ? (
        <p className="share-quote-actions-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}
    </div>
  )
}
