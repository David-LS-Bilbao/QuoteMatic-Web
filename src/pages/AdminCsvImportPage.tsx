import { useRef } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import { Badge } from '../components/ui'
import { useAdminCsvImport } from '../hooks/useAdminCsvImport'

const PREVIEW_LIMIT = 10

export function AdminCsvImportPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    fileName,
    rows,
    localErrors,
    result,
    isParsing,
    isImporting,
    error,
    parseFile,
    clear,
    importRows,
  } = useAdminCsvImport()

  const canImport =
    rows.length > 0 && localErrors.length === 0 && !isImporting && !isParsing

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
    e.target.value = ''
  }

  return (
    <section className="page-section csv-import-page">
      <div className="placeholder-header">
        <div className="home-badges">
          <Badge>Admin</Badge>
          <Badge variant="accent">CSV</Badge>
        </div>

        <p className="eyebrow">Zona administrativa</p>
        <h1>Importar frases CSV</h1>

        <p className="page-lead">
          Sube un archivo CSV para importar frases en bloque. El navegador
          parsea el archivo y envía el resultado al backend en una sola
          petición.
        </p>
      </div>

      {/* Format instructions */}
      <div className="csv-import-card">
        <div className="csv-import-card-header">
          <FileSpreadsheet size={20} aria-hidden="true" />
          <h2>Formato del CSV</h2>
        </div>

        <div className="csv-import-format">
          <code>
            text,authorName,authorType,situationSlug,quoteTypeSlug,language,contentRating,verificationStatus,sourceType,sourceReference
          </code>
        </div>

        <ul className="csv-import-rules">
          <li>
            Campos obligatorios:{' '}
            <strong>text, authorName, situationSlug, quoteTypeSlug</strong>
          </li>
          <li>Máximo 500 filas por importación</li>
          <li>Encoding: UTF-8 · separador: coma · cabecera en fila 1</li>
          <li>Los valores con comas deben ir entre comillas dobles</li>
        </ul>
      </div>

      {/* File selector */}
      <div className="csv-import-card">
        <div className="csv-import-card-header">
          <Upload size={20} aria-hidden="true" />
          <h2>Seleccionar archivo</h2>
        </div>

        <div
          className="csv-import-file-zone"
          role="button"
          tabIndex={0}
          aria-label="Seleccionar archivo CSV"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="csv-import-file-input"
            onChange={handleFileChange}
          />

          {fileName ? (
            <span className="csv-import-file-name">
              <FileSpreadsheet size={18} aria-hidden="true" />
              {fileName}
            </span>
          ) : (
            <span className="csv-import-file-placeholder">
              <Upload size={18} aria-hidden="true" />
              Haz clic para seleccionar un archivo .csv
            </span>
          )}
        </div>
      </div>

      {/* Parsing indicator */}
      {isParsing && (
        <div className="csv-import-card csv-import-parsing">
          <span>Parseando archivo…</span>
        </div>
      )}

      {/* Row count summary */}
      {!isParsing && rows.length > 0 && (
        <div className="csv-import-summary">
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>
            {rows.length}{' '}
            {rows.length === 1 ? 'fila detectada' : 'filas detectadas'}
          </span>
        </div>
      )}

      {/* Local validation errors */}
      {localErrors.length > 0 && (
        <div className="csv-import-card csv-import-errors-card" role="alert">
          <div className="csv-import-card-header csv-import-errors-header">
            <AlertCircle size={20} aria-hidden="true" />
            <h2>
              {localErrors.length}{' '}
              {localErrors.length === 1
                ? 'error detectado'
                : 'errores detectados'}
            </h2>
          </div>

          <ul className="csv-import-errors-list">
            {localErrors.map((msg, idx) => (
              <li key={idx}>
                <X size={14} aria-hidden="true" />
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview table */}
      {!isParsing && rows.length > 0 && (
        <div className="csv-import-card">
          <div className="csv-import-card-header">
            <h2>
              Vista previa
              {rows.length > PREVIEW_LIMIT && (
                <span className="csv-import-preview-note">
                  · {PREVIEW_LIMIT} de {rows.length} filas
                </span>
              )}
            </h2>
          </div>

          <div className="csv-import-table-wrapper">
            <table className="csv-import-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>text</th>
                  <th>authorName</th>
                  <th>situationSlug</th>
                  <th>quoteTypeSlug</th>
                  <th>language</th>
                  <th>contentRating</th>
                  <th>sourceType</th>
                  <th>sourceReference</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, PREVIEW_LIMIT).map((row) => (
                  <tr key={row.rowNum}>
                    <td>{row.rowNum}</td>
                    <td className="csv-import-cell-text">{row.text}</td>
                    <td>{row.authorName}</td>
                    <td>{row.situationSlug}</td>
                    <td>{row.quoteTypeSlug}</td>
                    <td>{row.language}</td>
                    <td>{row.contentRating}</td>
                    <td>{row.sourceType}</td>
                    <td>{row.sourceReference || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {fileName && (
        <div className="csv-import-actions">
          <button
            type="button"
            className="ui-button ui-button-primary ui-button-md"
            disabled={!canImport}
            onClick={() => void importRows()}
          >
            {isImporting ? (
              'Importando…'
            ) : (
              <>
                <Upload size={18} aria-hidden="true" />
                {rows.length > 0
                  ? `Importar ${rows.length} ${rows.length === 1 ? 'frase' : 'frases'}`
                  : 'Importar'}
              </>
            )}
          </button>

          <button
            type="button"
            className="ui-button ui-button-secondary ui-button-md"
            disabled={isImporting}
            onClick={clear}
          >
            <Trash2 size={18} aria-hidden="true" />
            Limpiar
          </button>
        </div>
      )}

      {/* Network / server error */}
      {error && (
        <div className="csv-import-card csv-import-errors-card" role="alert">
          <div className="csv-import-card-header csv-import-errors-header">
            <AlertCircle size={20} aria-hidden="true" />
            <h2>Error al importar</h2>
          </div>
          <p className="csv-import-error-msg">{error}</p>
        </div>
      )}

      {/* Backend result */}
      {result && (
        <div className="csv-import-card csv-import-result-card">
          <div className="csv-import-card-header csv-import-result-header">
            <CheckCircle2 size={20} aria-hidden="true" />
            <h2>Resultado de la importación</h2>
          </div>

          <div className="csv-import-result-stats">
            <div className="csv-import-result-stat">
              <span>Total</span>
              <strong>{result.total}</strong>
            </div>

            <div className="csv-import-result-stat csv-import-result-imported">
              <span>Importadas</span>
              <strong>{result.imported}</strong>
            </div>

            <div className="csv-import-result-stat">
              <span>Saltadas</span>
              <strong>{result.skipped}</strong>
            </div>

            <div className="csv-import-result-stat">
              <span>Errores</span>
              <strong>{result.errors.length}</strong>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="csv-import-result-errors-detail">
              <h3>Detalles de errores del servidor</h3>
              <ul>
                {result.errors.map((rowError, idx) => (
                  <li key={idx}>
                    <span className="csv-import-result-error-row">
                      Fila {rowError.row}
                    </span>
                    <span className="csv-import-result-error-text">
                      {rowError.text}
                    </span>
                    <span className="csv-import-result-error-msg">
                      {rowError.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
