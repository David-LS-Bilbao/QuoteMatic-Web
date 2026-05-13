# Memoria técnica — Sprint 6: `feat/my-private-quotes`

Proyecto: **QuoteMatic-Web**  
Repositorio: `git@github.com:David-LS-Bilbao/QuoteMatic-Web.git`  
Rama de trabajo: `feat/my-private-quotes`  
Rama base: `dev`  
Backend/API: <https://quotematic.davlos.es>  
Swagger: <https://quotematic.davlos.es/api-docs/>

---

## 1. Contexto

Tras completar autenticación (`feat/auth-session`) y favoritos (`feat/favorites`), el siguiente paso natural es permitir al usuario autenticado gestionar su propia colección de frases privadas.

Estas frases no forman parte de la base de datos pública. Solo están asociadas a la sesión del usuario y son visibles únicamente para él. El backend asigna el propietario automáticamente desde la cookie de sesión activa.

---

## 2. Objetivo

Permitir al usuario autenticado crear, listar, editar y borrar sus propias frases privadas desde la ruta protegida `/my-quotes`.

---

## 3. Alcance implementado

- Página protegida `/my-quotes` (`MyQuotesPage`).
- Servicio de API `myQuotesService.ts`.
- Hook de estado `useMyQuotes.ts`.
- Formulario de creación/edición `MyQuoteForm.tsx`.
- Tarjeta de frase privada con acciones `MyQuoteCard.tsx`.
- Ruta protegida en el router.
- Enlace "Mis frases" en la Navbar, visible solo para usuarios autenticados.
- Estilos propios en `styles/features/my-quotes.css`.
- Registro de la feature en `styles/index.css`.

---

## 4. Fuera de alcance

- Filtros y paginación avanzada.
- Favoritos de frases privadas.
- Compartir o enviar frases privadas.
- Panel admin completo.
- Editor de texto enriquecido.
- Modal de confirmación de borrado (se usa `window.confirm` como solución MVP).
- Cambios en el backend.

---

## 5. Endpoints usados

```txt
GET    /api/me/quotes          → listar frases privadas (page, limit)
POST   /api/me/quotes          → crear frase privada
PUT    /api/me/quotes/:id      → actualizar frase privada
DELETE /api/me/quotes/:id      → borrar frase privada
```

Todas las peticiones usan `credentials: 'include'` a través de `apiClient`.

---

## 6. Flujo de usuario

```txt
1. Usuario no autenticado accede a /my-quotes
   → ProtectedRoute redirige a /login

2. Usuario autenticado accede a /my-quotes
   → useMyQuotes carga la lista con GET /api/me/quotes
   → si no hay frases: EmptyState con mensaje orientativo
   → si hay frases: lista en grid con MyQuoteCard

3. Crear frase
   → rellena el formulario (texto, autor, referencia, contenido)
   → POST /api/me/quotes
   → la lista se recarga

4. Editar frase
   → clic en "Editar" en una MyQuoteCard
   → el formulario se popula con los datos existentes
   → PUT /api/me/quotes/:id
   → la lista se recarga
   → el formulario vuelve a modo creación

5. Borrar frase
   → clic en "Borrar"
   → window.confirm como paso de confirmación MVP
   → DELETE /api/me/quotes/:id
   → la lista se recarga

6. Logout
   → Navbar oculta el enlace "Mis frases"
   → /my-quotes protegida por ProtectedRoute
```

---

## 7. Arquitectura de la feature

### `src/types/myQuote.ts`

Define los contratos TypeScript de la feature:

```txt
MyQuotePayload        — payload de creación (text, authorText?, language?, contentRating, sourceType, sourceReference?)
MyQuoteUpdatePayload  — Partial<MyQuotePayload> para edición parcial
MyQuotesMeta          — metadatos de paginación (page, limit, total, totalPages)
MyQuotesResult        — { quotes: Quote[], meta: MyQuotesMeta }
```

Los tipos de la frase en sí reutilizan `Quote` de `src/types/quote.ts` ya que el backend devuelve el mismo modelo tanto para frases públicas como privadas.

---

### `src/services/myQuotesService.ts`

Encapsula las cuatro operaciones CRUD contra la API:

```txt
getMyQuotes()                      → MyQuotesResult
createMyQuote(payload)             → Quote
updateMyQuote(id, payload)         → Quote
deleteMyQuote(id)                  → void
```

Incluye dos funciones de normalización internas:

- `normalizeQuotesResult` — acepta `Quote[]` o `{ success, data: Quote[] }`.
- `normalizeQuote` — acepta `Quote` o `{ success, data: Quote }`.
- `DEFAULT_META` — valores por defecto de paginación cuando el backend no los devuelve.

La petición de listado solicita `page=1&limit=50` para obtener la colección completa en una sola llamada, sin paginación visible en UI (MVP).

---

### `src/hooks/useMyQuotes.ts`

Gestiona el estado de la feature con dos flags separados:

```txt
isLoading   — carga inicial de la lista
isMutating  — operación de creación, edición o borrado en curso
```

Expone:

```txt
quotes, meta, isLoading, isMutating, errorMessage
createQuote(payload)
updateQuote(id, payload)
removeQuote(id)
loadMyQuotes()
```

