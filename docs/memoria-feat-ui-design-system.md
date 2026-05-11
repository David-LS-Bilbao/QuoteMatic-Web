# Memoria técnica — Sprint `feat/ui-design-system`

Proyecto: **QuoteMatic-Web**  
Repositorio: `git@github.com:David-LS-Bilbao/QuoteMatic-Web.git`  
Rama de trabajo: `feat/ui-design-system`  
Rama base: `dev`  
Backend/API: <https://quotematic.davlos.es>  
Swagger: <https://quotematic.davlos.es/api-docs/>

---

## 1. Contexto del sprint

QuoteMatic-Web es un frontend React independiente creado para consumir la API REST del proyecto QuoteMatic.

Este sprint se centra en construir la base visual del frontend antes de implementar funcionalidades grandes como autenticación, favoritos, CRUD privado o integración completa con datos reales.

La rama `feat/ui-design-system` parte desde `dev` y, al inicio del sprint, no contiene cambios propios respecto a la rama base. Esto permite trabajar con bajo riesgo y con commits pequeños y revisables.

---

## 2. Objetivo de la rama

El objetivo principal de la rama es crear un sistema visual base para QuoteMatic-Web usando la dirección estética **Cosmos**.

La rama debe entregar una interfaz inicial:

- Moderna.
- Responsive.
- Accesible a nivel básico.
- Preparada para crecer por componentes.
- Visualmente coherente con el concepto de frases, inspiración y exploración.
- Lista para conectar después con la API real sin rehacer la estructura visual.

Esta rama no debe implementar todavía:

- Flujo completo de autenticación.
- Favoritos funcionales.
- CRUD privado de frases.
- Gestión avanzada de usuario.
- Estado global complejo.
- Redux u otra librería de estado innecesaria.

---

## 3. Dirección visual validada

La dirección visual elegida es **Cosmos**.

Características principales:

- Tema oscuro moderno.
- Fondo tipo cosmos con gradientes radiales suaves.
- Glassmorphism en navbar, cards, botones o paneles.
- Efectos 3D sutiles.
- Estética cuidada de portfolio, pero sin sobrediseñar.
- Diseño responsive mobile-first.
- Accesibilidad básica: contraste, foco visible y estados claros.
- Respeto a `prefers-reduced-motion`.

Paleta aproximada:

```txt
Fondo principal:    #080810 / #0d0d1a
Surface glass:      rgba(255,255,255,0.06)
Primary:            #7c5cfc
Accent:             #f59e0b / #ff7a59
Texto principal:    #f0eeff
Texto secundario:   #9b8ec4
Border glass:       rgba(255,255,255,0.10)
```

---

## 4. Stack y criterios técnicos

Stack del frontend:

- React.
- Vite.
- TypeScript.
- React Router.
- lucide-react.
- CSS normal.
- Fetch API.
- Sin Redux salvo necesidad clara.
- Sin Tailwind salvo decisión explícita posterior.
- Sin backend mock salvo casos excepcionales.

Criterios técnicos del sprint:

- No romper la estructura actual de rutas.
- No introducir lógica funcional grande.
- Mantener componentes pequeños y reutilizables.
- Evitar estilos inline masivos.
- Evitar copiar literalmente diseños generados previamente.
- Convertir la referencia visual en una implementación real de React + TypeScript + CSS.
- Mantener la app construible con `npm run build`.
- Mantener lint limpio con `npm run lint`.

---

## 5. Mini-features internas

### 5.1. Mini-feature 1 — Cosmos Design Tokens

#### Objetivo

Definir el lenguaje visual base de la aplicación mediante variables CSS y estilos globales.

#### Archivos previstos

```txt
src/styles/variables.css
src/styles/global.css
src/styles/utilities.css
```

#### Alcance

- Definir colores del tema Cosmos.
- Crear tokens para superficies glass.
- Crear tokens para bordes, sombras y radios.
- Definir tipografía base.
- Definir anchura máxima de layout.
- Añadir foco visible.
- Preparar estilos base responsive.
- Añadir soporte para `prefers-reduced-motion`.

#### Riesgos

- Bajo contraste en textos secundarios.
- Fondo demasiado cargado visualmente.
- Uso excesivo de sombras o blur.
- Ocultar scroll global por error.
- Romper legibilidad en páginas existentes.

#### Commit recomendado

```txt
feat: add cosmos design tokens
```

---

### 5.2. Mini-feature 2 — Componentes UI reutilizables

#### Objetivo

Crear una pequeña base de componentes visuales reutilizables para evitar duplicación de estilos.

#### Archivos previstos

```txt
src/components/ui/Button.tsx
src/components/ui/Badge.tsx
src/components/ui/QuoteCard.tsx
src/components/ui/LoadingState.tsx
src/components/ui/ErrorState.tsx
src/components/ui/EmptyState.tsx
src/components/ui/index.ts
```

Archivo CSS posible:

```txt
src/styles/components.css
```

#### Alcance

