<!--
Documento convertido desde Informe_Previo_QuoteMatic_React.docx para uso como memoria/contexto en VS Code/Codex.
-->

# Informe Previo QuoteMatic React

**Frontend React independiente para consumir la API QuoteMatic**

Plan maestro, alcance MVP, arquitectura, features, sprints, riesgos, deploy y QA

> **Decision principal**
> No se rehace el backend. QuoteMatic React sera un cliente frontend independiente, visual y responsive que consume primero la API publica del backend desplegado. Login y favoritos quedan como sprint posterior si las cookies cross-domain no bloquean el MVP.

| **Campo**                | **Detalle**                                                    |
|--------------------------|----------------------------------------------------------------|
| Autor                    | David Lopez Sotelo                                             |
| Repositorio frontend     | git@github.com:David-LS-Bilbao/QuoteMatic-Web.git              |
| Backend/API              | https://quotematic.davlos.es                                   |
| Swagger                  | https://quotematic.davlos.es/api-docs/                         |
| Stack frontend propuesto | React + Vite + TypeScript + React Router + CSS moderno + fetch |
| Fecha                    | 07/05/2026                                                     |
| Estado                   | Informe previo antes de implementacion                         |

## Índice

1. Resumen ejecutivo
2. Fuentes y restricciones de verificacion
3. Contexto del backend QuoteMatic
4. Vision de producto React
5. Alcance del MVP
6. Features del proyecto
7. Arquitectura frontend recomendada
8. Pantallas y rutas
9. Componentes y responsabilidades
10. Contrato API y endpoints necesarios
11. Estrategia de datos y estado
12. Estrategia visual y responsive
13. Plan de sprints
14. Riesgos tecnicos y mitigaciones
15. Estrategia Git
16. Estrategia de deploy
17. Documentacion y portfolio
18. Checklist global de validacion
19. Proximos pasos
20. Anexos

## 1. Resumen ejecutivo

**QuoteMatic React** sera el frontend moderno del proyecto QuoteMatic. Su objetivo es transformar un backend ya funcional, con API REST y datos de demo, en una experiencia web visual, responsive y atractiva para portfolio. El enfoque es MVP-first: primero se construye una SPA publica que consume frases, autores, situaciones y tipos de frase; despues se valoran login, favoritos y otras mejoras.

> **Resultado esperado del MVP**
> Una aplicacion React desplegada, con landing moderna, explorador de frases con filtros, card visual de frase aleatoria, pagina de autores, estados de carga/error/vacio, responsive mobile-first y README profesional.

| **Area**  | **Decision**                                          |
|-----------|-------------------------------------------------------|
| Producto  | Frontend independiente, no sustituto del backend.     |
| Prioridad | API publica + experiencia visual + entrega estable.   |
| Auth      | Pospuesta para sprint posterior por sesiones/cookies. |
| Backend   | No se modifica salvo bloqueo tecnico claro.           |
| Entrega   | Pequena, demostrable, documentada y desplegada.       |

## 2. Fuentes y restricciones de verificacion

Este informe se basa en los documentos adjuntos y en la informacion tecnica aportada para el proyecto: README del backend, memoria tecnica QuoteMatic, informe de mejora API para Mobile/React y documentacion del bootcamp.

- README adjunto de QuoteMatic: endpoints, stack, scripts, flujo Git y estado del MVP backend.

- Memoria tecnica QuoteMatic: arquitectura, modelo de datos, dataset, panel admin, Swagger y QA.

- Informe de mejora API QuoteMatic Mobile + React: estrategia para clientes externos, cookies, CORS y futuras features.

- Documento del bootcamp: encaje con el modulo React, TypeScript, Design Systems, deploy y documentacion.

> **Nota de verificacion honesta**
> Desde este entorno no se ha realizado navegacion en vivo sobre la URL desplegada ni sobre Swagger. Antes de implementar se debe abrir Swagger en navegador y comprobar el JSON real de cada endpoint. El plan queda preparado para esa validacion inicial.

