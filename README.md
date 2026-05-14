# QuoteMatic Web

Frontend React independiente para consumir la API REST pública de QuoteMatic.

## Resumen

QuoteMatic Web es el cliente frontend moderno del proyecto QuoteMatic. La aplicación está construida como una SPA visual, responsive y orientada a portfolio usando React, Vite y TypeScript.

El backend ya existe y se mantiene como fuente única de verdad. Este repositorio no rehace la API ni accede directamente a la base de datos: consume endpoints REST del backend desplegado.

## Enlaces

- Backend/API: <https://quotematic.davlos.es>
- Swagger: <https://quotematic.davlos.es/api-docs/>
- Repositorio frontend: `git@github.com:David-LS-Bilbao/QuoteMatic-Web.git`
- Repositorio backend: <https://github.com/David-LS-Bilbao/QuoteMatic>

## Estado actual

Proyecto en fase MVP React — demo list.

Ya implementado:

- Vite + React + TypeScript.
- React Router.
- ESLint.
- `.env.example` con URL base de API.
- Design System visual Cosmos (dark + light mode).
- Layout principal.
- Navbar y Footer responsive con estilo glass.
- Organización por capas y features propia de React:
  - `pages`
  - `components`
  - `hooks`
  - `services`
  - `context`
  - `types`
  - `utils`
  - `styles`
- Componentes UI reutilizables:
  - `Button`
  - `Badge`
  - `QuoteCard`
  - `EmptyState`
  - `FilterControl`
- Componentes específicos para Home, Explore, Share y My Quotes.
- Home visual conectada a la API real.
- Carga de frase aleatoria pública desde `GET /api/quotes/random`.
- Estados de carga, error y éxito en Home.
- Explorador público de frases con filtros.
- Búsqueda de frases.
- Paginación ligera en Explore.
- Filtro por autor en Explore desde URL (`?author=<id>&authorName=<name>`).
- Persistencia de filtros con `localStorage`.
- Cliente API base con `fetch`.
- Servicios de frases, catálogos, autores y autenticación.
- Tipos TypeScript base para respuestas API, frases y autenticación.
- Autenticación completa:
  - Login y registro conectados al backend.
  - Comprobación de sesión activa al arrancar.
  - Contexto global `AuthContext` con `AuthProvider`.
  - Hook `useAuth`.
  - Rutas protegidas con `ProtectedRoute`.
  - Página de cuenta (`/account`).
  - Soporte de roles: `user` y `admin`.
  - Placeholder de panel admin/dev (`/admin/dev-panel`).
  - Navbar reactiva según estado de sesión y rol.
- Favoritos de usuario:
  - Guardar y eliminar frases favoritas.
  - Página protegida `/favorites`.
  - Hook `useFavorites` y servicio `favoritesService`.
- Mis frases privadas (CRUD completo):
  - Crear, editar y borrar frases privadas.
  - Página protegida `/my-quotes`.
  - Hook `useMyQuotes` y servicio `myQuotesService`.
  - Componentes `MyQuoteForm` y `MyQuoteCard`.
- Tema oscuro/claro con toggle en navbar y persistencia en `localStorage`.
- Compartir frase con Web Share API y fallback al portapapeles.
- Canales de compartir específicos: copiar, WhatsApp, Email, X, Facebook y Discord, con feedback visual por canal.
- Catálogo público de autores (`/authors`) con búsqueda en tiempo real.
- Detalle de autor (`/authors/:authorId`) con tabla de frases del autor.
- Panel admin/dev (`/admin/dev-panel`) con estadísticas del catálogo y accesos rápidos.
- Importación de frases en bloque desde CSV (`/admin/import`) con parseo local, validación, vista previa y reporte de resultado.
- Documentación técnica en `docs/`.

Pendiente:

- Deploy del frontend.

## Stack actual

- React
- Vite
- TypeScript
- React Router
- lucide-react
- PapaParse (parseo CSV en cliente)
- CSS normal
- Fetch API
- API REST externa
- Cookies de sesión en backend

## Scripts disponibles

Instalar dependencias:

```bash
npm install
```

Arrancar entorno local:

```bash
npm run dev
```

Compilar build de producción:

```bash
npm run build
```

Ejecutar lint:

```bash
npm run lint
```

Previsualizar build:

```bash
npm run preview
```

## Variables de entorno

Crear un archivo `.env` en la raíz tomando como referencia `.env.example`:

```env
VITE_API_BASE_URL=https://quotematic.davlos.es
```

## API

Base URL:

```txt
https://quotematic.davlos.es
```

Swagger:

```txt
https://quotematic.davlos.es/api-docs/
```

Endpoints públicos activos:

```txt
GET /api/quotes/random
GET /api/quotes
GET /api/quotes?author=<id>
GET /api/authors
GET /api/situations
GET /api/quote-types
GET /api/authors/:id/quotes
```

