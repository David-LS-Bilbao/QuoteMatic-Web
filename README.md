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
- Documentación técnica en `docs/`.

Pendiente:

- Favoritos.
- Mis frases privadas.
- Crear, editar y borrar frases privadas.
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
| `/admin/dev-panel` | Placeholder (protegida, admin) | Futuro panel admin/dev |
| `*` | Implementada | Página 404 |

## Arquitectura actual

```txt
QuoteMatic-Web/
├── docs/
│   ├── memoria-feat-ui-design-system.md
│   ├── memoria-feat-home-random-quote.md
│   └── memoria-feat-auth-session.md
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
│   │   └── useRandomQuote.ts
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── AccountPage.tsx
│   │   ├── AdminDevPanelPage.tsx
│   │   ├── AuthorsPage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── RegisterPage.tsx
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   ├── catalogService.ts
│   │   └── quotesService.ts
│   ├── styles/
│   │   ├── components.css
│   │   ├── global.css
│   │   ├── utilities.css
│   │   └── variables.css
│   ├── types/
│   │   ├── api.ts
│   │   ├── apiClient.ts
│   │   ├── auth.ts
│   │   ├── catalog.ts
│   │   └── quote.ts
│   ├── utils/
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
- `styles` centraliza tokens, estilos globales, utilidades y componentes CSS.

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
| `hooks` | Estado, efectos y lógica reutilizable de UI |
| `context` | Estado transversal compartido |
| `services` | Cliente HTTP y servicios por dominio |
| `types` | Tipos TypeScript de API y dominio |
| `utils` | Helpers puros y formateadores |
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
| `localStorage` | Implementado en Explore para recordar filtros |
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
| 3 | `feat/explore-quotes` | Completado | Explorador público con filtros |
| 4 | `feat/auth-session` | Completado | Login, registro, logout, sesión y roles |
| 5 | `feat/favorites` | Pendiente | Favoritos de usuario |
| 6 | `feat/my-private-quotes` | Pendiente | CRUD privado de frases |
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

