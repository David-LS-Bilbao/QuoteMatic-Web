# Auditoria final QuoteMatic Web

Fecha: 2026-05-16  
Rama auditada: `feat/explore-scroll-quote-ui`  
Base de comparacion: `dev`

## Resumen ejecutivo

La rama esta bien enfocada para mejorar la experiencia de Explore y conectar mejor las rutas de autores, frases y compartir. La revision por codigo no detecta bugs criticos ni riesgos claros de TypeScript. La validacion tecnica pasa con `npm run lint` y `npm run build`.

El punto mas importante antes de abrir PR es visual: el panel pergamino de Explore usa `min-height`, pero no fija una altura estable ni limita el area de texto. Con frases muy largas, la card puede crecer y mover las acciones inferiores. Si la estabilidad completa del panel es criterio de aceptacion, conviene revisar este punto antes del PR.

## Archivos revisados

- `src/components/explore/ExploreResults.tsx`
- `src/components/share/ShareQuoteActions.tsx`
- `src/components/ui/QuoteCard.tsx`
- `src/hooks/useExploreQuotes.ts`
- `src/hooks/useAuthors.ts`
- `src/pages/AuthorDetailPage.tsx`
- `src/pages/FavoritesPage.tsx`
- `src/styles/features/explore.css`
- `src/styles/features/share.css`
- `src/styles/features/authors.css`
- `src/styles/layout.css`
- `src/styles/ui/quote-card.css`
- `src/utils/quoteHelpers.ts`
- `src/utils/shareChannels.ts`
- `src/utils/shareQuote.ts`
- `src/app/router.tsx`
- `README.md`
- `docs/`

## Validacion tecnica

| Comando | Resultado |
| ------- | --------- |
| `git status -sb` | Rama `feat/explore-scroll-quote-ui`, sin cambios locales antes de documentar |
| `git diff --stat dev...HEAD` | 14 archivos productivos modificados respecto a `dev` |
| `npm run lint` | OK |
| `npm run build` | OK |

Nota: `npm run build` muestra un warning informativo de `PLUGIN_TIMINGS` de Vite/Rolldown. No bloquea el build.

No existe script `test` en `package.json`, por lo que no se ha ejecutado suite automatizada adicional.

## Hallazgos por severidad

### Critico

No se detectan hallazgos criticos por revision de codigo.

### Alto

1. **Explore puede seguir cambiando de altura con frases muy largas.**  
   Archivo: `src/styles/features/explore.css`  
   La card protagonista tiene `min-height`, pero no tiene `height` estable, `max-height` ni overflow interno para el texto. Con contenido largo, el layout puede crecer y mover botones, acciones de compartir y contenido inferior.  
   Recomendacion: validar con frases extremas. Si la estabilidad visual es requisito de la rama, aplicar una solucion CSS contextual en Explore antes del PR.

### Medio

1. **Menu "Enviar" con accesibilidad basica, pero sin patron completo de menu.**  
   Archivo: `src/components/share/ShareQuoteActions.tsx`  
   El trigger usa `aria-haspopup="menu"` y `aria-expanded`, el menu usa `role="menu"` y los items `role="menuitem"`. Falta gestion de foco inicial y navegacion con flechas.  
   Recomendacion: aceptable para MVP, pero para accesibilidad mas estricta conviene implementar foco al abrir, `ArrowUp`/`ArrowDown` y retorno de foco al trigger.

2. **Compartir en Facebook no comparte la frase concreta.**  
   Archivo: `src/utils/shareChannels.ts`  
   Facebook usa una URL fija (`https://quotematic.davlos.es`) porque este canal no acepta texto arbitrario de forma fiable sin integraciones adicionales.  
   Recomendacion: documentarlo como limitacion aceptada o cambiar a una URL frontend de frase cuando exista deploy publico.

3. **Los enlaces de compartir no incluyen `/explore?quote=<id>`.**  
   Archivos: `src/components/share/ShareQuoteActions.tsx`, `src/utils/shareChannels.ts`, `src/utils/shareQuote.ts`  
   El texto compartido contiene la frase y autor, pero no una URL directa a la frase.  
   Recomendacion: si se busca viralidad o trazabilidad, ampliar helpers para construir una URL publica por frase.

