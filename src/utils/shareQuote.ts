export type ShareResult = 'shared' | 'copied' | 'error' | 'cancelled'

export async function shareQuote(text: string, author: string): Promise<ShareResult> {
  const shareText = `"${text}" — ${author}`

  if (navigator.share) {
    try {
      await navigator.share({ title: 'QuoteMatic', text: shareText })
      return 'shared'
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return 'cancelled'
      }
    }
  }

  try {
    await navigator.clipboard.writeText(shareText)
    return 'copied'
  } catch {
    return 'error'
  }
}
