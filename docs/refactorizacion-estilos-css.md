# Refactorización — Estilos CSS por capas y features

Proyecto: **QuoteMatic-Web**  
Repositorio: `git@github.com:David-LS-Bilbao/QuoteMatic-Web.git`  
Rama: `feat/auth-session`  
Backend/API: <https://quotematic.davlos.es>

---

## 1. Contexto

Al añadir la feature de autenticación (`feat/auth-session`), los estilos de la aplicación habían crecido lo suficiente como para justificar una reorganización. Los archivos anteriores (`global.css`, `components.css`) mezclaban estilos de layout, componentes UI y features específicas en ficheros planos sin separación clara.

---

## 2. Objetivo

Reorganizar los archivos CSS en carpetas por responsabilidad para que cada capa (base, layout, UI, features) tenga su propio espacio y sea fácil de localizar y mantener.

---

## 3. Estructura anterior

```txt
src/styles/
├── components.css   ← estilos UI y features mezclados
├── global.css       ← reset, base y layout mezclados
├── utilities.css
└── variables.css
```

---

## 4. Estructura nueva

```txt
src/styles/
├── index.css              ← punto de entrada único con @import ordenados
├── variables.css          ← design tokens (sin cambios)
├── base.css               ← reset y estilos base (era global.css)
├── utilities.css          ← clases de utilidad (sin cambios)
├── layout.css             ← estilos de layout general y page-section
├── ui/
│   ├── index.css          ← agrega los archivos de UI en orden
│   ├── button.css
│   ├── badge.css
│   ├── quote-card.css
│   ├── empty-state.css
│   └── filter-control.css
└── features/
    ├── home.css
    ├── explore.css
    ├── auth.css
    ├── page-transition.css
    └── placeholders.css
```

---

## 5. Punto de entrada

`src/styles/index.css` es el único archivo que importa `src/main.tsx`. Agrega todo en orden de cascada:

```css
@import './variables.css';
@import './base.css';
@import './utilities.css';
@import './layout.css';
@import './ui/index.css';
@import './features/home.css';
@import './features/placeholders.css';
@import './features/explore.css';
@import './features/page-transition.css';
@import './features/auth.css';
```

---

## 6. Criterio de separación

| Carpeta/archivo | Qué contiene |
|---|---|
| `variables.css` | Design tokens: colores, espaciados, tipografía, bordes |
| `base.css` | Reset CSS, estilos de `body`, `html`, `*`, tipografía base |
| `utilities.css` | Clases de utilidad reutilizables (`eyebrow`, `page-lead`, etc.) |
| `layout.css` | `app-shell`, `app-main`, `page-section`, `site-header`, `site-footer` |
| `ui/*.css` | Un archivo por componente UI reutilizable |
| `features/*.css` | Estilos exclusivos de una pantalla o feature concreta |

---

## 7. QA

```bash
npm run lint   → sin errores
npm run build  → sin errores (26.39 kB CSS generado, igual que antes)
```

No se rompió ningún estilo. El CSS final generado en build es equivalente al anterior en tamaño y contenido.

---

## 8. Archivos afectados

Solo `src/styles/`. Ningún componente ni página fue modificado. Los imports de CSS en `main.tsx` se redujeron de múltiples líneas a uno solo:

```ts
import './styles/index.css'
```

---

## 9. Patrón de arquitectura CSS aplicado

La estructura implementada combina dos patrones reconocidos:

**ITCSS** (Inverted Triangle CSS, Harry Roberts) — organiza los estilos en capas de menor a mayor especificidad y alcance. El orden de imports en `index.css` sigue exactamente este triángulo invertido:

```txt
variables  → tokens globales (mínima especificidad, máximo alcance)
base       → reset y tipografía
utilities  → clases de utilidad reutilizables
layout     → estructura de página
ui         → componentes visuales
features   → estilos específicos de pantalla (máxima especificidad, mínimo alcance)
```

**Feature Folders** — cada pantalla o dominio agrupa sus propios estilos en una carpeta dedicada (`features/`), en lugar de mezclarlos en un archivo global.

La combinación de ambos se conoce informalmente como **ITCSS + Feature Folders**, y es el enfoque recomendado por proyectos como Cube CSS y la guía de estilos de Google para aplicaciones React medianas. Permite incorporarlo desde el inicio de cualquier proyecto con la regla: una capa por nivel de abstracción, una carpeta por feature, un `index.css` como barrel de imports para controlar el orden de cascada.

---

## 10. Relación con otros docs

Esta refactorización actualiza la arquitectura descrita en:

- `memoria-feat-ui-design-system.md` — que describía la estructura anterior (`global.css`, `components.css`)
- `README.md` — árbol de arquitectura actualizado para reflejar la nueva estructura



