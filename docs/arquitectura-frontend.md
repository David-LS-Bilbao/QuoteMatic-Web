# Arquitectura frontend

Fecha: 2026-05-16  
Proyecto: QuoteMatic Web

## Vision general

QuoteMatic Web es una SPA React + TypeScript + Vite que consume la API REST desplegada en `https://quotematic.davlos.es`. El frontend no accede a base de datos ni duplica logica de backend: compone pantallas, gestiona estado de UI y llama a servicios HTTP tipados.

La arquitectura es ligera y adecuada para portfolio/bootcamp: separa rutas, componentes, hooks, servicios, tipos, contexto, utilidades y estilos sin introducir una capa enterprise innecesaria.

## Stack

- React
- TypeScript
- Vite
- React Router
- CSS modular por carpetas
- Fetch API
- Cookies de sesion del backend con `credentials: 'include'`
- `lucide-react` para iconos
- `papaparse` para importacion CSV en cliente

## Capas del proyecto

| Capa | Responsabilidad |
| ---- | --------------- |
| `src/app` | Router y montaje de aplicacion |
| `src/pages` | Pantallas asociadas a rutas |
| `src/components/layout` | Shell, navbar, footer y transiciones |
| `src/components/ui` | Componentes reutilizables: Button, Badge, EmptyState, QuoteCard |
| `src/components/explore` | UI especifica del explorador de frases |
| `src/components/share` | Acciones de compartir/copiar/enviar |
| `src/hooks` | Estado, efectos y comportamiento reutilizable |
| `src/services` | Acceso HTTP a la API |
| `src/context` | Estado transversal como autenticacion |
| `src/types` | Contratos TypeScript de dominio/API |
| `src/utils` | Helpers puros y formateadores |
| `src/styles` | Tokens, base, layout, UI y CSS por feature |

## Flujo de datos

1. Una pagina monta un hook de feature, por ejemplo `useExploreQuotes`.
2. El hook llama a un servicio, por ejemplo `quotesService`.
3. El servicio usa `apiClient`.
4. `apiClient` resuelve `VITE_API_BASE_URL` o fallback a `https://quotematic.davlos.es`.
5. La respuesta vuelve tipada hacia el hook.
6. La pagina renderiza componentes y estilos de feature.

Ejemplo Explore:

```txt
ExplorePage
  -> useExploreQuotes
  -> quotesService/catalogService
  -> apiClient
  -> QuoteMatic API
  -> ExploreResults / QuoteCard / ShareQuoteActions
```

## Rutas principales

| Ruta | Tipo | Notas |
| ---- | ---- | ----- |
| `/` | Publica | Home con frase aleatoria |
| `/explore` | Publica | Explorador de frases |
| `/explore?quote=<id>` | Publica | Frase concreta abierta en Explore |
| `/authors` | Publica | Catalogo de autores |
| `/authors/:authorId` | Publica | Detalle de autor y frases |
| `/favorites` | Protegida | Favoritos de usuario |
| `/my-quotes` | Protegida | CRUD privado de frases |
| `/account` | Protegida | Cuenta de usuario |
| `/admin/dev-panel` | Protegida admin | Panel de estado/catalogo |
| `/admin/import` | Protegida admin | Importacion CSV |

No hay ruta `/admin` generica; la administracion vive en rutas especificas.

## Decisiones de estado

- Auth usa `AuthContext` + `useAuth`.
- Favoritos usan `useFavorites` para compartir estado entre Explore/Favorites.
- Explore persiste filtros en `localStorage`.
- Theme persiste preferencia en `localStorage`.
- `useAuthors` usa cache simple en memoria de modulo para evitar refetch al volver al catalogo.
- `useExploreQuotes` expone solo la frase visible como `quotes[0]` para mantener compatibilidad con `ExploreResults`.

## Arquitectura CSS

El CSS se organiza por capas:

- `variables.css`: tokens globales.
- `base.css`: reset y estilos base.
- `layout.css`: shell, navbar, footer y menus de usuario.
- `utilities.css`: utilidades compartidas.
- `ui/`: estilos de componentes reutilizables.
- `features/`: estilos especificos de paginas/features.

La regla practica es no mezclar responsabilidades: un ajuste exclusivo de Explore debe vivir en `features/explore.css`; un ajuste global de `QuoteCard` debe vivir en `ui/quote-card.css` solo si afecta a todos sus usos.

## Integraciones clave

- API publica: frases, autores, situaciones y tipos.
- API autenticada: sesion, favoritos, mis frases.
- API admin: importacion CSV.
- Web Share API: compartir nativo cuando el navegador lo soporta.
- Clipboard API: copiar frase y fallback de compartir.

## Riesgos arquitectonicos conocidos

- No hay tests automatizados.
- No hay data fetching library; los hooks gestionan cache/estado de forma manual.
- Algunas URLs de compartir dependen de que exista una URL publica frontend definitiva.
- La accesibilidad del menu "Enviar" es suficiente para MVP, pero no implementa todo el patron de menu con flechas/foco inicial.

## Criterio de mantenimiento

- Priorizar cambios CSS contextuales antes de tocar componentes globales.
- Mantener `services` como unico punto de acceso HTTP.
- No mezclar llamadas a API dentro de componentes visuales.
- No introducir dependencias para problemas que CSS/React nativo resuelven bien.
- Documentar limitaciones aceptadas en PR cuando no se corrijan en la misma rama.
