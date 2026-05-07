import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="page-section">
      <p className="eyebrow">404</p>
      <h1>Pagina no encontrada</h1>
      <p className="page-lead">
        La ruta solicitada no existe dentro de QuoteMatic Web.
      </p>
      <Link className="text-cta" to="/">
        Volver al inicio
      </Link>
    </section>
  )
}
