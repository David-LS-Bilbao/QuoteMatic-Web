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

---

## Patrón de transición suave entre estados de contenido

Tanto `HomeQuoteSpotlight` como `ExploreResults` implementan una transición visual (fade-out + desplazamiento + blur) cuando el contenido cambia. El patrón es idéntico en ambos casos.

### Cómo funciona

El efecto requiere tres piezas coordinadas:

**1. CSS — dos clases que definen el estado normal y el estado "saliendo"**

```css
.mi-transicion {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
  transition: opacity var(--transition-normal), transform var(--transition-normal), filter var(--transition-normal);
}

.mi-transicion-active {
  opacity: 0.4;
  transform: translateY(6px) scale(0.99);
  filter: blur(1.5px);
}
```

**2. Hook — un delay artificial entre "datos recibidos" y "estado actualizado"**

```ts
const TRANSITION_DELAY_MS = 180
const transitionTimeoutRef = useRef<number | null>(null)

// Al inicio del useEffect, captura si hay contenido visible
const shouldTransition = hasVisibleContentRef.current

function finish(apply: () => void) {
  if (shouldTransition) {
    transitionTimeoutRef.current = window.setTimeout(() => {
      if (!isMounted) return
      apply()           // actualiza el contenido
      setIsTransitioning(false) // elimina la clase active → fade-in
      transitionTimeoutRef.current = null
    }, TRANSITION_DELAY_MS)
  } else {
    apply()
    setIsTransitioning(false)
  }
}

// Limpieza obligatoria en el return del efecto
return () => {
  isMounted = false
  if (transitionTimeoutRef.current !== null) {
    window.clearTimeout(transitionTimeoutRef.current)
    transitionTimeoutRef.current = null
  }
}
```

El delay garantiza que el CSS tenga tiempo de completar el fade-out antes de que el nuevo contenido aparezca. Sin él, React actualizaría el contenido y la clase en el mismo ciclo y la animación sería imperceptible.

**3. Componente — aplica la clase condicionalmente**

```tsx
<div className={isTransitioning ? 'mi-transicion mi-transicion-active' : 'mi-transicion'}>
  {contenido}
</div>
```

### Flujo completo

```
Usuario dispara acción
  → isTransitioning = true   → CSS añade clase active → fade-out inicia
  → fetch a la API
  → respuesta llega
  → espera TRANSITION_DELAY_MS (180ms)   ← ventana donde el fade-out se completa
  → contenido actualizado + isTransitioning = false → CSS elimina clase active → fade-in inicia
```

La primera carga nunca activa la transición (no hay contenido previo que "salir"). El ref `hasVisibleContentRef` actúa como guardia: solo vale `true` cuando hay contenido visible en pantalla.

### Archivos donde está implementado

| Página | Hook | Componente | Estado | Clases CSS |
|---|---|---|---|---|
| HomePage | `useRandomQuote` | `HomeQuoteSpotlight` | `isQuoteTransitioning` | `.home-quote-transition[-active]` |
| ExplorePage | `useExploreQuotes` | `ExploreResults` | `isResultsTransitioning` | `.explore-result-transition[-active]` |

### Consideraciones

- Incluir siempre `@media (prefers-reduced-motion: reduce)` que elimine `transform`, `filter` y `transition`, y fije `opacity: 1` en el estado active.
- El timeout debe limpiarse en el `return` del `useEffect` para evitar updates en componentes desmontados o efectos re-ejecutados.
- `TRANSITION_DELAY_MS` debe ser igual o ligeramente mayor que la duración de la transición CSS definida en `--transition-normal`.