- `Button` con variantes visuales.
- `Badge` o `Chip`.
- `QuoteCard` para representar frases.
- `LoadingState`.
- `ErrorState`.
- `EmptyState`.
- Exportación centralizada desde `components/ui/index.ts`.

#### Riesgos

- Sobrecomponentizar demasiado pronto.
- Crear props demasiado complejas.
- Acoplar componentes a datos concretos de la API antes de tiempo.
- Duplicar clases CSS o nombres poco claros.

#### Commit recomendado

```txt
feat: add reusable ui components
```

---

### 5.3. Mini-feature 3 — Layout Cosmos

#### Objetivo

Aplicar el diseño Cosmos al layout principal, la navegación y el footer.

#### Archivos previstos

```txt
src/components/layout/AppLayout.tsx
src/components/layout/Navbar.tsx
src/components/layout/Footer.tsx
src/styles/global.css
src/styles/utilities.css
src/styles/components.css
```

#### Alcance

- Ajustar `app-shell`.
- Ajustar `app-main`.
- Rediseñar Navbar con estilo glass.
- Rediseñar Footer.
- Mantener rutas actuales.
- Mantener estados activos en navegación.
- Adaptar navegación a móvil.

#### Riesgos

- Navbar rota en pantallas pequeñas.
- Links con área táctil demasiado pequeña.
- Footer desalineado.
- Blur o transparencia excesivos.
- Layout demasiado dependiente de desktop.

#### Commit recomendado

```txt
feat: update layout with glass navigation
```

---

### 5.4. Mini-feature 4 — HomePage visual estática

#### Objetivo

Rediseñar la Home como landing visual estática del proyecto, sin conexión funcional completa con la API.

#### Archivos previstos

```txt
src/pages/HomePage.tsx
src/components/ui/Button.tsx
src/components/ui/Badge.tsx
src/components/ui/QuoteCard.tsx
src/styles/components.css
src/styles/utilities.css
```

#### Alcance

- Hero principal.
- Propuesta de valor.
- CTA hacia `/explore`.
- Card destacada con frase de muestra.
- Bloques visuales breves sobre exploración, favoritos y futuras frases personales.
- Composición responsive.

#### Riesgos

- Home demasiado cargada.
- Mensajes que prometan funcionalidades aún no implementadas.
- Exceso de decoración.
- Desalineación entre diseño desktop y móvil.
- Frase mock confundida con dato real de API.

#### Commit recomendado

```txt
feat: redesign home page
```

---

### 5.5. Mini-feature 5 — Páginas placeholder coherentes

#### Objetivo

Alinear visualmente las páginas secundarias existentes con el nuevo diseño, sin implementar aún su funcionalidad completa.

#### Archivos previstos

```txt
src/pages/ExplorePage.tsx
src/pages/AuthorsPage.tsx
src/pages/AboutPage.tsx
src/pages/NotFoundPage.tsx
```

#### Alcance

- Usar `EmptyState` o composiciones simples.
- Mantener mensajes claros.
- Indicar que algunas secciones se conectarán después con la API.
- Evitar que la app parezca incompleta o visualmente rota.

#### Riesgos

- Dedicar demasiado tiempo a pantallas secundarias.
- Implementar lógica que corresponde a futuros sprints.
- Crear inconsistencias visuales con Home.

#### Commit recomendado

```txt
feat: align placeholder pages with cosmos theme
```

---

### 5.6. Mini-feature 6 — Pulido responsive y accesibilidad

#### Objetivo

Revisar y ajustar el resultado final para que sea estable en móvil, tablet y desktop.

#### Archivos previstos

```txt
src/styles/global.css
src/styles/utilities.css
src/styles/components.css
src/components/layout/Navbar.tsx
src/components/layout/Footer.tsx
src/pages/HomePage.tsx
```

#### Alcance

- Revisar breakpoints.
- Evitar overflow horizontal.
- Mejorar áreas táctiles.
- Verificar foco visible.
- Verificar contraste.
- Ajustar animaciones.
- Confirmar `prefers-reduced-motion`.
- Revisar estados hover, active y disabled.

#### Riesgos

- Arreglar un breakpoint y romper otro.
- Animaciones excesivas.
- Sombras pesadas en móvil.
- Inconsistencias de espaciado.

#### Commit recomendado

```txt
chore: polish responsive styles
```

---

## 6. Orden recomendado de implementación

Orden propuesto:

```txt
1. Cosmos Design Tokens
2. Componentes UI reutilizables
3. Layout Cosmos
4. HomePage visual estática
5. Páginas placeholder coherentes
6. Pulido responsive y accesibilidad
```

Justificación:

1. Primero se define el lenguaje visual.
2. Después se crean piezas reutilizables.
3. Luego se adapta la estructura general.
4. Después se rediseña la Home usando esas piezas.
5. Más tarde se alinean páginas secundarias.
6. Al final se hace QA visual y técnico.

Este orden evita duplicar estilos y reduce el riesgo de mezclar diseño con lógica funcional.

---

## 7. Riesgos visuales y técnicos generales

### Riesgos visuales

