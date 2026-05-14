# Memoria técnica — feat/share-channels

## Objetivo

Ampliar el sistema de compartir frases añadiendo canales específicos sin romper
el comportamiento existente de `ShareQuoteButton`. El usuario puede compartir
una frase por Web Share API, copiarla al portapapeles, abrirla directamente
en WhatsApp, Email, X o Facebook, o copiarla con feedback contextualizado
para Discord.

---

## Contexto previo

Antes de esta feature ya existía:

| Archivo | Rol |
|---|---|
| `src/utils/shareQuote.ts` | Función `shareQuote()`: Web Share API + fallback clipboard |
| `src/hooks/useShareQuote.ts` | Hook con estado `ShareFeedback` y timer de reset |
| `src/components/share/ShareQuoteButton.tsx` | Botón único "Compartir" con feedback visual |
| `src/styles/features/share.css` | Clases de feedback del botón único |

`ShareQuoteButton` era el único punto de compartir en `/explore`, `/favorites`
y `/my-quotes`. Esta feature lo sustituye en esas tres ubicaciones por el nuevo
componente `ShareQuoteActions`, pero `ShareQuoteButton` se mantiene intacto
por si se necesita en otros contextos.

---

## Archivos creados

| Archivo | Responsabilidad |
|---|---|
| `src/utils/shareChannels.ts` | Funciones puras: construcción de texto, URLs por canal y copia al portapapeles |
| `src/components/share/ShareQuoteActions.tsx` | Componente con 7 canales, estado de feedback y limpieza de timer |

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/styles/features/share.css` | Añadidos estilos de `.share-quote-actions`, `.share-channel-btn`, `.share-channel-letter` y `.share-quote-actions-feedback` |
| `src/components/explore/ExploreResults.tsx` | Sustituido `ShareQuoteButton` → `ShareQuoteActions` |
| `src/pages/FavoritesPage.tsx` | Sustituido `ShareQuoteButton` → `ShareQuoteActions` |
| `src/components/my-quotes/MyQuoteCard.tsx` | Sustituido `ShareQuoteButton` → `ShareQuoteActions` |

---

## Utilidad `shareChannels.ts`

Funciones puras sin estado que construyen el texto formateado y las URLs de
cada canal. No importan React ni hooks.

### Formato del texto compartido

Con autor:
```
"Texto de la frase"

— Autor

Compartido desde QuoteMatic
```

Sin autor (o autor desconocido):
```
"Texto de la frase"

Compartido desde QuoteMatic
```

La función `buildShareText(text, author)` detecta si el autor es `'Autor desconocido'`
y lo omite en ese caso.

### Funciones exportadas

| Función | Retorno |
|---|---|
| `buildShareText(text, author)` | Texto formateado multilínea |
| `getWhatsAppUrl(shareText)` | `https://wa.me/?text=<encoded>` |
| `getTwitterUrl(shareText)` | `https://twitter.com/intent/tweet?text=<encoded>` |
| `getEmailUrl(shareText)` | `mailto:?subject=<encoded>&body=<encoded>` |
| `getFacebookUrl()` | `https://www.facebook.com/sharer/sharer.php?u=<encoded APP_URL>` |
| `copyText(shareText)` | `Promise<boolean>` — `navigator.clipboard.writeText` |

`APP_URL` está fijado en `'https://quotematic.davlos.es'` (constante en el módulo).

---

## Componente `ShareQuoteActions`

### Props

```typescript
type ShareQuoteActionsProps = {
  quote: Quote
}
```

### Estado interno

| Estado | Tipo | Descripción |
|---|---|---|
| `feedback` | `string \| null` | Mensaje visible bajo los botones. Se borra a los 2,5 s |
| `timerRef` | `MutableRefObject` | Ref del timer para limpiar en desmontaje |

El `useEffect` de limpieza cancela el timer si el componente se desmonta antes
de que expire, evitando `setState` sobre componente desmontado.

### Canales y mecanismo

| Canal | Icono | Mecanismo | Feedback |
|---|---|---|---|
| Compartir | `Share2` (lucide) | `shareQuote()` — Web Share API o clipboard | "Compartido" / "Copiado" / "Error al compartir" |
| Copiar | `Copy` (lucide) | `copyText(shareText)` | "Copiado" / "Error al copiar" |
| WhatsApp | `MessageCircle` (lucide) | `window.open(getWhatsAppUrl(...))` | "Abriendo WhatsApp" |
| Email | `Mail` (lucide) | `window.open(getEmailUrl(...))` | "Abriendo Email" |
| X | texto `𝕏` | `window.open(getTwitterUrl(...))` | "Abriendo X" |
| Facebook | texto `f` | `window.open(getFacebookUrl())` | "Abriendo Facebook" |
| Discord | `Hash` (lucide) | `copyText(shareText)` | "Copiado para Discord" / "Error al copiar" |

Los canales X y Facebook no tienen icono en lucide-react 1.14.0. Se usa
un carácter Unicode/texto dentro de `.share-channel-letter` con `aria-hidden="true"`.
El `aria-label` del botón describe el canal con claridad.

### Feedback de cancelación nativa

Si el usuario cierra el menú nativo del S.O. (`AbortError` en Web Share API),
`shareQuote()` devuelve `'cancelled'` y el componente no muestra ningún mensaje.
No se trata como error.

### Estructura del render

