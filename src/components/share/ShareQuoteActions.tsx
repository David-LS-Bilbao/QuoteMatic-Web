import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  Copy,
  Hash,
  Mail,
  MessageCircle,
  Send,
  Share2,
} from 'lucide-react'

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
  variant?: 'compact' | 'full'
}

export function ShareQuoteActions({
  quote,
  variant = 'full',
}: ShareQuoteActionsProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

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

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    const id = window.requestAnimationFrame(() => {
      if (!wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      if (rect.bottom + 280 > window.innerHeight) {
        wrapperRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.cancelAnimationFrame(id)
    }
  }, [isMenuOpen])

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

  if (variant === 'compact') {
    const runAndClose = (action: () => void | Promise<void>) => {
      void Promise.resolve(action()).finally(() => {
        closeMenu()
      })
    }

    return (
      <div className="share-quote-menu-wrapper" ref={wrapperRef}>
        <button
          type="button"
          className="ui-button ui-button-secondary ui-button-md share-quote-menu-trigger"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-label="Abrir menú de envío"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <Send aria-hidden="true" size={18} />
          Enviar
          <ChevronDown
            aria-hidden="true"
            size={16}
            className={
              isMenuOpen
                ? 'share-quote-menu-chevron share-quote-menu-chevron-open'
                : 'share-quote-menu-chevron'
            }
          />
        </button>

        {isMenuOpen ? (
          <div
            className="share-quote-menu"
            role="menu"
            aria-label="Canales para compartir la frase"
          >
            <button
              type="button"
              role="menuitem"
              className="share-quote-menu-item"
              onClick={() =>
                runAndClose(() => openUrl(getWhatsAppUrl(shareText), 'Abriendo WhatsApp'))
              }
            >
              <MessageCircle aria-hidden="true" size={16} />
              WhatsApp
            </button>

            <button
              type="button"
              role="menuitem"
              className="share-quote-menu-item"
              onClick={() =>
                runAndClose(() => openUrl(getEmailUrl(shareText), 'Abriendo Email'))
              }
            >
              <Mail aria-hidden="true" size={16} />
              Email
            </button>

            <button
              type="button"
              role="menuitem"
              className="share-quote-menu-item"
              onClick={() =>
                runAndClose(() => openUrl(getTwitterUrl(shareText), 'Abriendo X'))
              }
            >
              <span aria-hidden="true" className="share-channel-letter">𝕏</span>
              X
            </button>

            <button
              type="button"
              role="menuitem"
              className="share-quote-menu-item"
              onClick={() =>
                runAndClose(() => openUrl(getFacebookUrl(), 'Abriendo Facebook'))
              }
            >
              <span aria-hidden="true" className="share-channel-letter">f</span>
              Facebook
            </button>

            <button
              type="button"
              role="menuitem"
              className="share-quote-menu-item"
              onClick={() => runAndClose(handleDiscord)}
            >
              <Hash aria-hidden="true" size={16} />
              Discord
            </button>

            <button
              type="button"
              role="menuitem"
              className="share-quote-menu-item"
              onClick={() => runAndClose(handleNativeShare)}
            >
              <Share2 aria-hidden="true" size={16} />
              Compartir nativo
            </button>
          </div>
        ) : null}

        {feedback ? (
          <p
            className="share-quote-actions-feedback share-quote-menu-feedback"
            role="status"
            aria-live="polite"
          >
            {feedback}
          </p>
        ) : null}
      </div>
    )
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
