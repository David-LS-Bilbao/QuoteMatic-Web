# Memoria técnica — Sprint `feat/home-random-quote`

Proyecto: **QuoteMatic-Web**  
Repositorio: `git@github.com:David-LS-Bilbao/QuoteMatic-Web.git`  
Rama de trabajo: `feat/home-random-quote`  
Rama base: `dev`  
Backend/API: <https://quotematic.davlos.es>  
Swagger: <https://quotematic.davlos.es/api-docs/>

---

## 1. Contexto

Después de completar la rama `feat/ui-design-system`, QuoteMatic-Web ya contaba con una base visual sólida basada en el estilo **Cosmos**.

La Home era una landing estática con una frase temporal de demostración. El objetivo de este sprint fue convertir esa Home visual en una pantalla conectada a datos reales de la API pública de QuoteMatic.

Este sprint representa el primer hito funcional real del frontend React.

---

## 2. Objetivo de la rama

Conectar la Home de QuoteMatic-Web con el endpoint público:

```http
GET /api/quotes/random
```

La funcionalidad debía mantener el diseño Cosmos existente y añadir:

- consumo real de API;
- estado de carga;
- estado de error;
- estado de éxito;
- botón para cargar una nueva frase;
- tipos TypeScript mínimos para API y frases;
- servicio HTTP reutilizable.

---

## 3. Alcance

### Incluido

- Cliente API base con `fetch`.
- Servicio público de frases.
- Tipos TypeScript para respuestas API.
- Tipos TypeScript para `Quote`.
- Integración de `HomePage` con `getRandomQuote()`.
- Uso de `useState`.
- Uso de `useEffect`.
- Botón “Nueva frase”.
- Mensajes visuales para loading/error.
- Mantenimiento del diseño Cosmos.

### Fuera de alcance

- Explorador público completo.
- Filtros por situación o tipo.
- Búsqueda.
- Paginación.
- Login/registro.
- Favoritos.
- CRUD privado de frases.
- Estado global.
- Redux/Zustand.
- Cambios en backend.

---

## 4. Archivos modificados/creados

```txt
src/types/api.ts
src/types/quote.ts
src/services/apiClient.ts
src/services/quotesService.ts
src/pages/HomePage.tsx
```

---

## 5. Implementación técnica

### 5.1. Tipos API

Se creó `src/types/api.ts` para definir respuestas genéricas de la API:

```txt
ApiSuccessResponse<T>
ApiPaginatedResponse<T>
ApiErrorResponse
```

Esto permite tipar servicios de forma simple y reutilizable.

---

### 5.2. Tipos de frase

Se creó `src/types/quote.ts` con:

```txt
Quote
QuoteFilters
```

`Quote` representa una frase pública recibida desde la API.

`QuoteFilters` queda preparado para futuras pantallas como Explore, filtros y paginación.

---

### 5.3. Cliente API

Se creó `src/services/apiClient.ts`.

Responsabilidades:

- Definir `API_BASE_URL` desde `VITE_API_BASE_URL`.
- Construir URLs con query params.
- Enviar `credentials: 'include'` por defecto.
- Serializar body JSON cuando corresponde.
- Parsear respuestas.
- Lanzar errores controlados mediante `ApiError`.

Aunque la Home usa un endpoint público, se dejó `credentials: 'include'` como comportamiento base porque el backend de QuoteMatic usa cookies de sesión en los endpoints autenticados.

---

### 5.4. Servicio de frases

Se creó `src/services/quotesService.ts`.

Funciones añadidas:

```txt
getRandomQuote()
getQuotes()
getQuoteById()
```

En este sprint solo se usa `getRandomQuote()`, pero el servicio queda preparado para el siguiente sprint de explorador público.

---

### 5.5. Home conectada a API

`HomePage.tsx` pasó de mostrar una frase mock a cargar una frase real.

Estados añadidos:

```txt
quote
isLoading
errorMessage
```

Flujo:

```txt
1. Al montar la Home, useEffect llama a getRandomQuote().
2. Mientras carga, se muestra una QuoteCard de carga.
3. Si la API responde correctamente, se muestra la frase real.
4. Si hay error, se muestra un mensaje controlado.
5. El botón “Nueva frase” vuelve a solicitar otra frase aleatoria.
```

