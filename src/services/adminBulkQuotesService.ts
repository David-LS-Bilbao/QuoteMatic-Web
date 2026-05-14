import { apiClient } from './apiClient'

export type BulkQuoteRow = {
  text: string
  authorName: string
  authorType: string
  situationSlug: string
  quoteTypeSlug: string
  language: string
  contentRating: string
  verificationStatus: string
  sourceType: string
  sourceReference?: string
}

export type BulkImportRowError = {
  row: number
  text: string
  message: string
}

export type BulkImportResult = {
  total: number
  imported: number
  skipped: number
  errors: BulkImportRowError[]
}

type BulkImportResponse = {
  success: boolean
  data: BulkImportResult
}

export async function importQuotesBulk(
  quotes: BulkQuoteRow[],
): Promise<BulkImportResult> {
  const response = await apiClient<BulkImportResponse>('/api/quotes/bulk', {
    method: 'POST',
    body: { quotes },
  })
  return response.data
}
