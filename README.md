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

Proyecto en fase MVP React.

Ya implementado:

- Vite + React + TypeScript.
- React Router.
- ESLint.
- `.env.example` con URL base de API.
- Design System visual Cosmos.
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
- Componentes específicos para Home y Explore.
- Home visual conectada a la API real.
- Carga de frase aleatoria pública desde `GET /api/quotes/random`.
- Estados de carga, error y éxito en Home.
- Explorador público de frases con filtros.
- Búsqueda de frases.
- Paginación ligera en Explore.
- Persistencia de filtros con `localStorage`.
- Cliente API base con `fetch`.
- Servicios de frases, catálogos y autenticación.
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
- Documentación técnica en `docs/`.

Pendiente:

- Panel admin/dev funcional.
- Modo oscuro/claro.
- Compartir frase con Web Share API o copiar al portapapeles.
- Deploy del frontend.

## Stack actual

- React
- Vite
- TypeScript
- React Router
- lucide-react
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

Endpoints públicos previstos/activos para el MVP React:

```txt
GET /api/quotes/random
GET /api/quotes
GET /api/authors
GET /api/situations
GET /api/quote-types
```

Endpoints autenticados previstos:

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

El backend usa cookies de sesión, no JWT. Las peticiones autenticadas desde React deben usar:

```ts
credentials: 'include'
```

## Rutas actuales

| Ruta | Estado | Descripción |
| ---- | ------ | ----------- |
| `/` | Implementada | Home visual conectada a frase aleatoria real |
| `/explore` | Implementada | Explorador público con búsqueda, filtros, paginación ligera y datos reales |
| `/authors` | Placeholder visual | Futuro listado de autores |
| `/about` | Implementada visualmente | Información técnica del proyecto |
| `/login` | Implementada | Inicio de sesión con cookie |
| `/register` | Implementada | Registro de usuario con `ageRange` |
| `/account` | Implementada (protegida) | Cuenta del usuario autenticado |
| `/favorites` | Implementada (protegida) | Favoritos del usuario autenticado |
| `/my-quotes` | Implementada (protegida) | CRUD privado de frases del usuario |
| `/admin/dev-panel` | Placeholder (protegida, admin) | Futuro panel admin/dev |
| `*` | Implementada | Página 404 |

## Arquitectura actual

```txt
QuoteMatic-Web/
├── docs/
│   ├── memoria-feat-ui-design-system.md
│   ├── memoria-feat-home-random-quote.md
│   ├── memoria-feat-auth-session.md
│   ├── memoria-feat-my-private-quotes.md
│   └── refactorizacion-estilos-css.md
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
│   │   │   └── PageTransition.tsx
│   │   ├── my-quotes/
│   │   │   ├── MyQuoteCard.tsx
│   │   │   └── MyQuoteForm.tsx
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
│   │   ├── useAuth.ts
│   │   ├── useExploreQuotes.ts
│   │   ├── useFavorites.ts
│   │   ├── useMyQuotes.ts
│   │   └── useRandomQuote.ts
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── AccountPage.tsx
│   │   ├── AdminDevPanelPage.tsx
│   │   ├── AuthorsPage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MyQuotesPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── RegisterPage.tsx
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   ├── catalogService.ts
│   │   ├── favoritesService.ts
│   │   ├── myQuotesService.ts
│   │   └── quotesService.ts
│   ├── styles/
│   │   ├── base.css
│   │   ├── features/
│   │   │   ├── auth.css
│   │   │   ├── explore.css
│   │   │   ├── favorites.css
│   │   │   ├── home.css
│   │   │   ├── my-quotes.css
│   │   │   ├── page-transition.css
│   │   │   └── placeholders.css
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
│   │   ├── catalog.ts
│   │   ├── favorite.ts
│   │   ├── myQuote.ts
│   │   └── quote.ts
│   ├── utils/
│   │   ├── favoriteHelpers.ts
│   │   └── quoteHelpers.ts
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
| `features/` | Estilos específicos de pantallas o features: Home, Explore, Auth, placeholders y transiciones |

Regla de mantenimiento: los estilos nuevos deben ir al archivo de su capa o feature. No se debe recrear un archivo grande tipo `components.css` para acumular estilos sin dueño claro.

Esta organización sigue el patrón **ITCSS + Feature Folders**: ITCSS (Inverted Triangle CSS, Harry Roberts) dicta el orden de capas de menor a mayor especificidad; Feature Folders agrupa los estilos propios de cada pantalla en su carpeta dedicada. Ver `docs/refactorizacion-estilos-css.md` para más detalle.

## Design System Cosmos

La interfaz usa una dirección visual llamada **Cosmos**:

- Tema oscuro.
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
| Consumo de API | Cumplido — Home, Explore, Auth, Favorites y My Quotes |
| `useState` | Cumplido — usado en múltiples hooks y páginas |
| `useEffect` | Cumplido — usado en múltiples hooks y páginas |
| `localStorage` | Cumplido — Explore persiste filtros activos |
| Mínimo 5 componentes | Ampliamente cumplido |
| Autenticación y rutas protegidas | Cumplido |
| Responsive | Cumplido — mobile-first en todas las features |
| TypeScript | Cumplido |
| Documentación | En progreso |

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
| 7 | `feat/admin-dev-panel` | Pendiente | Panel admin/dev funcional |
| 8 | `feat/theme-toggle` | Pendiente | Modo oscuro/claro |
| 9 | `feat/share-quote` | Pendiente | Compartir/copiar frase |
| 10 | `chore/docs-and-demo-polish` | Pendiente | README, capturas y preparación demo |

## QA recomendado

Antes de cada PR:

```bash
npm run lint
npm run build
npm run dev
```

Revisión manual:

```txt
/
/explore
/authors
/about
/login
/register
/account
/favorites
/my-quotes
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
- Estados de carga/error no rompen la UI.
```

## Git workflow

Ramas principales:

```txt
main = estable
dev = integración
feat/* = features
docs/* = documentación
chore/* = mantenimiento
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

## Autor

David López Sotelo