Endpoints autenticados:

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout

GET    /api/favorites/me
POST   /api/favorites/:quoteId
DELETE /api/favorites/:quoteId

GET    /api/me/quotes
POST   /api/me/quotes
GET    /api/me/quotes/random
GET    /api/me/quotes/:id
PUT    /api/me/quotes/:id
DELETE /api/me/quotes/:id
```

Endpoints admin (requieren sesión + rol admin):

```txt
POST /api/quotes/bulk
```

El backend usa cookies de sesión, no JWT. Las peticiones autenticadas desde React deben usar:

```ts
credentials: 'include'
```

## Rutas actuales

| Ruta | Estado | Descripción |
| ---- | ------ | ----------- |
| `/` | Implementada | Home visual conectada a frase aleatoria real |
| `/explore` | Implementada | Explorador público con búsqueda, filtros, paginación y datos reales |
| `/authors` | Implementada | Catálogo de autores con búsqueda en tiempo real |
| `/authors/:authorId` | Implementada | Detalle de autor con tabla de frases |
| `/about` | Implementada visualmente | Información técnica del proyecto |
| `/login` | Implementada | Inicio de sesión con cookie |
| `/register` | Implementada | Registro de usuario con `ageRange` |
| `/account` | Implementada (protegida) | Cuenta del usuario autenticado |
| `/favorites` | Implementada (protegida) | Favoritos del usuario autenticado |
| `/my-quotes` | Implementada (protegida) | CRUD privado de frases del usuario |
| `/admin/dev-panel` | Implementada (protegida, admin) | Panel admin con estadísticas del catálogo y accesos rápidos |
| `/admin/import` | Implementada (protegida, admin) | Importación de frases en bloque desde CSV |
| `*` | Implementada | Página 404 |

## Arquitectura actual

```txt
QuoteMatic-Web/
├── docs/
│   ├── informe-previo.md
│   ├── memoria-feat-admin-csv-import.md
│   ├── memoria-feat-auth-session.md
│   ├── memoria-feat-share-channels.md
│   ├── memoria-feat-home-random-quote.md
│   ├── memoria-feat-my-private-quotes.md
│   ├── memoria-feat-ui-design-system.md
│   ├── PROJECT_STATUS.md
│   ├── refactorizacion-estilos-css.md
│   └── refactorizacion-paginas.md
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── explore/
│   │   │   ├── ExploreFilters.tsx
│   │   │   ├── ExploreHeader.tsx
│   │   │   ├── ExploreResults.tsx
│   │   │   └── ExploreSummary.tsx
│   │   ├── home/
│   │   │   ├── HomeFeatureGrid.tsx
│   │   │   ├── HomeInfoPanel.tsx
│   │   │   ├── HomeQuoteSpotlight.tsx
│   │   │   └── homeContent.ts
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── my-quotes/
│   │   │   ├── MyQuoteCard.tsx
│   │   │   └── MyQuoteForm.tsx
│   │   ├── share/
│   │   │   ├── ShareQuoteActions.tsx
│   │   │   └── ShareQuoteButton.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── EmptyState.tsx
│   │       ├── FilterControl.tsx
│   │       ├── QuoteCard.tsx
│   │       └── index.ts
│   ├── context/
│   │   ├── AuthProvider.tsx
│   │   └── authContext.ts
│   ├── hooks/
│   │   ├── useAdminCsvImport.ts
│   │   ├── useAdminDashboard.ts
│   │   ├── useAuth.ts
│   │   ├── useAuthorQuotes.ts
│   │   ├── useAuthors.ts
│   │   ├── useExploreQuotes.ts
│   │   ├── useFavorites.ts
│   │   ├── useMyQuotes.ts
│   │   ├── useRandomQuote.ts
│   │   ├── useShareQuote.ts
│   │   └── useTheme.ts
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── AccountPage.tsx
│   │   ├── AdminCsvImportPage.tsx
│   │   ├── AdminDevPanelPage.tsx
│   │   ├── AuthorDetailPage.tsx
│   │   ├── AuthorsPage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MyQuotesPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── RegisterPage.tsx
│   ├── services/
│   │   ├── adminBulkQuotesService.ts
│   │   ├── apiClient.ts
│   │   ├── authorsService.ts
│   │   ├── authService.ts
│   │   ├── catalogService.ts
│   │   ├── favoritesService.ts
│   │   ├── myQuotesService.ts
│   │   └── quotesService.ts
│   ├── styles/
│   │   ├── base.css
│   │   ├── features/
│   │   │   ├── admin.css
│   │   │   ├── admin-csv-import.css
│   │   │   ├── auth.css
│   │   │   ├── authors.css
│   │   │   ├── explore.css
│   │   │   ├── favorites.css
│   │   │   ├── home.css
│   │   │   ├── my-quotes.css
│   │   │   ├── page-transition.css
│   │   │   ├── placeholders.css
│   │   │   └── share.css
│   │   ├── index.css
│   │   ├── layout.css
│   │   ├── ui/
│   │   │   ├── badge.css
│   │   │   ├── button.css
│   │   │   ├── empty-state.css
│   │   │   ├── filter-control.css
│   │   │   ├── index.css
│   │   │   └── quote-card.css
│   │   ├── utilities.css
│   │   └── variables.css
│   ├── types/
│   │   ├── api.ts
│   │   ├── apiClient.ts
│   │   ├── auth.ts
│   │   ├── author.ts
│   │   ├── catalog.ts
│   │   ├── favorite.ts
│   │   ├── myQuote.ts
│   │   └── quote.ts
│   ├── utils/
│   │   ├── favoriteHelpers.ts
│   │   ├── quoteHelpers.ts
│   │   ├── shareChannels.ts
│   │   └── shareQuote.ts
│   └── main.tsx
├── .env.example
├── README.md
└── package.json
```

## Patrón arquitectónico

Este frontend **no aplica un patrón MVC clásico**. No existen carpetas formales de `models`, `views` y `controllers`, ni controladores explícitos como en un backend Express o una aplicación server-side.

La organización real es una arquitectura React por capas y features:

- `pages` componen pantallas/rutas.
- `components` contiene piezas visuales reutilizables y componentes específicos de feature.
- `hooks` concentra lógica de estado, efectos y comportamiento reutilizable.
- `services` encapsula acceso HTTP a la API REST.
- `context` gestiona estado transversal, como autenticación.
- `types` define contratos TypeScript de dominio y API.
- `utils` contiene helpers puros de presentación o formato.
- `styles` centraliza tokens, base global, layout, utilidades, UI reutilizable y CSS específico por feature.

Si se compara de forma aproximada con MVC:

| MVC aproximado | Equivalente en este proyecto |
| -------------- | ---------------------------- |
| Model | `types`, respuestas API y parte de `services` |
| View | `pages`, `components` y `styles` |
| Controller | `hooks`, handlers de páginas y `context` |

Esta equivalencia es solo orientativa. La arquitectura del proyecto es adecuada para un frontend React moderno porque separa UI, lógica de estado, acceso a datos y contratos sin forzar MVC.

## Capas principales

| Capa | Responsabilidad |
| ---- | --------------- |
| `app` | Montaje de la aplicación y rutas |
| `pages` | Composición de pantallas |
| `components/layout` | Layout general, navegación, footer y transiciones |
| `components/ui` | Componentes visuales reutilizables |
| `components/home` | Secciones específicas de la Home |
| `components/explore` | Formulario, resumen y resultados del explorador |
| `components/auth` | Componentes relacionados con protección de rutas |
| `components/my-quotes` | Formulario y tarjeta del CRUD privado de frases |
| `components/share` | Botón de compartir frase (`ShareQuoteButton`) y componente multicanal (`ShareQuoteActions`) |
| `pages/AdminDevPanelPage` | Panel admin con estadísticas y accesos rápidos |
| `pages/AdminCsvImportPage` | Importación de frases en bloque desde CSV |
| `hooks` | Estado, efectos y lógica reutilizable de UI |
| `context` | Estado transversal compartido |
| `services` | Cliente HTTP y servicios por dominio |
| `types` | Tipos TypeScript de API y dominio |
| `utils` | Helpers puros y formateadores |
| `styles` | CSS por capas: tokens, base, layout, utilidades, UI y features |

## Arquitectura CSS

La capa CSS sigue el mismo criterio de capas y features que la arquitectura React. El punto de entrada es `src/styles/index.css`, importado desde `src/main.tsx`.

| Archivo o carpeta | Responsabilidad |
| ----------------- | --------------- |
| `variables.css` | Tokens globales: colores, radios, sombras, layout y transiciones |
| `base.css` | Reset base, estilos de `html`, `body`, tipografía global y foco |
| `layout.css` | Shell de aplicación, navbar, footer y responsive de layout |
| `utilities.css` | Utilidades compartidas como `page-section`, `eyebrow` y `page-lead` |
| `ui/` | Estilos de componentes reutilizables: botones, badges, cards, empty states y filtros |
| `features/` | Estilos específicos de pantallas o features: Home, Explore, Auth, Authors, Share, placeholders y transiciones |

Regla de mantenimiento: los estilos nuevos deben ir al archivo de su capa o feature. No se debe recrear un archivo grande tipo `components.css` para acumular estilos sin dueño claro.

Esta organización sigue el patrón **ITCSS + Feature Folders**: ITCSS (Inverted Triangle CSS, Harry Roberts) dicta el orden de capas de menor a mayor especificidad; Feature Folders agrupa los estilos propios de cada pantalla en su carpeta dedicada. Ver `docs/refactorizacion-estilos-css.md` para más detalle.

## Design System Cosmos

La interfaz usa una dirección visual llamada **Cosmos**:

- Tema oscuro y claro con toggle en navbar.
- Fondos con gradientes radiales.
- Glassmorphism en navbar, footer, cards y paneles.
- Sombras suaves.
- Efectos 3D ligeros en cards.
- Responsive mobile-first.
- Soporte para `prefers-reduced-motion`.
- Compatibilidad visual con Safari/Mac mediante `-webkit-backdrop-filter`.

## Estado del MVP respecto a requisitos del bootcamp

| Requisito | Estado |
| --------- | ------ |
| Consumo de API | Cumplido — Home, Explore, Authors, Auth, Favorites, My Quotes y Admin |
| `useState` | Cumplido — usado en múltiples hooks y páginas |
| `useEffect` | Cumplido — usado en múltiples hooks y páginas |
| `localStorage` | Cumplido — Explore persiste filtros; Theme persiste preferencia |
| Mínimo 5 componentes | Ampliamente cumplido |
| Autenticación y rutas protegidas | Cumplido |
| Responsive | Cumplido — mobile-first en todas las features |
| TypeScript | Cumplido |
| Documentación | En curso — `docs/` con memorias técnicas de cada sprint |

## Plan de sprints

| Sprint | Rama | Estado | Objetivo |
| ------ | ---- | ------ | -------- |
| 0 | `feat/project-bootstrap` | Completado | Bootstrap Vite + React + TS |
| 1 | `feat/ui-design-system` | Completado | Sistema visual Cosmos |
| 2 | `feat/home-random-quote` | Completado | Home conectada a API real |
| 3 | `feat/explore-quotes` | Completado | Explorador público con filtros |
| 4 | `feat/auth-session` | Completado | Login, registro, logout, sesión y roles |
| 5 | `feat/favorites` | Completado | Favoritos de usuario |
| 6 | `feat/my-private-quotes` | Completado | CRUD privado de frases |
| 7 | `feat/theme-toggle` | Completado | Modo oscuro/claro con toggle y persistencia |
| 8 | `feat/share-quote` | Completado | Compartir frase con Web Share API + fallback clipboard |
| 9 | `feat/authors-catalog` | Completado | Catálogo de autores con búsqueda en tiempo real |
| 10 | `feat/author-detail` | Completado | Detalle de autor con tabla de frases |
| 11 | `feat/admin-dev-panel` | Completado | Panel admin/dev con estadísticas del catálogo |
| 12 | `feat/admin-csv-import` | Completado | Importación de frases en bloque desde CSV |
| — | `chore/final-demo-audit` | En curso | Auditoría final, README y docs actualizados |
| 13 | `feat/share-channels` | Completado | Canales de compartir: WhatsApp, Email, X, Facebook, Discord |

## QA recomendado

Antes de cada PR:

```bash
npm run lint
npm run build
npm run dev
```

Revisión manual de rutas:

```txt
/
/explore
/authors
/authors/<id-real>
/about
/login
/register
/account
/favorites
/my-quotes
/admin/dev-panel   (requiere sesión admin)
/admin/import      (requiere sesión admin)
/ruta-inexistente
```

Checklist visual:

```txt
- Sin errores en consola.
- Sin scroll horizontal.
- Navbar usable en móvil.
- Footer correcto en móvil y desktop.
- Home carga una frase real.
- Botón "Nueva frase" funciona.
- Explore carga frases; filtros y búsqueda funcionan.
- Authors muestra catálogo y búsqueda funciona.
- Click en autor navega a /authors/:id con tabla de frases.
- Compartir: Web Share, Copiar, WhatsApp, Email, X, Facebook y Discord funcionan.
- Feedback visual de compartir desaparece tras 2,5 s.
- Theme toggle cambia entre claro y oscuro.
- Favorites y My Quotes accesibles solo con sesión.
- Admin dev-panel carga estadísticas reales del catálogo.
- Admin import: CSV válido se parsea, previsualiza e importa.
- Admin import: errores de validación bloquean el botón de importar.
- /admin/dev-panel y /admin/import redirigen a login sin sesión admin.
- 404 correcto en ruta inexistente.
- Estados de carga/error no rompen la UI.
```

## Git workflow

Ramas principales:

```txt
main  = estable / demo
dev   = integración
```

Tipos de rama:

```txt
feat/*   = nuevas features
fix/*    = correcciones de bugs
docs/*   = documentación
chore/*  = mantenimiento, refactoring, auditoría
```

Flujo recomendado:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/nombre-feature
```

Antes de PR:

```bash
npm run lint
npm run build
git status
```

PR siempre a `dev`. Solo se mergea a `main` cuando el estado es estable y demo-ready.

## Autor

David López Sotelo
