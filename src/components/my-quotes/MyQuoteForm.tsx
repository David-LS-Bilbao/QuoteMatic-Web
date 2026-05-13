import type { FormEvent } from 'react'
import { useState } from 'react'
import { Save } from 'lucide-react'

import type { MyQuotePayload } from '../../types/myQuote'
import type { ContentRating, Quote } from '../../types/quote'

type MyQuoteFormProps = {
  initialQuote?: Quote | null
  isSubmitting: boolean
  onSubmit: (payload: MyQuotePayload) => Promise<void>
  onCancel?: () => void
}

export function MyQuoteForm({
  initialQuote = null,
  isSubmitting,
  onSubmit,
  onCancel,
}: MyQuoteFormProps) {
  const [text, setText] = useState(initialQuote?.text ?? '')
  const [authorText, setAuthorText] = useState(initialQuote?.authorText ?? '')
  const [sourceReference, setSourceReference] = useState(
    initialQuote?.sourceReference ?? '',
  )
  const [contentRating, setContentRating] = useState<ContentRating>(
    initialQuote?.contentRating ?? 'all',
  )

  const isEditing = Boolean(initialQuote)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await onSubmit({
      text: text.trim(),
      authorText: authorText.trim() || undefined,
      sourceReference: sourceReference.trim() || undefined,
      language: 'es',
      contentRating,
      sourceType: 'original',
    })

    if (!isEditing) {
      setText('')
      setAuthorText('')
      setSourceReference('')
      setContentRating('all')
    }
  }

  return (
    <form className="my-quote-form" onSubmit={handleSubmit}>
      <label className="auth-field">
        <span>Frase</span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escribe tu frase privada..."
          required
          minLength={3}
          maxLength={500}
        />
      </label>

      <label className="auth-field">
        <span>Autor opcional</span>
        <input
          type="text"
          value={authorText}
          onChange={(event) => setAuthorText(event.target.value)}
          placeholder="Ejemplo: Yo mismo"
        />
      </label>

      <label className="auth-field">
        <span>Referencia opcional</span>
        <input
          type="text"
          value={sourceReference}
          onChange={(event) => setSourceReference(event.target.value)}
          placeholder="Ejemplo: Diario personal"
        />
      </label>

      <label className="auth-field">
        <span>Contenido</span>
        <select
          value={contentRating}
          onChange={(event) => setContentRating(event.target.value as ContentRating)}
        >
          <option value="all">Para todos</option>
          <option value="teen">Adolescente</option>
          <option value="adult">Adulto</option>
        </select>
      </label>

      <div className="my-quote-form-actions">
        {onCancel ? (
          <button
            className="ui-button ui-button-ghost ui-button-md"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
        ) : null}

        <button
          className="ui-button ui-button-primary ui-button-md"
          type="submit"
          disabled={isSubmitting}
        >
          <Save aria-hidden="true" size={18} />
          {isSubmitting
            ? 'Guardando...'
            : isEditing
              ? 'Actualizar frase'
              : 'Crear frase'}
        </button>
      </div>
    </form>
  )
}