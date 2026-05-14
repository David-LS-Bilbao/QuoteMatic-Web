# Memoria técnica — feat/admin-csv-import

## Objetivo

Permitir al administrador importar frases en bloque desde un archivo CSV,
sin necesidad de introducirlas manualmente una a una.

El flujo completo ocurre en el navegador: el CSV se parsea localmente,
se valida antes de enviar y se despacha al backend en una única petición JSON.

---

## Contexto técnico

- Frontend React + Vite + TypeScript.
- Backend QuoteMatic API desplegado en `https://quotematic.davlos.es`.
- MongoDB gestionado en VPS por el backend.
- Autenticación por cookie de sesión (`credentials: 'include'`).
- Acceso restringido a rol `admin`.
- Sin cambios en backend ni en contratos de API.

---

## Flujo completo

```
Archivo .csv
   ↓
PapaParse (parseo en cliente)
   ↓
toCsvPreviewRow() — normalización de campos
   ↓
validateRow() — validación local por fila
   ↓
Vista previa en tabla (máx 10 filas)
   ↓
POST /api/quotes/bulk { quotes: BulkQuoteRow[] }
   ↓
Backend: crea/reutiliza autores, resuelve slugs, detecta duplicados
   ↓
BulkImportResult { total, imported, skipped, errors[] }
   ↓
Panel de resultados en UI
```

---

## Archivos implementados

| Archivo | Tipo | Responsabilidad |
|---|---|---|
| `src/pages/AdminCsvImportPage.tsx` | Página | UI completa del flujo de importación |
| `src/hooks/useAdminCsvImport.ts` | Hook | Orquesta parseo, validación y envío |
| `src/services/adminBulkQuotesService.ts` | Servicio | Llama a `POST /api/quotes/bulk` |
| `src/styles/features/admin-csv-import.css` | CSS | Estilos de la página de importación |
| `src/styles/features/admin.css` | CSS | Estilos del panel admin general |
| `src/pages/AdminDevPanelPage.tsx` | Página | Panel admin con stats y acceso rápido a `/admin/import` |
| `src/hooks/useAdminDashboard.ts` | Hook | Carga estadísticas del catálogo en paralelo |

---

## Dependencia externa añadida

| Paquete | Versión | Motivo |
|---|---|---|
| `papaparse` | `5.5.3` | Parseo CSV robusto en cliente (streams, cabecera, errores) |
| `@types/papaparse` | `5.5.2` | Tipos TypeScript para PapaParse |

---

## Endpoint de backend

```
POST /api/quotes/bulk
Content-Type: application/json
Cookie: <sesión admin>

Body:
{
  "quotes": [
    {
      "text": "...",
      "authorName": "...",
      "authorType": "...",
      "situationSlug": "...",
      "quoteTypeSlug": "...",
      "language": "es",
      "contentRating": "all",
      "verificationStatus": "pending",
      "sourceType": "unknown",
      "sourceReference": "..."   // opcional
    }
  ]
}

Respuesta exitosa:
{
  "success": true,
  "data": {
    "total": N,
    "imported": N,
    "skipped": N,
    "errors": [
      { "row": N, "text": "...", "message": "..." }
    ]
  }
}
```

El backend:
- Crea el autor si no existe, o reutiliza el existente por nombre.
- Resuelve `situationSlug` y `quoteTypeSlug` a sus ObjectIds.
- Detecta frases duplicadas y las cuenta como `skipped`.
- Devuelve errores por fila sin abortar la importación completa.

---

## Formato CSV esperado

### Cabecera

```
text,authorName,authorType,situationSlug,quoteTypeSlug,language,contentRating,verificationStatus,sourceType,sourceReference
```

### Campos obligatorios

| Campo | Validación |
|---|---|
| `text` | No vacío |
| `authorName` | No vacío |
| `situationSlug` | No vacío |
| `quoteTypeSlug` | No vacío |

### Valores por defecto aplicados en `toCsvPreviewRow()`

| Campo | Default |
|---|---|
| `authorType` | `"unknown"` |
| `language` | `"es"` |
| `contentRating` | `"all"` |
| `verificationStatus` | `"pending"` |
| `sourceType` | `"unknown"` |

### Reglas adicionales

- Encoding: UTF-8.
- Separador: coma.
- Cabecera obligatoria en fila 1 (los números de fila en errores empiezan en 2).
- Valores que contengan comas deben ir entre comillas dobles.
- Máximo **500 filas** por archivo.

---

## Tipos TypeScript

### `CsvPreviewRow` (hook)

```typescript
type CsvPreviewRow = {
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
```

### `BulkQuoteRow` (servicio → backend)

```typescript
type BulkQuoteRow = {
  text: string
  authorName: string
  authorType: string
  situationSlug: string
  quoteTypeSlug: string
  language: string
  contentRating: string
  verificationStatus: string
  sourceType: string
  sourceReference?: string   // omitido si está vacío
}
```

### `BulkImportResult` (respuesta backend)