## 3. Contexto del backend QuoteMatic

El backend QuoteMatic ya existe y queda como fuente unica de verdad. La aplicacion React no debe acceder a MongoDB ni duplicar logica de negocio; debe consumir la API REST del backend.

| **Elemento backend** | **Estado actual**                                                  |
|----------------------|--------------------------------------------------------------------|
| Stack                | Node.js, Express, TypeScript, MongoDB, Mongoose, EJS.              |
| Auth                 | Sesiones/cookies con express-session y connect-mongo. No usa JWT.  |
| Roles                | user y admin.                                                      |
| API publica          | Quotes, random quote, authors, situations, quote-types.            |
| API protegida        | Favoritos y endpoints admin.                                       |
| Admin                | Panel EJS para gestion de frases y autores.                        |
| Docs                 | Swagger/OpenAPI disponible en /api-docs.                           |
| Dataset              | Autores, situaciones, tipos de frase y frases de demo ya cargadas. |

### 3.1 Features backend que aprovechara React

- Frase aleatoria con posibilidad de filtros.

- Listado de frases publicas.

- Catalogo de autores.

- Catalogo de situaciones.

- Catalogo de tipos de frase.

- Datos reales de demo para evitar pantallas vacias.

- Swagger para validar contrato antes de implementar.

## 4. Vision de producto React

La version React debe sentirse como una app moderna de bienestar, motivacion y frases, no como una pantalla tecnica. El objetivo visual es superar el minifront EJS sin perder simplicidad.

| **Principio** | **Aplicacion**                                                         |
|---------------|------------------------------------------------------------------------|
| Mobile-first  | Diseñar primero para movil y escalar a tablet/escritorio.              |
| Visual        | Cards grandes, iconos, gradientes suaves y buen espaciado.             |
| Divertida     | Microcopys cercanos, estados visuales claros y filtros tipo mood.      |
| Simple        | Sin Redux, sin auth inicial, sin admin React.                          |
| Portfolio     | README, capturas, demo y decisiones tecnicas claras.                   |
| Aprendizaje   | Mostrar dominio de React, TypeScript, componentes, servicios y deploy. |

## 5. Alcance del MVP

### 5.1 Incluido en MVP

| **Feature**     | **Descripcion**                                               | **Prioridad** |
|-----------------|---------------------------------------------------------------|---------------|
| Landing page    | Home moderna con propuesta de valor y CTA a explorar.         | Must          |
| Explorar frases | Pantalla principal con filtros y frase aleatoria.             | Must          |
| Filtros         | Situacion y tipo de frase desde catalogos reales.             | Must          |
| Quote card      | Card grande con texto, autor y etiquetas.                     | Must          |
| Nueva frase     | Boton para pedir otra frase respetando filtros.               | Must          |
| Autores         | Listado visual de autores desde API.                          | Must          |
| Detalle autor   | Pantalla de detalle si el contrato API lo permite sin forzar. | Should        |
| Estados UI      | Loading, error y empty state reutilizables.                   | Must          |
| Responsive      | Mobile, tablet y desktop.                                     | Must          |
| README          | Instalacion, stack, endpoints, capturas, demo y limitaciones. | Must          |

### 5.2 Fuera del MVP inicial

| **Feature**   | **Motivo**                                                            | **Decision**               |
|---------------|-----------------------------------------------------------------------|----------------------------|
| Login         | El backend usa sesiones/cookies; puede requerir CORS con credentials. | Sprint posterior           |
| Favoritos     | Dependen de login y cookie activa.                                    | Sprint posterior           |
| CRUD privado  | Requiere mejora API no incluida en este frontend inicial.             | Futuro                     |
| Admin React   | Ya existe panel EJS suficiente.                                       | No incluir                 |
| JWT           | No coincide con backend actual.                                       | No incluir                 |
| Redux/Zustand | Estado inicial simple.                                                | No incluir salvo necesidad |