### Bajo

1. **`window.open` no incluye `noopener`.**  
   Archivo: `src/components/share/ShareQuoteActions.tsx`  
   Se usa `window.open(url, '_blank', 'noreferrer')`. En navegadores modernos suele ser suficiente, pero `noopener,noreferrer` seria mas explicito.  
   Recomendacion: mejora menor de seguridad para una iteracion posterior.

2. **`useAuthors` cachea en memoria a nivel de modulo.**  
   Archivo: `src/hooks/useAuthors.ts`  
   Mejora rendimiento al volver a `/authors`, pero puede mostrar datos antiguos hasta pulsar reintentar o recargar la app.  
   Recomendacion: aceptable para catalogo publico poco cambiante.

3. **Detalle de autor carga hasta 100 frases.**  
   Archivo: `src/hooks/useAuthorQuotes.ts`  
   Es razonable para MVP, pero si un autor supera ese limite no se mostraria todo el catalogo.  
   Recomendacion: documentar o paginar en una iteracion futura.

### Mejora futura

- Añadir tests unitarios para `quoteHelpers`, `shareChannels` y comportamiento de `useExploreQuotes`.
- Añadir QA visual automatizado minimo para Explore en desktop/mobile.
- Unificar la generacion de texto compartido entre `shareQuote.ts` y `shareChannels.ts`.
- Revisar si el backend/frontend compartiran dominio final para construir URLs publicas de frase.

## Riesgos por area

| Area | Riesgo | Nivel |
| ---- | ------ | ----- |
| TypeScript | No se observan errores; `build` confirma tipos | Bajo |
| Accesibilidad | Menu compartir sin navegacion completa por teclado | Medio |
| Responsive/mobile | Explore con frase larga puede crecer; tablas de autor usan scroll horizontal controlado | Medio |
| Navegacion React Router | `/explore?quote=<id>` y `/authors/:authorId` estan integrados correctamente | Bajo |
| Z-index/stacking | `app-main` sube a `z-index: 2` y acciones a `z-index: 5`; no se detecta bloqueo evidente | Bajo |
| Rendimiento | Cache de autores y pool de 10 frases son razonables | Bajo |
| Regresiones | `QuoteCard` global gana enlace opcional; no afecta usos sin `authorHref` | Bajo |

## QA manual recomendado

Esta auditoria revisa codigo y ejecuta `lint/build`; no sustituye QA visual manual.

- Abrir `/explore` en desktop y movil.
- Probar frase corta, media y larga.
- Pulsar "Otra frase" al menos 20 veces.
- Confirmar que acciones y menu "Enviar" no quedan detras del footer.
- Abrir y cerrar menu "Enviar" con click fuera y tecla Escape.
- Probar Copiar, WhatsApp, Email, X, Facebook, Discord y compartir nativo.
- Entrar a `/authors/:authorId` desde un autor real.
- Abrir una frase desde detalle de autor y confirmar `/explore?quote=<id>`.
- Desde `/explore?quote=<id>`, pulsar "Otra frase" y confirmar que la URL se limpia.
- Revisar `/favorites` con usuario autenticado: guardar, quitar y compartir.
- Revisar dark mode y light mode.
- Confirmar que no hay scroll horizontal global.
- Revisar consola del navegador.

## Riesgos aceptados

- No hay suite automatizada de tests.
- Facebook comparte URL fija, no el contenido exacto de la frase.
- El menu "Enviar" cubre accesibilidad basica, no patron ARIA completo.
- Cache de autores en memoria no tiene TTL.

## Recomendacion final

**Recomendacion: revisar antes de abrir PR a `dev` si el objetivo principal de la rama es una card protagonista de altura completamente estable.**

Si el crecimiento moderado con frases largas se acepta como comportamiento esperado del pergamino, la rama esta tecnicamente lista para PR desde el punto de vista de `lint/build` y arquitectura.
