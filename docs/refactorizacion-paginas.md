# Refactorización de páginas: extracción de lógica y componentes

## Qué se hizo

Se refactorizaron `HomePage` y `ExplorePage` siguiendo un mismo patrón: separar la lógica de estado de la presentación, y dividir el JSX en componentes cohesivos por bloque visual.

### HomePage (antes → después)

| Antes | Después |
|---|---|
| 148 líneas, todo en un archivo | 11 líneas en la página |
| `featureCards` definido inline | Extraído a `homeContent.ts` |
| `useRandomQuote` consumido en la página | Encapsulado en `HomeQuoteSpotlight` |

Archivos creados:

```
src/components/home/
  homeContent.ts          — datos estáticos (featureCards)
  HomeQuoteSpotlight.tsx  — hero + quote card + hook
  HomeFeatureGrid.tsx     — grilla de 3 tarjetas
  HomeInfoPanel.tsx       — aside estático
```

### ExplorePage (antes → después)

| Antes | Después |
|---|---|
| 537 líneas, todo en un archivo | 49 líneas en la página |
| 3 funciones puras mezcladas con estado | Extraídas a `quoteHelpers.ts` |
| 10 useState + 3 useEffect + 5 handlers inline | Extraídos a `useExploreQuotes` |

Archivos creados:

```
src/utils/
  quoteHelpers.ts             — getAuthorName, getCategoryName, buildQuoteMeta

src/hooks/
  useExploreQuotes.ts         — todo el estado, efectos y handlers

src/components/explore/
  ExploreHeader.tsx           — cabecera estática
  ExploreFilters.tsx          — formulario de filtros
  ExploreSummary.tsx          — barra de resultados + error catálogo
  ExploreResults.tsx          — estados de carga, vacío y resultados
```

---

## El paradigma aplicado

Cada página sigue tres capas:

```
Página (orquestador)
  └── Hook personalizado (lógica y estado)
  └── Componentes (presentación por bloque visual)
        └── Utils (funciones puras sin dependencia de React)
```

La página no contiene lógica. El hook no contiene JSX. Los componentes no contienen efectos ni llamadas a servicios.

---

## Ventajas

**Legibilidad**
La página describe *qué* se muestra, no *cómo* funciona. Leer `ExplorePage` da una visión completa del layout en 49 líneas.

**Testabilidad**
El hook puede testearse de forma aislada con `renderHook`. Las funciones de `quoteHelpers.ts` son puras: un input, un output, sin mocks. Los componentes solo necesitan sus props para renderizar.

**Mantenibilidad**
Un cambio en los filtros toca `useExploreQuotes` y `ExploreFilters`, sin rozar resultados ni cabecera. Los bloques no se mezclan.

**Reutilización**
`getAuthorName` y `buildQuoteMeta` ya están disponibles para cualquier componente futuro que renderice frases. `useRandomQuote` estaba ya desacoplado; `useExploreQuotes` sigue el mismo contrato.

---

## Inconvenientes

**Prop drilling explícito**
`ExploreFilters` recibe 14 props. Es verboso en la página aunque tipado estrictamente con `Pick<UseExploreQuotesResult, ...>`. Alternativa posible: Context, pero añade complejidad innecesaria para el tamaño actual.

**Más archivos para rastrear**
Un cambio de comportamiento puede implicar tocar hook + componente + página. El directorio `explore/` tiene 4 archivos donde antes había 1.

**Colocación no perfecta del hook**
`useExploreQuotes` vive en `src/hooks/` junto a `useRandomQuote`. Si el proyecto crece, puede tener sentido colocar hooks específicos de feature junto a sus componentes (`src/components/explore/useExploreQuotes.ts`).

---

## Cómo aplicar este patrón al resto de la app

### Criterio para extraer un hook

Extrae un hook cuando una página tenga:
- Más de 3 `useState` relacionados entre sí, o
- Algún `useEffect` que llame a un servicio externo, o
- Handlers que modifican varios estados a la vez.

Si una página solo tiene 1-2 estados simples, no hay ganancia en extraer.

### Criterio para extraer un componente

Extrae un componente cuando un bloque de JSX:
- Tiene una responsabilidad visual clara y un nombre obvio, o
- Se repite en más de un lugar, o
- Supera ~40 líneas de JSX propio.

No extraigas si el bloque comparte demasiado estado con el resto de la página y necesitaría muchas props para funcionar de forma independiente.

### Criterio para extraer a utils

Extrae a `src/utils/` cuando una función:
- No importa nada de React (ni hooks, ni JSX),
- Recibe datos y devuelve datos,
- Podría existir en cualquier proyecto JavaScript.

### Plantilla para una nueva página

```
src/
  pages/
    NuevaPagina.tsx               — solo JSX + useNuevaPagina()

  hooks/
    useNuevaPagina.ts             — estado, efectos, handlers, memos
                                    exporta UseNuevaPaginaResult

  components/nueva-pagina/
    NuevaPaginaHeader.tsx         — cabecera o hero
    NuevaPaginaContent.tsx        — bloque principal
    NuevaPaginaActions.tsx        — acciones o sidebar

  utils/
    nuevaPaginaHelpers.ts         — funciones puras si las hay
```

### Convenciones que se siguieron

- El hook exporta un tipo `UseXxxResult` para tipar los props de los componentes hijos.
- Los componentes usan `Pick<UseXxxResult, ...>` en sus props para declarar solo lo que necesitan.
- Los datos estáticos (arrays de contenido, configuración) van en archivos `content.ts` o `helpers.ts`, nunca en el componente.
- Un componente de página no importa servicios directamente; siempre pasa por el hook.