## 6. Features del proyecto

### 6.1 Feature set principal

| **Feature**          | **Contenido**                                                    | **Criterio de aceptacion**                             |
|----------------------|------------------------------------------------------------------|--------------------------------------------------------|
| F01 - Home / Landing | Presenta la app, CTA, situaciones destacadas y enlaces tecnicos. | Usuario entiende el producto en menos de 10 segundos.  |
| F02 - Catalogos      | Carga situations, quote-types y authors desde API.               | Los filtros y paginas usan datos reales.               |
| F03 - Explorador     | Permite pedir frases aleatorias con filtros.                     | Usuario obtiene frases adaptadas a su momento.         |
| F04 - Quote Card     | Componente visual central para texto, autor, tipo y situacion.   | La frase es legible, bonita y compartible visualmente. |
| F05 - Autores        | Listado y detalle de autores.                                    | El usuario explora el origen de las frases.            |
| F06 - Estados UX     | Loading/error/empty comunes.                                     | La app no se rompe ni queda en blanco.                 |
| F07 - Responsive UI  | Ajuste movil, tablet y desktop.                                  | Entrega presentable en cualquier dispositivo.          |
| F08 - Documentacion  | README completo y decisiones tecnicas.                           | El profesor puede clonar, ejecutar y evaluar.          |
| F09 - Deploy         | Publicacion en Vercel o Netlify.                                 | Demo online lista para portfolio.                      |

### 6.2 Features opcionales post-MVP

| **Feature**               | **Condicion para hacerla**                             | **Riesgo** |
|---------------------------|--------------------------------------------------------|------------|
| Compartir frase           | Si el MVP esta terminado; usar Web Share API/fallback. | Bajo       |
| Modo oscuro               | Si el sistema de estilos esta ordenado.                | Bajo/medio |
| Animaciones Framer Motion | Solo para polish, no para logica core.                 | Medio      |
| Login                     | Si CORS/cookies funcionan en local y deploy.           | Alto       |
| Favoritos                 | Despues de login estable.                              | Alto       |

## 7. Arquitectura frontend recomendada

> **Decision de arquitectura**
> Arquitectura por capas ligera: pages para pantallas, components para piezas UI, services para llamadas API, types para contratos TypeScript y styles para sistema visual. No se introduce arquitectura enterprise.

```text
QuoteMatic-Web/
├── public/
│ └── images/
├── src/
│ ├── app/ # App y router
│ ├── pages/ # Home, Explore, Authors, About, 404
│ ├── components/ # layout, quote, filters, author, ui
│ ├── services/ # apiClient y servicios por dominio
│ ├── types/ # contratos TypeScript
│ ├── styles/ # variables, global, utilities
│ └── main.tsx
├── .env.example
├── README.md
└── package.json
```

| **Capa**   | **Responsabilidad**                            | **Regla**                                              |
|------------|------------------------------------------------|--------------------------------------------------------|
| app        | Montaje de la aplicacion y rutas.              | No meter logica de negocio.                            |
| pages      | Composicion de pantallas.                      | Pueden usar hooks/servicios, pero no crecer demasiado. |
| components | UI reutilizable.                               | Props claras y componentes pequenos.                   |
| services   | HTTP y adaptacion de respuestas API.           | Unico lugar para fetch.                                |
| types      | Tipos de Quote, Author, Situation y QuoteType. | Tipado pragmático basado en JSON real.                 |
| styles     | Variables, base responsive y utilidades.       | Consistencia visual.                                   |

## 8. Pantallas y rutas

