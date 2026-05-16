# Decisiones tecnicas

Fecha: 2026-05-16  
Proyecto: QuoteMatic Web

Este documento recoge decisiones utiles para entender el estado actual del frontend antes de abrir PR a `dev`.

## 1. Frontend independiente del backend

Decision: mantener QuoteMatic Web como SPA que consume `https://quotematic.davlos.es`.

Motivo:
- El backend ya existe y es la fuente de verdad.
- Evita duplicar reglas de negocio.
- Permite que el frontend sea demostrable como proyecto React independiente.

Impacto:
- Las variables de entorno solo necesitan `VITE_API_BASE_URL`.
- La autenticacion depende de cookies de sesion del backend.

## 2. React Router para rutas publicas y protegidas

Decision: usar `createBrowserRouter` y `ProtectedRoute`.

Motivo:
- Mantiene rutas claras y declarativas.
- Permite proteger `/favorites`, `/my-quotes`, `/account` y admin sin mezclar permisos en cada pagina.

Impacto:
- Las rutas publicas de portfolio siguen accesibles sin login.
- Las rutas admin dependen de rol `admin`.

## 3. Hooks por feature

Decision: concentrar estado complejo en hooks como `useExploreQuotes`, `useAuthors`, `useFavorites` y `useMyQuotes`.

Motivo:
- Las paginas quedan como composicion de UI.
- Los efectos y llamadas HTTP no se dispersan en componentes visuales.

Impacto:
- Facilita revisar bugs funcionales.
- Requiere disciplina para no hacer crecer demasiado cada hook.

## 4. Explore muestra una frase protagonista

Decision: `useExploreQuotes` mantiene un pool interno, pero expone solo la frase visible.

Motivo:
- La UI de Explore esta centrada en una frase protagonista.
- Permite reutilizar el contrato previo de `ExploreResults` con `quotes[0]`.

Impacto:
- "Otra frase" puede navegar dentro del pool sin pedir API en cada click.
- Cuando se agota el pool, se pide otra pagina aleatoria.

## 5. `/explore?quote=<id>` como deep link

Decision: soportar una frase concreta en Explore mediante query param.

Motivo:
- Permite navegar desde `/authors/:authorId` a una frase concreta.
- Facilita compartir/refrescar una vista directa de frase.

Impacto:
- Si `quote` existe, Explore entra en modo frase concreta.
- Si el usuario pulsa "Otra frase", se elimina `quote` y vuelve a modo normal.

## 6. `QuoteCard` con autor clicable opcional

Decision: ampliar `QuoteCard` con `authorHref` opcional.

Motivo:
- Reutilizar la card sin duplicar markup.
- Mantener compatibilidad con usos que no tienen autor enlazable.

Impacto:
- Explore y Favorites pueden enlazar a `/authors/:authorId`.
- My Quotes y otros usos no cambian si no pasan `authorHref`.

## 7. Share multicanal y menu compacto

Decision: mantener `ShareQuoteActions` con dos variantes: `full` y `compact`.

Motivo:
- En Explore hay poco espacio y encaja mejor un menu "Enviar".
- En Favorites/My Quotes puede mostrarse botonera completa.

Impacto:
- El comportamiento se comparte en un componente.
- El menu compacto necesita QA de stacking context y teclado.

## 8. CSS por feature antes que cambios globales

Decision: los cambios visuales de Explore viven en `src/styles/features/explore.css`.

Motivo:
- Evita romper `QuoteCard` en Favorites, My Quotes u otras pantallas.
- Hace mas facil revisar regresiones por pantalla.

Impacto:
- Las excepciones de diseño del pergamino no contaminan el componente global.
- Solo se toca `ui/quote-card.css` para comportamientos verdaderamente compartidos, como `authorHref`.

## 9. Cache simple de autores

Decision: `useAuthors` cachea autores en memoria a nivel de modulo.

Motivo:
- Al volver de detalle de autor al catalogo se evita una recarga visible.
- Es suficiente para un catalogo publico de baja frecuencia de cambio.

Impacto:
- Los datos pueden quedar antiguos hasta recargar o pulsar reintentar.
- No hay invalidacion por TTL.

## 10. Sin dependencias nuevas

Decision: resolver UI, sharing y cache con React/CSS nativo.

Motivo:
- Mantener el proyecto ligero y comprensible.
- Evitar dependencias innecesarias para un MVP de portfolio.

Impacto:
- Menos superficie de mantenimiento.
- Algunas piezas, como el menu ARIA completo, quedan como mejora futura si se requiere accesibilidad avanzada.
