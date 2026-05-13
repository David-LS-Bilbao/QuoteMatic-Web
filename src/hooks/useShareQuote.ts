import { useCallback, useEffect, useRef, useState } from 'react'

import type { Quote } from '../types/quote'
import { getAuthorName } from '../utils/quoteHelpers'
import { shareQuote } from '../utils/shareQuote'

export type ShareFeedback = 'idle' | 'shared' | 'copied' | 'error'

export function useShareQuote() {
  const [status, setStatus] = useState<ShareFeedback>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const share = useCallback(async (quote: Quote) => {
    const author = getAuthorName(quote)
    const result = await shareQuote(quote.text, author)

    if (result === 'cancelled') return

    setStatus(result)

    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setStatus('idle'), 2500)
  }, [])

  return { status, share }
}
