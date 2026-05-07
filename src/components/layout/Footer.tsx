import { ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="site-footer">
      <span>QuoteMatic Web consume la API publica de QuoteMatic.</span>
      <a
        href="https://quotematic.davlos.es/api-docs/"
        target="_blank"
        rel="noreferrer"
      >
        Swagger
        <ExternalLink aria-hidden="true" size={16} />
      </a>
    </footer>
  )
}