| **Ruta React** | **Pantalla**     | **Descripcion**                           | **API**                                |
|----------------|------------------|-------------------------------------------|----------------------------------------|
| /              | HomePage         | Landing moderna con CTA.                  | Situations opcional                    |
| /explore       | ExplorePage      | Explorador con filtros y frase aleatoria. | situations, quote-types, quotes/random |
| /authors       | AuthorsPage      | Grid/listado de autores.                  | authors                                |
| /authors/:id   | AuthorDetailPage | Detalle de autor y frases si viable.      | authors + quotes                       |
| /about         | AboutPage        | Descripcion tecnica y enlaces.            | No necesaria                           |
| `*`            | NotFoundPage     | 404 amigable.                             | No necesaria                           |

### 8.1 Flujo principal de usuario

```text
Home
↓ CTA
Explorar frases
↓ cargar catalogos
Elegir situacion + tipo
↓ GET /api/quotes/random
Ver quote card
↓ Nueva frase
Repetir con mismos filtros
```

## 9. Componentes y responsabilidades

| **Componente** | **Responsabilidad**                             | **Sprint** |
|----------------|-------------------------------------------------|------------|
| AppLayout      | Estructura general, header, main y footer.      | 1          |
| Navbar         | Navegacion responsive.                          | 1          |
| Footer         | Enlaces a GitHub, backend, Swagger y portfolio. | 1          |
| HeroSection    | Bloque principal de landing.                    | 1          |
| SituationCard  | Card visual para cada situacion/mood.           | 1-2        |
| QuoteFilters   | Agrupa filtros de situacion y tipo.             | 3          |
| FilterChip     | Boton reutilizable para filtros.                | 3          |
| QuoteCard      | Card principal de frase.                        | 3          |
| AuthorCard     | Card de autor.                                  | 4          |
| LoadingState   | Estado cargando reutilizable.                   | 2          |
| ErrorState     | Error visual con opcion de reintentar.          | 2          |
| EmptyState     | Sin datos/sin resultados.                       | 2          |
| Button         | Boton base accesible.                           | 1          |
| Badge          | Etiquetas de tipo/situacion.                    | 3          |

## 10. Contrato API y endpoints necesarios

Para el MVP se consumen solo endpoints publicos. Esto evita depender de cookies de sesion y reduce el riesgo de bloqueo en entrega.

| **Endpoint**           | **Uso en React**                            | **Prioridad** | **Riesgo**                     |
|------------------------|---------------------------------------------|---------------|--------------------------------|
| GET /api/quotes/random | Obtener frase aleatoria con filtros.        | Must          | Comprobar query params reales. |
| GET /api/quotes        | Listado general y posible filtro por autor. | Should        | Puede necesitar adaptador.     |
| GET /api/authors       | Pagina de autores.                          | Must          | Bajo.                          |
| GET /api/situations    | Filtros por situacion.                      | Must          | Bajo.                          |
| GET /api/quote-types   | Filtros por tipo.                           | Must          | Bajo.                          |

### 10.1 Endpoints protegidos pospuestos

| **Endpoint**                   | **Feature futura** | **Condicion**                              |
|--------------------------------|--------------------|--------------------------------------------|
| GET /auth/me                   | Mantener sesion.   | Validar cookies cross-domain.              |
| POST /auth/login               | Login.             | CORS credentials + cookie secure/sameSite. |
| POST /auth/logout              | Logout.            | Sesion estable.                            |
| GET /api/favorites/me          | Favoritos.         | Login funcionando.                         |
| POST /api/favorites/:quoteId   | Guardar favorito.  | Login funcionando.                         |
| DELETE /api/favorites/:quoteId | Quitar favorito.   | Login funcionando.                         |

> **Regla de integracion**
> Antes de tipar definitivamente, abrir Swagger y copiar respuestas reales de cada endpoint. El tipado TypeScript debe ajustarse al JSON real, no a suposiciones.

## 11. Estrategia de datos y estado

