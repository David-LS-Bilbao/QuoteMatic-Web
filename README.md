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
- Componentes UI reutilizables:
  - `Button`
  - `Badge`
  - `QuoteCard`
  - `EmptyState`
- Home visual conectada a la API real.
- Carga de frase aleatoria pública desde `GET /api/quotes/random`.
- Estados de carga, error y éxito en Home.
- Cliente API base con `fetch`.
- Tipos TypeScript base para respuestas API y frases.
- Documentación técnica en `docs/`.

Pendiente:

- Explorador público de frases.
- Filtros por situación y tipo de frase.
- Búsqueda de frases.
- Paginación.
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
| `/` | Implementada | Home visual conectada a frase aleatoria real |
| `/explore` | Placeholder visual | Futuro explorador público de frases |
| `/authors` | Placeholder visual | Futuro listado de autores |
| `/about` | Implementada visualmente | Información técnica del proyecto |
| `*` | Implementada | Página 404 |

## Arquitectura actual

```txt
QuoteMatic-Web/
├── docs/
│   ├── memoria-feat-ui-design-system.md
│   └── memoria-feat-home-random-quote.md
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── EmptyState.tsx
│   │       ├── QuoteCard.tsx
│   │       └── index.ts
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── AuthorsPage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── HomePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   ├── apiClient.ts
│   │   └── quotesService.ts
│   ├── styles/
│   │   ├── components.css
│   │   ├── global.css
│   │   ├── utilities.css
│   │   └── variables.css
│   ├── types/
│   │   ├── api.ts
│   │   └── quote.ts
│   └── main.tsx
├── .env.example
├── README.md
└── package.json
```

## Capas principales

| Capa | Responsabilidad |
| ---- | --------------- |
| `app` | Montaje de la aplicación y rutas |
| `pages` | Composición de pantallas |
| `components/layout` | Layout general, navegación y footer |
| `components/ui` | Componentes visuales reutilizables |
| `services` | Cliente HTTP y servicios por dominio |
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
| 3 | `feat/explore-quotes` | Pendiente | Explorador público con filtros |
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
