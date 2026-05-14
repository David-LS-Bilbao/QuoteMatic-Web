const APP_URL = 'https://quotematic.davlos.es'

export function buildShareText(text: string, author: string): string {
  const hasAuthor = Boolean(author) && author !== 'Autor desconocido'
  return hasAuthor
    ? `"${text}"\n\n— ${author}\n\nCompartido desde QuoteMatic`
    : `"${text}"\n\nCompartido desde QuoteMatic`
}

export function getWhatsAppUrl(shareText: string): string {
  return `https://wa.me/?text=${encodeURIComponent(shareText)}`
}

export function getTwitterUrl(shareText: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
}

export function getEmailUrl(shareText: string): string {
  const subject = encodeURIComponent('Una frase de QuoteMatic')
  const body = encodeURIComponent(shareText)
  return `mailto:?subject=${subject}&body=${body}`
}

export function getFacebookUrl(): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}`
}

export async function copyText(shareText: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(shareText)
    return true
  } catch {
    return false
  }
}