| **Necesidad**  | **Solucion MVP**                              | **Motivo**             |
|----------------|-----------------------------------------------|------------------------|
| Estado global  | No usar Redux/Zustand.                        | La app es pequena.     |
| Filtros        | useState local en ExplorePage.                | Simple y suficiente.   |
| Carga API      | useEffect + servicios o custom hooks simples. | Claro para bootcamp.   |
| Errores        | try/catch en service + estado error en UI.    | Evita pantallas rotas. |
| Tipos          | Interfaces TypeScript en src/types.           | Contrato explicito.    |
| Adaptacion API | apiClient normaliza base URL y errores.       | Centraliza cambios.    |

### 11.1 Tipos conceptuales minimos

- Quote: id, text, author, situation, quoteType, language, contentRating y metadatos opcionales.

- Author: id, name, authorType, sourceWork/sourceType opcional, isActive opcional.

- Situation: id, name, slug, description opcional.

- QuoteType: id, name, slug, description opcional, contentRating opcional.

- ApiResponse<T>: success, data, message y errors opcionales si la API devuelve ese formato.

## 12. Estrategia visual y responsive

| **Decision visual** | **Aplicacion concreta**                                                         |
|---------------------|---------------------------------------------------------------------------------|
| Estetica            | Bienestar, motivacion, frases, mood, cards grandes.                             |
| Paleta              | Violeta/azul como primario, coral como acento, menta como apoyo, fondos suaves. |
| Tipografia          | Sans clara, jerarquia fuerte para frases.                                       |
| Iconos              | Lucide React para mood/situaciones.                                             |
| Ilustraciones       | Opcionales; primero iconos + gradientes.                                        |
| Animaciones         | CSS transitions inicialmente; Framer Motion solo si sobra tiempo.               |
| Accesibilidad       | Contraste suficiente, focus visible, botones con texto claro.                   |

### 12.1 Breakpoints recomendados

| **Tamano**   | **Objetivo de QA**                                        |
|--------------|-----------------------------------------------------------|
| 360-390 px   | Movil pequeno: navbar, quote card y filtros sin overflow. |
| 768 px       | Tablet: grid de cards en 2 columnas si procede.           |
| 1024-1440 px | Desktop: hero y contenido centrados con ancho maximo.     |

## 13. Plan de sprints

| **Sprint**                | **Rama**                  | **Contenido**                                                    | **Cierre**                                               |
|---------------------------|---------------------------|------------------------------------------------------------------|----------------------------------------------------------|
| Sprint 0 - Bootstrap      | feat/project-bootstrap    | Vite React TS, router, estructura, estilos base, README inicial. | npm run dev y npm run build OK.                          |
| Sprint 1 - Landing/Layout | feat/landing-layout       | Layout, navbar, home, about, footer.                             | Rutas publicas y responsive base.                        |
| Sprint 2 - API/Catalogos  | feat/api-catalogs         | apiClient, servicios, tipos y carga de catalogos.                | Situations, quote-types y authors cargan con estados UX. |
| Sprint 3 - Explorar       | feat/explore-random-quote | Filtros + random quote + QuoteCard.                              | Usuario obtiene frases con filtros sin errores.          |
| Sprint 4 - Autores        | feat/authors-pages        | Listado y detalle de autores.                                    | Autores visibles y detalle robusto.                      |
| Sprint 5 - Polish         | feat/ui-polish-responsive | Responsive, microinteracciones, accesibilidad basica, README.    | App lista para portfolio.                                |
| Sprint 6 - Deploy         | chore/deploy-config       | Vercel/Netlify, env vars y validacion produccion.                | Demo publica funcionando.                                |
| Sprint 7 - Opcional Auth  | feat/auth-favorites       | Login y favoritos si cookies funcionan.                          | No bloquea MVP si falla.                                 |

### 13.1 Checklist por sprint