```typescript
type BulkImportResult = {
  total: number
  imported: number
  skipped: number
  errors: BulkImportRowError[]
}

type BulkImportRowError = {
  row: number
  text: string
  message: string
}
```

---

## Hook `useAdminCsvImport`

### Estado

| Estado | Tipo | Descripción |
|---|---|---|
| `fileName` | `string \| null` | Nombre del archivo seleccionado |
| `rows` | `CsvPreviewRow[]` | Filas parseadas y normalizadas |
| `localErrors` | `string[]` | Errores de validación local |
| `result` | `BulkImportResult \| null` | Resultado devuelto por el backend |
| `isParsing` | `boolean` | PapaParse ejecutándose |
| `isImporting` | `boolean` | Petición al backend en curso |
| `error` | `string \| null` | Error de red o de servidor |

### Funciones expuestas

| Función | Descripción |
|---|---|
| `parseFile(file)` | Valida extensión, parsea con PapaParse, normaliza filas y ejecuta validación local |
| `clear()` | Resetea todo el estado (permite empezar de nuevo) |
| `importRows()` | Envía `rows` al backend mediante `importQuotesBulk()` |

### Decisiones de diseño del hook

- `parseFile` usa `useCallback` para estabilidad de referencia.
- El parseo es asíncrono por PapaParse (callback `complete`), no bloqueante.
- El número de fila en errores empieza en 2 para coincidir con la numeración real del CSV (fila 1 = cabecera).
- `importRows` no se ejecuta si `rows` está vacío o hay `localErrors`.
- El campo `sourceReference` se convierte a `undefined` si está vacío para no enviar cadenas vacías al backend.

---

## Página `AdminCsvImportPage`

### Secciones de la UI

1. **Header** — título, badges Admin/CSV, descripción.
2. **Tarjeta de formato** — cabecera CSV esperada + reglas de uso.
3. **Selector de archivo** — zona clicable (teclado accesible con Enter/Space), oculta el `<input type="file">` nativo.
4. **Indicador de parseo** — aparece mientras PapaParse trabaja.
5. **Resumen de filas** — N filas detectadas con icono de confirmación.
6. **Errores de validación local** — lista con icono de alerta, aparece con `role="alert"`.
7. **Vista previa** — tabla con las primeras 10 filas (`PREVIEW_LIMIT = 10`), scroll horizontal en mobile.
8. **Acciones** — botón "Importar N frases" (desactivado si hay errores) + botón "Limpiar".
9. **Error de red/servidor** — tarjeta de alerta con el mensaje de error.
10. **Resultado** — grid de 4 stats (Total / Importadas / Saltadas / Errores) + detalle de errores por fila.

### Estado del botón "Importar"

```typescript
const canImport =
  rows.length > 0 &&
  localErrors.length === 0 &&
  !isImporting &&
  !isParsing
```

---

## Panel admin `AdminDevPanelPage`

- Ruta: `/admin/dev-panel` (protegida, rol `admin`).
- Usa `useAdminDashboard` para cargar 4 stats en paralelo:
  - Total de frases (`GET /api/quotes`)
  - Total de autores (`GET /api/authors`)
  - Total de situaciones (`GET /api/situations`)
  - Total de tipos de frase (`GET /api/quote-types`)
- Acceso rápido a Swagger, Backend, Explorar, Autores e **Importar CSV**.
- Roadmap visible con estado actual de herramientas.

---

## Rutas registradas

| Ruta | Protección | Componente |
|---|---|---|
| `/admin/dev-panel` | Sesión + admin | `AdminDevPanelPage` |
| `/admin/import` | Sesión + admin | `AdminCsvImportPage` |

---

## QA realizado

| Caso | Resultado |
|---|---|
| CSV válido con 10 frases | Importación correcta, stats visibles |
| CSV con campo obligatorio vacío | Error local mostrado, botón desactivado |
| CSV con más de 500 filas | Error local antes de enviar |
| Archivo no CSV | Error de extensión |
| Frases duplicadas | Backend devuelve `skipped` y la UI lo muestra |
| Error de red | Mensaje de error amigable en UI |
| Acceso sin sesión admin | Redirige a login |
| Mobile responsive | Tabla con scroll horizontal, stats en 2 columnas |
| Modo oscuro | Correcto |
| Modo claro | Correcto |

---

## Riesgos conocidos

| Riesgo | Mitigación aplicada |
|---|---|
| CORS en frontend desplegado | El `apiClient` usa `credentials: 'include'`; el backend debe aceptar el dominio del frontend en CORS |
| Lotes grandes (>500 filas) | Limitado a 500 filas con validación local antes de enviar |
| Calidad de frases importadas | `verificationStatus` se envía como `"pending"` por defecto; el backend puede filtrarlas |
| Duplicados silenciosos | El backend detecta duplicados y los devuelve como `skipped` en el resultado |
| Timeout en lotes medianos | Sin paginación de envío implementada; a considerar si el backend impone límite de tiempo por petición |
