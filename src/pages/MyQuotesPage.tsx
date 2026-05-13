import { useState } from 'react'
import { BookOpenCheck, Plus } from 'lucide-react'

import { MyQuoteCard } from '../components/my-quotes/MyQuoteCard'
import { MyQuoteForm } from '../components/my-quotes/MyQuoteForm'
import { Badge, EmptyState } from '../components/ui'
import { useMyQuotes } from '../hooks/useMyQuotes'
import type { MyQuotePayload } from '../types/myQuote'
import type { Quote } from '../types/quote'

export function MyQuotesPage() {
  const {
    quotes,
    meta,
    isLoading,
    isMutating,
    errorMessage,
    createQuote,
    updateQuote,
    removeQuote,
  } = useMyQuotes()

  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)

  async function handleSubmit(payload: MyQuotePayload) {
    if (editingQuote) {
      await updateQuote(editingQuote._id, payload)
      setEditingQuote(null)
      return
    }

    await createQuote(payload)
  }

  function handleDelete(quoteId: string) {
    const shouldDelete = window.confirm('¿Seguro que quieres borrar esta frase?')

    if (!shouldDelete) {
      return
    }

    void removeQuote(quoteId)
  }

  return (
    <section className="page-section my-quotes-page">
      <div className="placeholder-header">
        <div className="home-badges">
          <Badge>Mis frases</Badge>
          <Badge variant="accent">Privado</Badge>
        </div>

        <p className="eyebrow">Espacio personal</p>
        <h1>Crea tu propia colección privada.</h1>

        <p className="page-lead">
          Estas frases solo están asociadas a tu sesión de usuario. Puedes
          crearlas, editarlas y borrarlas sin modificar la base pública.
        </p>
      </div>

      <div className="my-quotes-layout">
        <aside className="my-quotes-editor">
          <div className="my-quotes-editor-header">
            <Plus aria-hidden="true" size={20} />
            <strong>{editingQuote ? 'Editar frase' : 'Nueva frase'}</strong>
          </div>

          <MyQuoteForm
            key={editingQuote?._id ?? 'new-my-quote'}
            initialQuote={editingQuote}
            isSubmitting={isMutating}
            onSubmit={handleSubmit}
            onCancel={editingQuote ? () => setEditingQuote(null) : undefined}
          />
        </aside>

        <div className="my-quotes-list">
          {errorMessage ? (
            <EmptyState
              title="No se pudo cargar tu colección"
              description={errorMessage}
            />
          ) : null}

          {!errorMessage && isLoading ? (
            <EmptyState
              title="Cargando tus frases"
              description="Estamos recuperando tu colección privada."
            />
          ) : null}

          {!errorMessage && !isLoading && quotes.length === 0 ? (
            <EmptyState
              title="Todavía no tienes frases privadas"
              description="Crea tu primera frase desde el formulario para empezar tu colección."
            />
          ) : null}

          {!errorMessage && !isLoading && quotes.length > 0 ? (
            <>
              <div className="my-quotes-summary">
                <BookOpenCheck aria-hidden="true" size={18} />
                {meta.total}{' '}
                {meta.total === 1 ? 'frase privada' : 'frases privadas'}
              </div>

              <div className="my-quotes-grid">
                {quotes.map((quote) => (
                  <MyQuoteCard
                    key={quote._id}
                    quote={quote}
                    isMutating={isMutating}
                    onEdit={setEditingQuote}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}