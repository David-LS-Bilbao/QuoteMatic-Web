import { BookmarkX, Heart } from 'lucide-react'
import { Link } from 'react-router'
import { ShareQuoteButton } from '../components/share/ShareQuoteButton'
import { Badge, EmptyState, QuoteCard } from '../components/ui'
import { useFavorites } from '../hooks/useFavorites'
import { getFavoriteQuote } from '../utils/favoriteHelpers'
import { buildQuoteMeta, getAuthorName } from '../utils/quoteHelpers'

export function FavoritesPage() {
  const {
    favorites,
    pendingQuoteIds,
    isLoading,
    errorMessage,
    removeFavoriteByQuoteId,
  } = useFavorites()

  const favoriteQuotes = favorites
    .map((favorite) => getFavoriteQuote(favorite))
    .filter((quote) => quote !== null)

  function handleRemoveFavorite(quoteId: string) {
    void removeFavoriteByQuoteId(quoteId)
  }

  return (
    <section className="page-section favorites-page">
      <div className="placeholder-header">
        <div className="home-badges">
          <Badge>Favoritos</Badge>
          <Badge variant="accent">Sesión requerida</Badge>
        </div>

        <p className="eyebrow">Mi colección</p>
        <h1>Tus frases guardadas.</h1>

        <p className="page-lead">
          Aquí aparecerán las frases públicas que guardes desde el explorador.
          Más adelante podrás combinarlas con tus frases privadas.
        </p>
      </div>

      {errorMessage ? (
        <EmptyState
          title="No se pudieron cargar tus favoritos"
          description={errorMessage}
        />
      ) : null}

      {!errorMessage && isLoading ? (
        <EmptyState
          title="Cargando favoritos"
          description="Estamos recuperando tus frases guardadas."
        />
      ) : null}

      {!errorMessage && !isLoading && favoriteQuotes.length === 0 ? (
        <EmptyState
          title="Todavía no tienes favoritos"
          description="Explora frases públicas y pulsa Guardar para añadirlas a esta colección."
        >
          <Link className="ui-button ui-button-primary ui-button-md" to="/explore">
            Explorar frases
          </Link>
        </EmptyState>
      ) : null}

      {!errorMessage && !isLoading && favoriteQuotes.length > 0 ? (
        <div className="favorites-grid">
          {favoriteQuotes.map((quote) => (
            <article className="favorite-item" key={quote._id}>
              <QuoteCard
                quote={quote.text}
                author={getAuthorName(quote)}
                meta={buildQuoteMeta(quote) || 'Frase favorita'}
              />

              <div className="favorite-item-actions">
                <ShareQuoteButton quote={quote} />

                <button
                  className="ui-button ui-button-secondary ui-button-md"
                  type="button"
                  onClick={() => handleRemoveFavorite(quote._id)}
                  disabled={pendingQuoteIds.has(quote._id)}
                >
                  <BookmarkX aria-hidden="true" size={18} />
                  {pendingQuoteIds.has(quote._id) ? 'Quitando...' : 'Quitar'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {!errorMessage && !isLoading && favoriteQuotes.length > 0 ? (
        <div className="favorites-summary">
          <Heart aria-hidden="true" size={18} />
          {favoriteQuotes.length}{' '}
          {favoriteQuotes.length === 1 ? 'frase guardada' : 'frases guardadas'}
        </div>
      ) : null}
    </section>
  )
}