| **Sprint** | **Checklist minimo**                                                      |
|------------|---------------------------------------------------------------------------|
| 0          | Repo clonado, dev creada, Vite TS funcionando, build OK, README inicial.  |
| 1          | Home, About, Navbar, Footer, 404, responsive base, build OK.              |
| 2          | Servicios API centralizados, tipos, loading/error, catalogos reales.      |
| 3          | Filtros, random quote, boton nueva frase, QuoteCard, empty/error/loading. |
| 4          | Autores, detalle, busqueda opcional, comportamiento robusto sin datos.    |
| 5          | Mobile-first revisado, accesibilidad, estilos finales, capturas README.   |
| 6          | Deploy publico, variables correctas, enlaces en README.                   |
| 7          | Solo si aplica: login con credentials include y favoritos.                |

## 14. Riesgos tecnicos y mitigaciones

| **Riesgo**                                                | **Impacto** | **Mitigacion**                                                                     |
|-----------------------------------------------------------|-------------|------------------------------------------------------------------------------------|
| No poder validar Swagger en vivo desde el entorno actual. | Medio       | Validar manualmente en navegador antes de implementar servicios.                   |
| CORS en deploy frontend.                                  | Alto        | Probar endpoints publicos pronto desde local y desde deploy.                       |
| Cookies/sesiones cross-domain.                            | Alto        | No incluir login/favoritos en MVP; sprint posterior.                               |
| Formato de respuesta API distinto al esperado.            | Medio       | Crear apiClient/adaptador y tipar tras ver JSON real.                              |
| Filtros random no documentados como se espera.            | Medio       | Probar query params con Swagger antes de UI final.                                 |
| Sobrediseño con muchas librerias.                         | Medio       | CSS moderno + React Router + fetch; Framer opcional.                               |
| Quedarse sin tiempo.                                      | Alto        | Cerrar primero Home + Explore + Authors + README + deploy.                         |
| Detalle autor no viable por API.                          | Bajo        | Mostrar detalle sin frases o filtrar localmente desde /api/quotes si es razonable. |

## 15. Estrategia Git

```text
main -> estable / release
dev -> integracion
feat/* -> desarrollo por feature
chore/* -> configuracion/deploy
docs/* -> documentacion
```

### 15.1 Flujo seguro

1. Crear dev desde main y proteger main/dev si es posible.

