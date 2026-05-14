# Memoria técnica — feat/explore-hero-quote

## Objetivo

Convertir `/explore` en una experiencia de frase protagonista: una sola frase
centrada visualmente, con lógica anti-repetición de frases y autores y una
estética editorial de pergamino cálido.

---

## Problema previo

`/explore` mostraba dos frases simultáneamente:
- recomendación principal (`quotes[0]`)
- alternativa bajo "También puedes probar" (`quotes[1]`)

Esto dividía el foco visual y generaba confusión. Además, pulsar "Otra frase"
hacía siempre una llamada al backend con `PAGE_SIZE = 2`, lo que significaba
repetición frecuente de frases y autores sin ningún control.

---

## Archivos modificados

| Archivo | Tipo de cambio |
|---|---|
| `src/hooks/useExploreQuotes.ts` | Rediseño del modelo de datos + anti-repetición |
| `src/components/explore/ExploreResults.tsx` | Eliminación de `secondaryQuote` y bloque secundario |
| `src/styles/features/explore.css` | Estilos hero + eliminación de clases huérfanas |

---

## Cambios funcionales

### `useExploreQuotes.ts`

**Pool de 10 frases por petición**

`PAGE_SIZE = 2` se reemplaza por `POOL_SIZE = 10`. Cada petición al backend
trae 10 frases. El hook las almacena en `pool: Quote[]` (estado interno) y
expone únicamente la frase elegida como `quotes: [displayed]`, manteniendo
compatibilidad total con `quotes[0]` en `ExploreResults`.

**Barajado de pool (Fisher-Yates)**

`shuffleQuotes(response.data)` crea una copia barajada del array antes de
guardarlo. El backend puede devolver frases en orden de inserción o agrupadas
por autor; el barajado rompe esa secuencia en el cliente sin mutar el original.

```typescript
function shuffleQuotes(quotes: Quote[]): Quote[] {
  const copy = [...quotes]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
```

**Clave de autor siempre no vacía**

`getAuthorKey()` devuelve `__unknown_author_${quote._id}` cuando no hay autor
conocido. Con la implementación anterior (clave vacía `''`), todas las frases
anónimas pasaban siempre por la prioridad P1 de selección, lo que hacía que
dominaran la pantalla. Ahora cada frase anónima tiene su propio "autor" a
efectos de diversidad.

```typescript
// Antes
return ''
// Ahora
return `__unknown_author_${quote._id}`
```

**Lógica de selección `pickQuote`**

```
P1 — id no visto + autor no visto  →  pick aleatorio del grupo
P2 — id no visto (autor puede repetir)  →  pick aleatorio del grupo
P3 — todos los ids vistos  →  devuelve null (señal de pool agotado)
```

**Historial de autores persiste entre pools**

Cuando el pool se agota (`pickQuote` devuelve null), solo se resetea
`seenQuoteIdsRef` (para poder volver a ver frases ya leídas del nuevo pool).
`seenAuthorKeysRef` **no se resetea**, por lo que el historial de autores
acumulado en sesiones anteriores sigue activo en el nuevo pool.

Solo se resetean **ambos** historiales cuando el contexto cambia:
búsqueda, cambio de situación, cambio de tipo de frase o limpiar filtros.

**Navegación interna vs. petición al backend**

```
"Otra frase" pulsado
       │
       ▼
Marcar displayed como seen (ids + authors)
       │
       ▼
pickQuote(pool, seenIds, seenAuthors, currentId)
       │
   ┌───┴─────────────────────────────────────┐
   │ next ≠ null                             │ next = null
   │ navigateInPool(next)                    │ resetear solo seenQuoteIds
   │ CSS transition (180 ms)                 │ prepareQuoteRequest()
   │ sin llamada al backend                  │ fetch siguiente página
   └─────────────────────────────────────────┘
```

Las primeras 9-10 navegaciones son instantáneas (sin loading). Solo en la
petición 11 (o cuando cambian los filtros) hay llamada al backend.

### `ExploreResults.tsx`

- Eliminada la variable `secondaryQuote`.
- Eliminado el bloque `<aside className="explore-secondary-card">`.
- Label cambiado de "Recomendación principal" a "Frase recomendada".
- `aria-label` del contenedor actualizado coherentemente.

---

## Cambios visuales

Estilos contextuales aplicados con `.explore-main-card .quote-card` para no
afectar el componente `QuoteCard` global usado en `/favorites`, `/my-quotes`
y `/authors/:id`.

| Elemento | Cambio |
|---|---|
| `.explore-main-card .quote-card` | Padding 40×44 px · gradientes radiales cálidos (salmón + morado suave) sobre glass · borde salmón tenue · sombra interior |
| `.explore-main-card .quote-card:hover` | Solo `translateY(-3px)` — sin tilt 3D |
| `.explore-main-card .quote-card::before` | Comilla decorativa `"` (`\201C`), 7 rem, `opacity: 0.1`, sin interacción |
| `.explore-main-card .quote-card-text` | `clamp(1.55rem, 4vw, 2.4rem)` · line-height 1.25 |
| `.explore-main-card .quote-card-author` | Color `--color-primary` (salmón) · 1.05 rem · font-weight 800 |
| Light mode | Fondo crema-blanco cálido · comilla con `opacity: 0.08` |

### Estilos eliminados por quedar huérfanos

```css
.explore-secondary-card { … }
.explore-secondary-card .quote-card { … }
.explore-secondary-card .quote-card-text { … }
.explore-secondary-title { … }
```

---

## Iteración de fixes anti-repetición