- Abusar del glassmorphism.
- Crear demasiado contraste entre secciones.
- Fondo decorativo que dificulte lectura.
- Sombras o blur excesivos.
- Diseño demasiado parecido a una plantilla genérica.
- Navegación poco usable en móvil.
- Botones con estados poco claros.
- Texto secundario con contraste insuficiente.

### Riesgos técnicos

- Romper rutas existentes.
- Importar mal desde `react-router`.
- Introducir lógica de API antes de tiempo.
- Crear componentes demasiado complejos.
- Mezclar estilos globales y específicos sin criterio.
- Crear nombres de clases poco reutilizables.
- Romper `npm run build` por tipos incorrectos.
- Cambiar servicios o tipos que no forman parte de esta rama.

---

## 8. Checklist QA

### QA técnico

Ejecutar:

```bash
npm run dev
npm run lint
npm run build
```

Comprobar:

- La app arranca correctamente.
- No hay errores de TypeScript.
- No hay errores de ESLint.
- La build se genera sin fallos.
- No se rompe el router.
- No se toca innecesariamente el cliente API.
- No se introducen dependencias nuevas salvo necesidad justificada.

### QA de rutas

Revisar manualmente:

```txt
/
 /explore
 /authors
 /about
 /ruta-inexistente
```

Comprobar:

- Home renderiza correctamente.
- Explore renderiza.
- Authors renderiza.
- About renderiza.
- NotFound aparece para rutas inexistentes.
- Navbar marca correctamente la ruta activa.

### QA responsive

Probar visualmente:

```txt
Mobile: 360px / 390px
Tablet: 768px
Desktop: 1280px+
```

Comprobar:

- No aparece scroll horizontal.
- Navbar es usable.
- Footer no se rompe.
- Cards se apilan correctamente.
- Botones mantienen buen tamaño táctil.
- El hero no ocupa altura excesiva en móvil.
- Los textos no se cortan.

### QA accesibilidad básica

Comprobar:

- Foco visible con teclado.
- Contraste suficiente.
- Links con texto comprensible.
- Iconos decorativos con `aria-hidden`.
- Estados hover/focus/active claros.
- No depender solo del color para comunicar estados.
- Respeto a `prefers-reduced-motion`.

---

## 9. Propuesta de commits pequeños

Commits principales:

```txt
feat: add cosmos design tokens
feat: add reusable ui components
feat: update layout with glass navigation
feat: redesign home page
feat: align placeholder pages with cosmos theme
chore: polish responsive styles
```

Commits opcionales si se decide dividir más:

```txt
feat: add button and badge components
feat: add quote card component
feat: add ui state components
```

Criterio de commits:

- Cada commit debe compilar.
- Cada commit debe tener un propósito claro.
- Evitar commits mezclando diseño, lógica y documentación.
- Mantener la rama fácil de revisar en PR.

---

## 10. Definición de hecho de la rama

La rama `feat/ui-design-system` estará lista para PR hacia `dev` cuando:

- La app arranque en local.
- `npm run lint` funcione.
- `npm run build` funcione.
- Home tenga aspecto visual cercano a Cosmos.
- Navbar y Footer estén adaptados.
- Existan componentes UI reutilizables.
- Las páginas secundarias no parezcan rotas visualmente.
- El diseño sea responsive.
- No se haya implementado funcionalidad grande fuera del alcance.
- El proyecto quede preparado para conectar después con la API real.

---

## 11. Resumen para futura PR

Título sugerido:

```txt
feat: add cosmos ui design system
```

Resumen sugerido:

```md
## Qué se cambió

- Se añadió la base visual Cosmos para QuoteMatic-Web.
- Se definieron tokens CSS para colores, glassmorphism, sombras y layout.
- Se añadieron componentes UI reutilizables.
- Se adaptaron Navbar y Footer.
- Se rediseñó la Home como landing estática.
- Se alinearon páginas placeholder con el nuevo tema.
- Se revisó responsive y accesibilidad básica.

## QA

- [ ] npm run dev
- [ ] npm run lint
- [ ] npm run build
- [ ] Revisión mobile
- [ ] Revisión tablet
- [ ] Revisión desktop
- [ ] Navegación entre rutas
- [ ] Foco visible
- [ ] Sin scroll horizontal

## Riesgos

- Algunas secciones son todavía estáticas.
- La conexión funcional completa con API queda para futuras ramas.
- Puede requerir pequeños ajustes visuales tras probar con datos reales.

## Próximos pasos

- Conectar Home con frase aleatoria real.
- Implementar explorador de frases.
- Preparar favoritos y auth en ramas separadas.
```

---

## 12. Decisión pendiente antes de comenzar

Antes de escribir código, validar:

- Mantener CSS normal en `src/styles`.
- Crear `src/styles/components.css` para estilos de componentes UI.
- Usar componentes UI simples, sin librería externa.
- No añadir Redux ni Tailwind.
- No conectar todavía la Home con API real.

Una vez validado este plan, el primer desarrollo recomendado es:

```txt
Mini-feature 1 — Cosmos Design Tokens
```