---

## 6. Hooks usados

### useState

Usado para gestionar:

- frase actual;
- estado de carga;
- mensaje de error.

### useEffect

Usado para cargar la frase inicial al montar la Home.

Durante la implementación apareció una regla estricta de ESLint:

```txt
react-hooks/set-state-in-effect
```

Se resolvió evitando llamar directamente dentro del efecto a una función que ejecutaba `setState` de forma síncrona al inicio. La carga inicial quedó separada de la acción manual del botón.

---

## 7. Estados de UI

### Loading

Mensaje temporal:

```txt
Buscando una frase en el universo QuoteMatic...
```

Meta:

```txt
Conectando con la API real
```

### Error

Mensaje controlado:

```txt
No hemos podido cargar una frase real ahora mismo. Inténtalo de nuevo.
```

### Success

Muestra:

- texto de la frase;
- autor si está disponible;
- meta `Frase real desde la API`.

### Empty fallback

Si no llega frase válida:

```txt
No hay frase disponible en este momento.
```

---

## 8. Decisiones técnicas

### Mantener `fetch`

No se introdujo Axios ni otra librería HTTP para no sobrediseñar el MVP.

### Mantener servicios simples

Se separó la lógica de API en `services`, evitando mezclar `fetch` directamente dentro de componentes.

### Mantener diseño Cosmos

La integración funcional no cambió el diseño visual base. Se reutilizó `QuoteCard`.

### Preparar futuras features

Aunque este sprint solo conecta la Home, `quotesService.ts` ya deja preparadas funciones para listado y detalle de frases.

---

## 9. Problemas encontrados

### Rama API previa no mergeada

La rama previa de API client no estaba integrada en `dev`, por lo que fue necesario añadir la capa mínima de API en esta rama.

### Error de resolución TypeScript

Apareció un error temporal indicando que no se encontraba `quotesService`. Finalmente era un problema del servidor de TypeScript en VS Code y se resolvió reiniciándolo.

### `package-lock.json` modificado sin dependencias

Apareció un cambio automático en `package-lock.json` causado por regeneración local del lockfile. Se descartó porque no se habían añadido dependencias.

---

## 10. QA ejecutado

Comandos recomendados/ejecutados:

```bash
npm run lint
npm run build
npm run dev
```

Comprobaciones manuales:

```txt
- La Home carga sin romper el diseño.
- Se muestra una frase real desde la API.
- El botón “Nueva frase” vuelve a consultar la API.
- No hay errores de TypeScript.
- No hay errores de ESLint.
- No se modifica el backend.
```

---

## 11. Resultado

La Home de QuoteMatic-Web ya no es solo una landing visual estática.

Ahora cumple el primer flujo funcional real:

```txt
React Home → quotesService → apiClient → QuoteMatic API → QuoteCard
```

Esto aporta al proyecto:

- consumo real de API;
- uso práctico de hooks;
- separación UI/API;
- base para futuras pantallas;
- evidencia clara para el proyecto individual de React.

---

## 12. Relación con requisitos del bootcamp

| Requisito | Estado |
| --------- | ------ |
| Uso de API | Cumplido |
| `useState` | Cumplido |
| `useEffect` | Cumplido |
| Mínimo 5 componentes | Cumplido por la base visual |
| `localStorage` | Pendiente |
| Responsive | Base visual implementada |
| TypeScript | Cumplido |

---

## 13. Próximos pasos

Siguiente rama recomendada:

```txt
feat/explore-quotes
```

Objetivo:

- listado de frases públicas;
- filtros por situación;
- filtros por tipo de frase;
- búsqueda;
- paginación;
- uso de `localStorage` para recordar filtros.

Después:

```txt
feat/auth-session
feat/favorites
feat/my-private-quotes
feat/share-quote
```

---

## 14. Resumen para portfolio

QuoteMatic-Web integra una Home moderna en React + TypeScript con diseño Cosmos y consumo real de una API REST propia. La pantalla carga una frase aleatoria desde el backend desplegado, gestiona estados de carga y error, y mantiene una arquitectura limpia separando componentes visuales, servicios HTTP y tipos TypeScript.
