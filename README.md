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
- Layout principal con transición suave entre rutas (`PageTransition`).
- Navbar y Footer responsive con estilo glass.
- Componentes UI reutilizables:
  - `Button`
  - `Badge`
  - `QuoteCard`
  - `EmptyState`
- Home visual conectada a la API real.
  - Frase aleatoria desde `GET /api/quotes/random` con transición suave al cambiar.
  - Estados de carga, error y éxito.
- Explorador público de frases conectado a `GET /api/quotes`.
  - Filtros por situación y tipo de frase.
  - Búsqueda por texto.
  - Paginación con navegación cíclica.
  - Transición suave al cambiar resultados.
  - Filtros persistidos en `localStorage`.
- Cliente API base con `fetch`.
- Tipos TypeScript base para respuestas API y frases.
- Documentación técnica en `docs/`.

Pendiente:

- Auth: login, registro, logout y sesión.
- Favoritos.
- Mis frases privadas.
- Crear, editar y borrar frases privadas.
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
| `/` | Implementada | Home con frase aleatoria real y transición suave |
| `/explore` | Implementada | Explorador público con filtros, búsqueda y paginación |
| `/authors` | Placeholder visual | Futuro listado de autores |
| `/about` | Implementada visualmente | Información técnica del proyecto |
| `*` | Implementada | Página 404 |

Todas las rutas comparten transición de entrada (fade + slide) gestionada por `PageTransition`.

## Arquitectura actual

```txt
QuoteMatic-Web/
├── docs/
│   ├── memoria-feat-ui-design-system.md
│   ├── memoria-feat-home-random-quote.md
│   └── refactorizacion-paginas.md
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── components/
│   │   ├── explore/
│   │   │   ├── ExploreFilters.tsx
│   │   │   ├── ExploreHeader.tsx
│   │   │   ├── ExploreResults.tsx
│   │   │   └── ExploreSummary.tsx
│   │   ├── home/
│   │   │   ├── HomeFeatureGrid.tsx
│   │   │   ├── HomeInfoPanel.tsx
│   │   │   └── HomeQuoteSpotlight.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── PageTransition.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── EmptyState.tsx
│   │       ├── FilterControl.tsx
│   │       ├── QuoteCard.tsx
│   │       └── index.ts
│   ├── hooks/
│   │   ├── useExploreQuotes.ts
│   │   └── useRandomQuote.ts
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── AuthorsPage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── HomePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── catalogService.ts
│   │   └── quotesService.ts
│   ├── styles/
│   │   ├── components.css
│   │   ├── global.css
│   │   ├── utilities.css
│   │   └── variables.css
│   ├── types/
│   │   ├── api.ts
│   │   ├── catalog.ts
│   │   └── quote.ts
│   ├── utils/
│   │   └── quoteHelpers.ts
│   └── main.tsx
├── .env.example
├── README.md
└── package.json
```

## Capas principales

| Capa | Responsabilidad |
| ---- | --------------- |
| `app` | Montaje de la aplicación y rutas |
| `pages` | Composición de pantallas (sin lógica) |
| `hooks` | Estado, efectos y handlers por feature |
| `components/layout` | Layout general, navegación, footer y transición de ruta |
| `components/home` | Bloques visuales de la página Home |
| `components/explore` | Bloques visuales de la página Explore |
| `components/ui` | Componentes visuales reutilizables |
| `services` | Cliente HTTP y servicios por dominio |
| `utils` | Funciones puras sin dependencia de React |
| `types` | Tipos TypeScript de API y dominio |
| `styles` | Variables, estilos globales, utilidades y componentes |

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
| Consumo de API | Implementado en Home con `/api/quotes/random` |
| `useState` | Implementado en Home |
| `useEffect` | Implementado en Home |
| `localStorage` | Pendiente |
| Mínimo 5 componentes | Cumplido |
| Responsive | Base visual implementada |
| TypeScript | Implementado |
| Documentación | En progreso |

## Plan de sprints

| Sprint | Rama | Estado | Objetivo |
| ------ | ---- | ------ | -------- |
| 0 | `feat/project-bootstrap` | Completado | Bootstrap Vite + React + TS |
| 1 | `feat/ui-design-system` | Completado | Sistema visual Cosmos |
| 2 | `feat/home-random-quote` | Completado | Home conectada a API real |
| 3 | `feat/explore-quotes` | Completado | Explorador público con filtros, búsqueda y paginación |
| — | `fix/final-demo-stability` | En curso | Refactor Home/Explore, transición de rutas y estabilidad |
| 4 | `feat/auth-session` | Pendiente | Login, registro, logout y sesión |
| 5 | `feat/favorites` | Pendiente | Favoritos de usuario |
| 6 | `feat/my-private-quotes` | Pendiente | CRUD privado de frases |
| 7 | `feat/share-quote` | Pendiente | Compartir/copiar frase |
| 8 | `chore/docs-and-demo-polish` | Pendiente | README, capturas y preparación demo |

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
 /ruta-inexistente
```

Checklist visual:

```txt
- Sin errores en consola.
- Sin scroll horizontal.
- Navbar usable en móvil.
- Footer correcto en móvil y desktop.
- Transición suave al navegar entre rutas (fade + slide).
- Navbar y footer NO se animan al navegar.
- Home carga una frase real.
- Botón "Sorpréndeme" activa transición suave al cambiar frase.
- Explorador carga frases reales con filtros y búsqueda.
- Botón "Otra frase" activa transición suave al cambiar resultados.
- Estados de carga/error no rompen la UI.
- Con prefers-reduced-motion activado: sin animaciones, sin saltos de layout.
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