Todas las mutaciones recargan la lista completa con `loadMyQuotes()` tras completarse, lo que mantiene la UI sincronizada sin optimistic updates.

---

### `src/components/my-quotes/MyQuoteForm.tsx`

Formulario controlado con cuatro campos:

| Campo | Tipo | Obligatorio | Valor por defecto |
|---|---|---|---|
| `text` | textarea | Sí | — |
| `authorText` | input text | No | — |
| `sourceReference` | input text | No | — |
| `contentRating` | select | Sí | `'all'` |

Campos fijados en el payload (no editables por el usuario):

```ts
language: 'es'
sourceType: 'original'
```

El componente funciona en modo creación (`initialQuote = null`) y modo edición (`initialQuote = Quote`). En modo creación, el formulario se limpia tras el submit. En modo edición, muestra un botón "Cancelar".

La prop `key={editingQuote?._id ?? 'new-my-quote'}` en `MyQuotesPage` fuerza el remontado del formulario al cambiar entre modos, reseteando el estado interno limpiamente sin necesidad de efectos.

---

### `src/components/my-quotes/MyQuoteCard.tsx`

Wrapper sobre el componente `QuoteCard` reutilizable que añade dos acciones:

- **Editar** → llama `onEdit(quote)`, que sube el estado de edición a `MyQuotesPage`.
- **Borrar** → llama `onDelete(quote._id)`, que en `MyQuotesPage` confirma con `window.confirm` y lanza `removeQuote`.

Usa `getAuthorName` y `buildQuoteMeta` de `utils/quoteHelpers.ts` para formatear los datos de la frase.

---

### `src/pages/MyQuotesPage.tsx`

Composición de la pantalla con layout de dos columnas:

```txt
aside (editor sticky)  →  MyQuoteForm
div   (lista)          →  estados: cargando / vacío / lista de MyQuoteCard
```

El formulario queda fijo (`position: sticky`) en desktop mientras el usuario hace scroll por la lista. Gestiona el estado de edición (`editingQuote`) localmente. Muestra un contador de frases (`meta.total`) con la etiqueta en singular/plural.

---

### `src/styles/features/my-quotes.css`

Estilos propios de la feature (patrón ITCSS + Feature Folders):

```txt
.my-quotes-layout     → grid de dos columnas (editor / lista)
.my-quotes-editor     → panel glass con posición sticky
.my-quote-form        → grid del formulario
.my-quote-item        → tarjeta individual con fondo glass
.my-quote-actions     → botones editar/borrar
.my-quote-delete      → acento color para el botón de borrado
.my-quotes-summary    → pill contador de frases
```

Responsive: a 980px pasa a una columna. A 640px los botones pasan a full-width en columna.

---

## 8. Decisiones técnicas

**El backend asigna el propietario desde la sesión.** El frontend no envía `ownerUserId`. El backend lee la cookie activa para determinar el usuario.

**`sourceType: 'original'` fijo.** En esta fase todas las frases son de tipo original. Si se añaden otros tipos en el futuro, basta con añadir un `select` al formulario.

**`language: 'es'` fijo.** Simplifica el formulario MVP. Extensible añadiendo un campo en el formulario cuando sea necesario.

**`isMutating` separado de `isLoading`.** La lista permanece visible durante operaciones de escritura en lugar de ocultarse con un spinner.

**`window.confirm` para borrado.** Solución deliberada para el MVP. Se sustituirá por un modal Cosmos en una iteración posterior.

**Recarga total tras mutación.** Tras cualquier operación de escritura se vuelve a llamar a `getMyQuotes()`. Evita lógica de actualización optimista que podría desfasarse del backend.

**Prop `key` para resetear formulario.** En lugar de un `useEffect` que limpie campos manualmente, se usa `key` para forzar el remontado de `MyQuoteForm` al cambiar de modo. Más limpio y predecible.

---

## 9. QA realizado

```bash
npm run lint   → sin errores
npm run build  → sin errores (337 kB JS, 29 kB CSS)
```

Checklist manual recomendado:

```txt
[ ] Acceder a /my-quotes sin sesión → redirige a /login
[ ] Acceder a /my-quotes con sesión → carga la lista
[ ] Lista vacía muestra EmptyState con mensaje orientativo
[ ] Crear frase → aparece en la lista
[ ] Editar frase → formulario se popula, actualiza y vuelve a modo creación
[ ] Borrar frase → confirm, borra y desaparece de la lista
[ ] Cancelar edición → formulario vuelve a modo creación
[ ] Contador refleja el número correcto de frases
[ ] Logout → "Mis frases" desaparece de la Navbar
[ ] Layout responsive en móvil (columna única, botones full-width)
```

---

## 10. Próximos pasos

```txt
feat/share-quote           → compartir/copiar frase con Web Share API
feat/admin-dev-panel       → panel admin/dev funcional
feat/theme-toggle          → modo oscuro/claro
chore/docs-and-demo-polish → README final, capturas y preparación demo
```

Mejoras posibles dentro de `/my-quotes` en iteraciones futuras:

- Modal de confirmación de borrado en lugar de `window.confirm`.
- Filtros y paginación cuando la colección crezca.
- Compartir una frase privada directamente desde `MyQuoteCard`.
