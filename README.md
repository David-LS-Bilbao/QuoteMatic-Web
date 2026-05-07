# QuoteMatic Web

Frontend React independiente para consumir la API publica de QuoteMatic.

## Resumen

QuoteMatic Web es el cliente frontend moderno del proyecto QuoteMatic. La aplicacion se plantea como una SPA visual, responsive y orientada a portfolio, construida sobre React, Vite y TypeScript.

El backend ya existe y se mantiene como fuente unica de verdad. Este repositorio no rehace la API ni accede directamente a la base de datos: consume los endpoints publicos del backend desplegado.

## Estado actual

Proyecto en fase de bootstrap.

- Vite + React + TypeScript ya inicializado.
- ESLint configurado.
- `.env.example` creado con la URL base de la API.
- README corregido a partir de `docs/informe-previo.md`.
- La pantalla actual sigue siendo el scaffold inicial de Vite y esta pendiente de sustituirse por la interfaz QuoteMatic.

## Enlaces

- Backend/API: <https://quotematic.davlos.es>
- Swagger: <https://quotematic.davlos.es/api-docs/>
- Informe previo: [`docs/informe-previo.md`](docs/informe-previo.md)
- Repositorio frontend: `git@github.com:David-LS-Bilbao/QuoteMatic-Web.git`

## Stack actual

- React 19
- Vite
- TypeScript
- ESLint
- CSS
- Fetch API para futuras llamadas HTTP

## Objetivo del MVP

El MVP debe entregar una aplicacion publica, estable y responsive con:

- Landing page moderna.
- Explorador de frases.
- Frase aleatoria desde API.
- Filtros por situacion y tipo de frase.
- Listado de autores.
- Estados de carga, error y vacio.
- Diseno mobile-first.
- Documentacion clara para instalacion, evaluacion y despliegue.

## Fuera del MVP inicial

- Login.
- Favoritos.
- Panel de administracion en React.
- CRUD privado.
- JWT.
- Redux o Zustand.

Estas funcionalidades se dejan para una fase posterior porque el backend usa sesiones y cookies. En un frontend desplegado en otro dominio esto puede requerir ajustes de CORS, `credentials` y configuracion de cookies.

## Instalacion

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raiz del proyecto tomando como referencia `.env.example`:

```env
VITE_API_BASE_URL=https://quotematic.davlos.es
```

## Scripts disponibles

```bash
npm run dev
```

Arranca el servidor de desarrollo de Vite.

```bash
npm run build
```

Compila TypeScript y genera la build de produccion en `dist`.

```bash
npm run preview
```

Sirve localmente la build generada.

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

## Endpoints publicos previstos

```text
GET /api/quotes/random
GET /api/quotes
GET /api/authors
GET /api/situations
GET /api/quote-types
```

Base URL:

```text
https://quotematic.davlos.es
```

Antes de fijar los tipos TypeScript definitivos, se debe validar el JSON real de cada endpoint en Swagger.

## Rutas previstas

| Ruta | Pantalla | API principal |
| ---- | -------- | ------------- |
| `/` | Home | Situaciones opcional |
| `/explore` | Explorador de frases | `situations`, `quote-types`, `quotes/random` |
| `/authors` | Listado de autores | `authors` |
| `/authors/:id` | Detalle de autor | `authors`, `quotes` si el contrato lo permite |
| `/about` | Informacion tecnica | No requiere API |
| `*` | 404 | No requiere API |

## Arquitectura objetivo

```text
QuoteMatic-Web/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── docs/
│   └── informe-previo.md
├── src/
│   ├── app/
│   ├── pages/
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── styles/
│   ├── assets/
│   └── main.tsx
├── .env.example
├── README.md
└── package.json
```

## Capas recomendadas

| Capa | Responsabilidad |
| ---- | --------------- |
| `app` | Montaje de la aplicacion y rutas. |
| `pages` | Composicion de pantallas. |
| `components` | UI reutilizable: layout, cards, filtros y estados. |
| `services` | Cliente HTTP y servicios por dominio. |
| `types` | Contratos TypeScript de API. |
| `styles` | Variables, estilos globales y utilidades responsive. |

## Plan de sprints

| Sprint | Rama sugerida | Objetivo |
| ------ | ------------- | -------- |
| 0 | `feat/project-bootstrap` | Bootstrap Vite, TypeScript, estructura base y README. |
| 1 | `feat/landing-layout` | Layout, navegacion, home, about, footer y 404. |
| 2 | `feat/api-catalogs` | Cliente API, tipos y catalogos publicos. |
| 3 | `feat/explore-random-quote` | Filtros, frase aleatoria y QuoteCard. |
| 4 | `feat/authors-pages` | Listado y detalle de autores. |
| 5 | `feat/ui-polish-responsive` | Responsive, accesibilidad y acabado visual. |
| 6 | `chore/deploy-config` | Deploy en Vercel o Netlify. |

## Riesgos tecnicos

- Confirmar en Swagger el formato real de las respuestas.
- Validar CORS desde local y desde el futuro deploy.
- No bloquear el MVP con login o favoritos.
- Comprobar query params reales para `GET /api/quotes/random`.
- Mantener el estado simple con hooks hasta que exista una necesidad real de estado global.

## Checklist MVP

- [x] Inicializar Vite React TypeScript.
- [x] Crear `.env.example`.
- [x] Documentar el informe previo.
- [x] Corregir README inicial.
- [ ] Sustituir scaffold de Vite por layout QuoteMatic.
- [ ] Validar Swagger y respuestas reales de API.
- [ ] Crear estructura `app`, `pages`, `components`, `services`, `types` y `styles`.
- [ ] Configurar rutas publicas.
- [ ] Implementar cliente API.
- [ ] Cargar situaciones, tipos de frase y autores.
- [ ] Implementar explorador de frases.
- [ ] Implementar pagina de autores.
- [ ] Revisar responsive en movil, tablet y desktop.
- [ ] Ejecutar `npm run lint`.
- [ ] Ejecutar `npm run build`.
- [ ] Desplegar demo publica.

## Autor

David Lopez Sotelo
