import { Search, Users } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge, EmptyState } from '../components/ui'
import { useAuthors } from '../hooks/useAuthors'

export function AuthorsPage() {
  const { authors, isLoading, error, retry } = useAuthors()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return authors
    return authors.filter((a) => a.name.toLowerCase().includes(q))
  }, [authors, search])

  return (
    <section className="page-section authors-page">
      <div className="placeholder-header">
        <div className="home-badges">
          <Badge>Catálogo</Badge>
          <Badge variant="accent">Autores</Badge>
        </div>

        <p className="eyebrow">Catálogo</p>
        <h1>Autores</h1>

        <p className="page-lead">
          Explora los autores del catálogo QuoteMatic y descubre sus frases.
        </p>
      </div>

      {!error && !isLoading ? (
        <div className="authors-search-wrapper">
          <label className="authors-search" htmlFor="authors-search-input">
            <Search aria-hidden="true" size={18} />
            <input
              id="authors-search-input"
              type="search"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <span className="authors-count">
            <Users aria-hidden="true" size={16} />
            {filtered.length}{' '}
            {filtered.length === 1 ? 'autor' : 'autores'}
          </span>
        </div>
      ) : null}

      {error ? (
        <EmptyState
          title="No se pudieron cargar los autores"
          description={error}
        >
          <button
            className="ui-button ui-button-secondary ui-button-md"
            type="button"
            onClick={retry}
          >
            Reintentar
          </button>
        </EmptyState>
      ) : null}

      {!error && isLoading ? (
        <div
          className="authors-grid"
          aria-busy="true"
          aria-label="Cargando autores"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="author-card author-card-skeleton"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : null}

      {!error && !isLoading && filtered.length === 0 ? (
        <EmptyState
          title={search ? 'Sin resultados' : 'No hay autores disponibles'}
          description={
            search
              ? `No se encontraron autores que coincidan con "${search}".`
              : 'Vuelve pronto, el catálogo de autores se irá completando.'
          }
        >
          {search ? (
            <button
              className="ui-button ui-button-secondary ui-button-md"
              type="button"
              onClick={() => setSearch('')}
            >
              Limpiar búsqueda
            </button>
          ) : null}
        </EmptyState>
      ) : null}

      {!error && !isLoading && filtered.length > 0 ? (
        <div className="authors-grid">
          {filtered.map((author) => (
            <article key={author._id} className="author-card">
              <div className="author-card-name">{author.name}</div>

              {author.authorType ? (
                <span className="author-card-type">{author.authorType}</span>
              ) : null}

              {author.description ? (
                <p className="author-card-description">{author.description}</p>
              ) : null}

              {author.quoteCount !== undefined ? (
                <div className="author-card-count">
                  {author.quoteCount}{' '}
                  {author.quoteCount === 1 ? 'frase' : 'frases'}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
