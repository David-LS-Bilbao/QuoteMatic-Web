import { Link } from 'react-router'

export function HomePage() {
  return (
    <section className="page-section">
      <p className="eyebrow">Frontend React independiente</p>
      <h1>QuoteMatic Web</h1>
      <p className="page-lead">
        Una interfaz preparada para explorar frases, autores y situaciones desde
        la API publica de QuoteMatic.
      </p>
      <Link className="text-cta" to="/explore">
        Ir al explorador de frases
      </Link>
    </section>
  )
}
