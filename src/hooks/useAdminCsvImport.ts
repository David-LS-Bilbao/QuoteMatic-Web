import { useCallback, useState } from 'react'
import Papa from 'papaparse'

import type { BulkImportResult, BulkQuoteRow } from '../services/adminBulkQuotesService'
import { importQuotesBulk } from '../services/adminBulkQuotesService'

const MAX_ROWS = 500

export type CsvPreviewRow = {
  rowNum: number
  text: string
  authorName: string
  authorType: string
  situationSlug: string
  quoteTypeSlug: string
  language: string
  contentRating: string
  verificationStatus: string
  sourceType: string
  sourceReference: string
}

export type UseAdminCsvImportResult = {
  fileName: string | null
  rows: CsvPreviewRow[]
  localErrors: string[]
  result: BulkImportResult | null
  isParsing: boolean
  isImporting: boolean
  error: string | null
  parseFile: (file: File) => void
  clear: () => void
  importRows: () => Promise<void>
}

function toCsvPreviewRow(
  raw: Record<string, string>,
  rowNum: number,
): CsvPreviewRow {
  return {
    rowNum,
    text: raw['text']?.trim() ?? '',
    authorName: raw['authorName']?.trim() ?? '',
    authorType: raw['authorType']?.trim() || 'unknown',
    situationSlug: raw['situationSlug']?.trim() ?? '',
    quoteTypeSlug: raw['quoteTypeSlug']?.trim() ?? '',
    language: raw['language']?.trim() || 'es',
    contentRating: raw['contentRating']?.trim() || 'all',
    verificationStatus: raw['verificationStatus']?.trim() || 'pending',
    sourceType: raw['sourceType']?.trim() || 'unknown',
    sourceReference: raw['sourceReference']?.trim() ?? '',
  }
}

function validateRow(row: CsvPreviewRow): string[] {
  const errors: string[] = []
  if (!row.text) errors.push(`Fila ${row.rowNum}: "text" es obligatorio`)
  if (!row.authorName) errors.push(`Fila ${row.rowNum}: "authorName" es obligatorio`)
  if (!row.situationSlug)
    errors.push(`Fila ${row.rowNum}: "situationSlug" es obligatorio`)
  if (!row.quoteTypeSlug)
    errors.push(`Fila ${row.rowNum}: "quoteTypeSlug" es obligatorio`)
  return errors
}

export function useAdminCsvImport(): UseAdminCsvImportResult {
  const [fileName, setFileName] = useState<string | null>(null)
  const [rows, setRows] = useState<CsvPreviewRow[]>([])
  const [localErrors, setLocalErrors] = useState<string[]>([])
  const [result, setResult] = useState<BulkImportResult | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parseFile = useCallback((file: File) => {
    const hasValidExtension = file.name.toLowerCase().endsWith('.csv')
    const hasValidType =
      !file.type ||
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel'

    setFileName(file.name)
    setRows([])
    setResult(null)
    setError(null)

    if (!hasValidExtension && !hasValidType) {
      setLocalErrors(['El archivo debe tener extensión .csv'])
      return
    }

    setIsParsing(true)
    setLocalErrors([])

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        if (data.length > MAX_ROWS) {
          setLocalErrors([
            `El archivo tiene ${data.length} filas. El máximo permitido es ${MAX_ROWS}.`,
          ])
          setIsParsing(false)
          return
        }

        // Row numbers start at 2 (row 1 = header)
        const parsedRows = data.map((raw, idx) => toCsvPreviewRow(raw, idx + 2))
        const errors = parsedRows.flatMap(validateRow)

        setRows(parsedRows)
        setLocalErrors(errors)
        setIsParsing(false)
      },
      error: ({ message }) => {
        setLocalErrors([`Error al parsear el CSV: ${message}`])
        setIsParsing(false)
      },
    })
  }, [])

  const clear = useCallback(() => {
    setFileName(null)
    setRows([])
    setLocalErrors([])
    setResult(null)
    setError(null)
  }, [])

  const importRows = useCallback(async () => {
    if (rows.length === 0 || localErrors.length > 0) return

    setIsImporting(true)
    setError(null)
    setResult(null)

    const quotes: BulkQuoteRow[] = rows.map((row) => ({
      text: row.text,
      authorName: row.authorName,
      authorType: row.authorType,
      situationSlug: row.situationSlug,
      quoteTypeSlug: row.quoteTypeSlug,
      language: row.language,
      contentRating: row.contentRating,
      verificationStatus: row.verificationStatus,
      sourceType: row.sourceType,
      sourceReference: row.sourceReference || undefined,
    }))

    try {
      const importResult = await importQuotesBulk(quotes)
      setResult(importResult)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al importar las frases',
      )
    } finally {
      setIsImporting(false)
    }
  }, [rows, localErrors])

  return {
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
  }
}