2. Crear rama feat/* desde dev para cada sprint.

3. Hacer commits pequenos y descriptivos.

4. Abrir PR de feature hacia dev.

5. Validar checklist antes de merge.

6. Crear PR dev hacia main solo cuando haya release estable.

7. Si algo falla, revertir PR o commit concreto, no arreglar directamente en main.

### 15.2 Convencion de commits

```text
chore: bootstrap vite react typescript app
feat(layout): add base app layout and routing
feat(api): add QuoteMatic public api client
feat(quotes): add random quote explorer
feat(authors): add authors pages
docs: add project README
chore: add deploy configuration
```

## 16. Estrategia de deploy

La opcion recomendada para el MVP es Vercel. Netlify tambien es valida. El objetivo es tener una demo publica facil de enlazar en README, portfolio y presentacion.

| **Aspecto**      | **Decision recomendada**                                |
|------------------|---------------------------------------------------------|
| Proveedor        | Vercel para Vite/React.                                 |
| Build command    | npm run build                                           |
| Output directory | dist                                                    |
| Variable         | VITE_API_BASE_URL=https://quotematic.davlos.es          |
| Dominio          | Inicialmente subdominio gratuito de Vercel/Netlify.     |
| Validacion       | Abrir app desplegada y comprobar llamadas reales a API. |

> **Criterio de release**
> No se considera terminado hasta que el deploy publico cargue datos reales del backend y el README enlace correctamente demo, backend y Swagger.

## 17. Documentacion y portfolio

| **Documento/archivo** | **Contenido esperado**                                                                                       |
|-----------------------|--------------------------------------------------------------------------------------------------------------|
| README.md             | Descripcion, stack, instalacion, env vars, scripts, endpoints, demo, capturas, decisiones y mejoras futuras. |
| .env.example          | VITE_API_BASE_URL sin secretos.                                                                              |
| docs/ opcional        | Capturas, notas de sprints, decisiones tecnicas.                                                             |
| PR descriptions       | Resumen, checklist, capturas y pruebas realizadas.                                                           |
| Presentacion futura   | Problema, solucion, arquitectura, demo, aprendizaje y mejoras.                                               |

### 17.1 Decisiones tecnicas que conviene documentar

- Se mantiene QuoteMatic backend como API y fuente unica de verdad.

- React se limita inicialmente a API publica para evitar bloqueo por cookies.

- Se usa TypeScript para contratos y seguridad de componentes.

- Se usa CSS moderno para demostrar criterio visual sin sobrecargar stack.

- Se prioriza MVP desplegable antes de auth/favoritos.

## 18. Checklist global de validacion

| **Bloque**    | **Validacion**                                                  |
|---------------|-----------------------------------------------------------------|
| Repo          | main y dev existen; features por ramas feat/*; PRs hacia dev.  |
| Setup         | npm install, npm run dev y npm run build funcionan.             |
| API           | Endpoints publicos responden desde local y deploy.              |
| Home          | Landing clara, CTA visible y responsive.                        |
| Explore       | Filtros cargan, nueva frase funciona, QuoteCard renderiza bien. |
| Autores       | Listado y detalle no rompen aunque falten campos.               |
| Estados       | Loading, error y empty state visibles.                          |
| Responsive    | Movil 375px, tablet y desktop revisados.                        |
| Accesibilidad | Contraste, foco visible, textos alternativos si hay imagenes.   |
| Consola       | Sin errores JS en navegador.                                    |
| README        | Completo y con enlaces a demo/backend/Swagger.                  |
| Deploy        | Produccion carga datos reales.                                  |

## 19. Proximos pasos

1. Validar manualmente Swagger y copiar ejemplos reales de respuesta JSON de los endpoints publicos.

2. Crear rama dev y rama feat/project-bootstrap desde el repo QuoteMatic-Web.

3. Inicializar Vite React TypeScript y comprobar build.

4. Crear estructura de carpetas y rutas base.

5. Cerrar PR del bootstrap hacia dev.

6. Continuar con Sprint 1: layout y landing.

> **Regla de trabajo desde ahora**
> A partir de este informe, el desarrollo se hara paso a paso. No se generara codigo ni prompts largos salvo peticion explicita. Cada sprint se cerrara con checklist y flujo Git seguro.

## 20. Anexos

### Anexo A - Endpoints publicos del MVP

```text
GET https://quotematic.davlos.es/api/quotes/random
GET https://quotematic.davlos.es/api/quotes
GET https://quotematic.davlos.es/api/authors
GET https://quotematic.davlos.es/api/situations
GET https://quotematic.davlos.es/api/quote-types
```

### Anexo B - Variables de entorno frontend

```env
VITE_API_BASE_URL=https://quotematic.davlos.es
```

### Anexo C - Glosario breve

| **Termino**      | **Significado en este proyecto**                                 |
|------------------|------------------------------------------------------------------|
| SPA              | Single Page Application creada con React.                        |
| API publica      | Endpoints que no requieren login ni cookies.                     |
| Catalogos        | Situations, quote-types y authors usados para filtros.           |
| QuoteCard        | Componente visual principal para mostrar una frase.              |
| MVP              | Version minima entregable y demostrable.                         |
| CORS             | Configuracion que permite o bloquea llamadas desde otro dominio. |
| Cookie de sesion | Mecanismo actual del backend para auth; no JWT.                  |

### Anexo D - Fuentes consultadas

- README adjunto de QuoteMatic.

- Memoria Tecnica QuoteMatic adjunta.

- Informe_Mejora_API_QuoteMatic_Mobile_React adjunto.

- Documento del bootcamp Desarrollo Web Full Stack BBK/Lanbide.

- Plan de uso de IA como copiloto Bootcamp Full Stack Lanbide 2026.
