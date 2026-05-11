import { ExternalLink, Rocket } from 'lucide-react'

// Incluye enlaces a la documentación Swagger y al repositorio GitHub.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-copy">
        <span className="footer-kicker">
          <Rocket aria-hidden="true" size={16} />
          QuoteMatic Web
        </span>
        <p>
          Frontend React independiente preparado para consumir la API REST de
          QuoteMatic.
        </p>
      </div>

      <div className="footer-links" aria-label="Enlaces del proyecto">
        <a
          href="https://quotematic.davlos.es/api-docs/"
          target="_blank"
          rel="noreferrer"
        >
          Swagger
          <ExternalLink aria-hidden="true" size={16} />
        </a>

        <a
          href="https://github.com/David-LS-Bilbao/QuoteMatic-Web"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
          <ExternalLink aria-hidden="true" size={16} />
        </a>
      </div>
    </footer>
  )
}