```
<div class="share-quote-actions">
  <div class="share-quote-actions-row" role="group">
    <button class="share-channel-btn"> … Compartir </button>
    <button class="share-channel-btn"> … Copiar </button>
    <button class="share-channel-btn"> … WhatsApp </button>
    <button class="share-channel-btn"> … Email </button>
    <button class="share-channel-btn"> 𝕏 X </button>
    <button class="share-channel-btn"> f Facebook </button>
    <button class="share-channel-btn"> … Discord </button>
  </div>
  <p role="status" aria-live="polite"> {feedback} </p>  ← solo si hay feedback
</div>
```

---

## Estilos — `share.css`

Los estilos previos (`.share-quote-button--shared`, etc.) se mantienen sin
cambios. Se añade al final del archivo:

| Clase | Descripción |
|---|---|
| `.share-quote-actions` | Flex column, gap 6 px. Contenedor principal del componente |
| `.share-quote-actions-row` | Flex wrap, gap 6 px. Fila de botones de canal |
| `.share-channel-btn` | Pill glass 34 px de alto, 0.8 rem, font-weight 800. Sin `width: 100%` en móvil |
| `.share-channel-btn:hover` | border-color strong + glass-strong + translateY(-1 px) |
| `.share-channel-letter` | 0.95 rem, font-weight 900. Para los caracteres `𝕏` y `f` |
| `.share-quote-actions-feedback` | Color primary, 0.8 rem, font-weight 900. Sin margin ni padding relevante |

Decisión clave: `.share-channel-btn` **no usa** la clase `.ui-button` para evitar
heredar el `width: 100%` que el CSS de móvil aplica a `.ui-button` en contextos
como `.explore-actions` y `.my-quote-actions`. Los 7 botones siempre se muestran
en píldoras compactas que se pliegan con `flex-wrap`.

---

## Integración en páginas

### `/explore` — `ExploreResults.tsx`

`ShareQuoteActions` se inserta en `explore-actions-secondary`, que ya tiene
`display: flex; flex-wrap: wrap; gap: 12px`. El componente ocupa el espacio
natural como flex item. En móvil los botones de canal se pliegan dentro del
componente sin romper el layout general.

### `/favorites` — `FavoritesPage.tsx`

`ShareQuoteActions` reemplaza a `ShareQuoteButton` dentro de `.favorite-item-actions`.
El `<button>` Quitar permanece como hermano en el mismo flex container. En móvil
(< 760 px), `favorite-item-actions` pasa a `flex-direction: column`, por lo que
`ShareQuoteActions` ocupa todo el ancho disponible y el botón Quitar queda debajo.

### `/my-quotes` — `MyQuoteCard.tsx`

`ShareQuoteActions` se inserta entre los botones Editar y Borrar dentro de
`.my-quote-actions` (`display: flex; flex-wrap: wrap`). En móvil Editar y
Borrar van a ancho completo (regla `.my-quote-actions .ui-button { width: 100% }`
en `my-quotes.css`), mientras que los botones de canal mantienen su tamaño
compacto al no tener la clase `.ui-button`.

---

## Limitaciones conocidas

### Facebook

`sharer.php?u=` solo funciona bien con URLs públicas con metadatos Open Graph
correctos. No acepta texto arbitrario. El diálogo de Facebook mostrará la
previsualización de `https://quotematic.davlos.es`, no el contenido de la frase.
No existe alternativa sin la Graph API o un sistema de URLs únicas por frase.

### Discord

Discord no expone API pública para compartir contenido sin OAuth. La solución
implementada (copiar al portapapeles + feedback "Copiado para Discord") es el
flujo estándar de la comunidad Discord: el usuario pega en el canal que elija.

### `window.open` y bloqueadores de pop-ups

Si el navegador bloquea la ventana emergente (por no reconocerla como acción
directa de usuario en ciertos contextos), el feedback "Abriendo…" se mostrará
igualmente porque se muestra antes de la apertura. No hay API para detectar
de forma fiable si `window.open` fue bloqueado sin permisos especiales.

### Email sin cliente configurado

`mailto:` depende del sistema operativo. Si no hay cliente de correo configurado,
la apertura fallará silenciosamente. El feedback "Abriendo Email" se muestra de
todas formas.

---

## QA realizado

| Caso | Resultado |
|---|---|
| Botón "Compartir" — desktop sin Web Share | Copia al portapapeles, feedback "Copiado" |
| Botón "Compartir" — móvil con Web Share | Abre menú nativo, feedback "Compartido" |
| Botón "Compartir" — usuario cancela menú nativo | Sin feedback (comportamiento correcto) |
| Botón "Copiar" | Copia texto formateado, feedback "Copiado" |
| Botón "WhatsApp" | Abre wa.me con texto codificado, feedback visible |
| Botón "Email" | Abre cliente de correo con subject/body, feedback visible |
| Botón "X" | Abre twitter.com/intent/tweet con texto, feedback visible |
| Botón "Facebook" | Abre sharer con URL de QuoteMatic, feedback visible |
| Botón "Discord" | Copia texto, feedback "Copiado para Discord" |
| Feedback desaparece | A los 2,5 s automáticamente |
| Instancias múltiples | Cada card tiene su propio estado de feedback independiente |
| Favoritos: botón Quitar | Funciona sin interferencias |
| My Quotes: botones Editar/Borrar | Funcionan sin interferencias |
| Dark mode | Botones glass visibles y legibles |
| Light mode | Botones glass visibles y legibles |
| Responsive móvil | Botones se pliegan en múltiples filas correctamente |
| `prefers-reduced-motion` | Sin transform en hover |
| `npm run lint` | 0 errores |
| `npm run build` | Sin errores TypeScript, build exitoso |