Tras la implementación inicial se detectó que los autores aún repetían
con frecuencia. Se aplicaron tres correcciones adicionales:

| Fix | Causa del problema | Solución |
|---|---|---|
| 1 | `seenAuthorKeysRef` se borraba al agotar el pool, perdiendo memoria entre pools | Solo resetear `seenQuoteIdsRef` en el agotamiento; conservar autores |
| 2 | El backend devuelve frases agrupadas por autor prolífico | Barajar con Fisher-Yates antes de guardar el pool |
| 3 | Frases sin autor usaban clave `''`, pasando siempre como P1 y saturando la pantalla | Clave sintética `__unknown_author_${_id}` — cada anónima es única |

---

## Segunda iteración — página aleatoria al refetchear

Tras los tres fixes anteriores, el usuario seguía percibiendo un patrón
"orden de listado". Auditoría del código identificó la causa: aunque el orden
**dentro** de cada pool era aleatorio (gracias al Fisher-Yates), la
**secuencia de páginas** era determinista. Con 39 frases divididas en 4
páginas de 10, el usuario veía siempre el mismo agrupamiento:

```
Pool 1 (página 1)  → 10 frases barajadas
Pool 2 (página 2)  → 10 frases barajadas
Pool 3 (página 3)  → 10 frases barajadas
Pool 4 (página 4)  →  9 frases barajadas
[ciclo vuelve a página 1]
```

Las "primeras 10 frases del catálogo" (ordenadas por `_id` en el backend)
siempre aparecían juntas en el primer pool, las siguientes 10 en el segundo,
etc. El barajado solo afectaba al orden interno, no a la composición de cada
bloque.

### Solución aplicada

Sustituir el incremento secuencial de página por una selección aleatoria
dentro del rango `[1, totalPages]`:

```typescript
// Antes
page: f.page >= totalPages || totalPages <= 1 ? 1 : f.page + 1

// Ahora
page: totalPages <= 1 ? 1 : Math.floor(Math.random() * totalPages) + 1
```

Cuando el pool se agota, la siguiente petición no apunta a la página
"siguiente", sino a una página aleatoria del catálogo. Combinado con el
Fisher-Yates dentro del pool, el resultado es:

- El usuario nunca sabe qué bloque de 10 llegará después.
- El orden global se vuelve impredecible.
- Con `totalPages` pequeño puede repetir la misma página por azar, lo que
  es comportamiento aleatorio aceptable (no determinista).
- Si `totalPages <= 1` (catálogo cabe en un solo pool), se mantiene la
  página 1 — no hay alternativa.

### Verificación recomendada

Antes de aceptar este cambio como definitivo, comprobar en DevTools →
Network → respuesta de `/api/quotes?...&limit=10` que `meta.totalPages`
refleja correctamente el número de páginas (4 para un catálogo de 39
frases). Si el backend devolviera `totalPages: 1` por error, todo el
sistema de paginación quedaría limitado a las primeras 10 frases sin
importar el cambio aleatorio aplicado.

---

## Resultado de validación

```
npm run lint   →  0 errores, 0 warnings
npm run build  →  ✓ built in 716 ms
```

---

## QA manual recomendado

```
Carga de /explore
  ✓ Solo aparece una frase (no "También puedes probar")
  ✓ Label "Frase recomendada" con icono Sparkles

"Otra frase" × 10 veces
  ✓ Sin llamada al backend hasta la petición 11 (pool interno)
  ✓ No repite la misma frase consecutivamente
  ✓ Prioriza mostrar autores distintos
  ✓ Con pool agotado: loading → nueva página → frase nueva

"Otra frase" × 30 veces (ciclo largo)
  ✓ Autores no se repiten hasta haber agotado los disponibles en el pool
  ✓ Nunca se bloquea; cuando todos son vistos se recicla correctamente

Cambio de filtros
  ✓ Cambiar situación → historial completo reseteado → frase nueva
  ✓ Cambiar tipo → historial completo reseteado → frase nueva
  ✓ Buscar por texto → historial completo reseteado → frase nueva
  ✓ Limpiar filtros → historial completo reseteado

Acciones
  ✓ Guardar / Guardada funciona sin interferencias
  ✓ Canales de compartir funcionan
  ✓ Botón "Enviar" sigue deshabilitado con pill "Pronto"

Visual
  ✓ Dark mode: card con gradientes cálidos, comilla decorativa visible
  ✓ Light mode: card crema, comilla sutil, texto legible
  ✓ Mobile ≤ 640 px: sin scroll horizontal, texto legible por clamp

Otras rutas
  ✓ /favorites — QuoteCard sin cambios visuales
  ✓ /my-quotes — QuoteCard sin cambios visuales
  ✓ /authors/:id — QuoteCard sin cambios visuales
  ✓ Sin errores en consola en ninguna ruta
```

---

## Limitaciones conocidas

| Limitación | Detalle |
|---|---|
| `totalPages` basado en POOL_SIZE = 10 | El contador "Selección X de Y" cuenta bloques de 10. Con 100 frases muestra "1 de 10" en vez de "1 de 50". Cambio intencional. |
| Aleatoriedad del lado del cliente | `Math.random()` no tiene semilla. Dos sesiones distintas ven órdenes distintos, que es el comportamiento deseado. |
| Pool pequeño con filtros muy estrechos | Con < 10 resultados el pool se agota antes; la lógica lo maneja reciclando. |
| Autores con muchas frases anónimas | Cada frase anónima tiene clave única, por lo que el sistema las trata como autores distintos y NO las agrupa para diversidad entre frases anónimas de un mismo "autor real desconocido". Trade-off aceptado. |
