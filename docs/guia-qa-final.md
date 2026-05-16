# Guia QA final QuoteMatic Web

Fecha: 2026-05-16  
Rama objetivo: `feat/explore-scroll-quote-ui`

Esta guia es una checklist manual para ejecutar antes de abrir PR a `dev`. La validacion automatica minima es `npm run lint` y `npm run build`; lo siguiente debe comprobarse en navegador.

## Preparacion

- Ejecutar `npm install` si el entorno no tiene dependencias.
- Crear `.env` desde `.env.example` si hace falta.
- Confirmar `VITE_API_BASE_URL=https://quotematic.davlos.es`.
- Ejecutar `npm run dev`.
- Abrir la app en desktop y movil responsive.
- Probar en dark mode y light mode.
- Mantener DevTools abierto y revisar consola/red.

## Checklist por pagina

### `/`

- [ ] Renderiza la Home sin errores.
- [ ] Carga una frase real desde la API.
- [ ] El boton de nueva frase funciona.
- [ ] Estados de carga/error no rompen el layout.
- [ ] CTA y navegacion principal funcionan.

### `/explore`

- [ ] Carga una frase protagonista.
- [ ] La estetica pergamino se ve correcta en dark mode.
- [ ] La estetica pergamino se ve correcta en light mode.
- [ ] El boton "Otra frase" cambia la frase.
- [ ] Pulsar "Otra frase" 20 veces no deja errores en consola.
- [ ] Filtro de busqueda funciona.
- [ ] Filtro de situacion funciona.
- [ ] Filtro de tipo funciona.
- [ ] Limpiar filtros resetea estado visual y resultados.
- [ ] Guardar favorito redirige a login si no hay sesion.
- [ ] Guardar favorito funciona si hay sesion.
- [ ] Copiar muestra feedback temporal.
- [ ] Menu "Enviar" abre y cierra correctamente.
- [ ] Menu "Enviar" no queda tapado por footer ni otros paneles.
- [ ] Frase corta no deja la card visualmente pobre.
- [ ] Frase media mantiene composicion estable.
- [ ] Frase larga no provoca scroll horizontal global.
- [ ] Si la frase larga aumenta la card, confirmar si es aceptado para esta rama.

### `/explore?quote=<id>`

- [ ] Abrir con un id real muestra esa frase concreta.
- [ ] La frase mantiene autor, meta y acciones.
- [ ] "Otra frase" elimina el parametro `quote` de la URL.
- [ ] Si el id no existe, la pantalla cae a Explore normal sin quedarse bloqueada.
- [ ] Compartir/copiar desde esta vista usa el texto correcto.
- [ ] Refrescar navegador mantiene la frase concreta.

### `/authors`

- [ ] Carga catalogo de autores.
- [ ] Busqueda filtra en tiempo real.
- [ ] Volver a la pagina desde detalle aprovecha la cache y carga rapido.
- [ ] Cards son clicables y accesibles con teclado.
- [ ] Estados de carga/error son comprensibles.

### `/authors/:authorId`

- [ ] Carga nombre, descripcion y tipo del autor.
- [ ] Tabla de frases se muestra sin romper layout.
- [ ] En movil la tabla permite scroll horizontal controlado.
- [ ] Cada frase enlaza a `/explore?quote=<id>`.
- [ ] Boton "Volver a autores" funciona.
- [ ] Autor inexistente muestra fallback adecuado.

### `/favorites`

- [ ] Ruta protegida redirige a login sin sesion.
- [ ] Con sesion, carga favoritos.
- [ ] Quitar favorito funciona y actualiza estado.
- [ ] `QuoteCard` mantiene enlace a autor cuando existe.
- [ ] `ShareQuoteActions` full funciona dentro de la grid.
- [ ] No hay regresiones visuales por el cambio de `QuoteCard`.

### `/my-quotes`

- [ ] Ruta protegida redirige a login sin sesion.
- [ ] Con sesion, lista frases privadas.
- [ ] Crear frase funciona.
- [ ] Editar frase funciona.
- [ ] Borrar frase funciona.
- [ ] Acciones de compartir siguen usables.

### `/admin/dev-panel` y `/admin/import`

- [ ] Sin sesion admin, redirige o bloquea correctamente.
- [ ] Con admin, el panel carga estadisticas.
- [ ] Import CSV permite seleccionar archivo.
- [ ] Validacion de CSV muestra errores legibles.
- [ ] Vista previa no provoca scroll horizontal global.
- [ ] No probar importacion real en produccion sin confirmar datos.

### Rutas auxiliares

- [ ] `/about` renderiza correctamente.
- [ ] `/login` permite iniciar sesion.
- [ ] `/register` permite registro valido.
- [ ] `/account` muestra datos de usuario autenticado.
- [ ] Ruta inexistente muestra 404.

## Checklist responsive

- [ ] 360 px ancho: navbar usable y sin desbordes.
- [ ] 390 px ancho: Explore mantiene acciones apiladas correctamente.
- [ ] 768 px ancho: filtros y cards no se pisan.
- [ ] 1024 px ancho: layout desktop compacto.
- [ ] 1440 px ancho: contenido no queda excesivamente estirado.
- [ ] No aparece scroll horizontal global en `body`.
- [ ] Botones largos no cortan texto.
- [ ] Menus flotantes quedan dentro del viewport o hacen scroll controlado.

## Checklist navegacion

- [ ] Navbar mantiene activo correcto.
- [ ] Back/forward del navegador funciona entre `/authors/:id` y `/explore?quote=<id>`.
- [ ] Cambiar filtros en Explore limpia `quote` si venia en URL.
- [ ] "Otra frase" desde URL concreta vuelve a modo Explore normal.
- [ ] Rutas protegidas preservan una experiencia clara cuando no hay sesion.

## Checklist favoritos

- [ ] Guardar desde Explore con sesion.
- [ ] Evitar doble click mientras favorito esta pendiente.
- [ ] Quitar desde Favorites.
- [ ] Reentrar en Explore y comprobar estado guardado.
- [ ] Revisar mensajes visuales y estados disabled.

## Checklist compartir

- [ ] Copiar en Explore.
- [ ] Copiar en Favorites.
- [ ] WhatsApp abre con texto codificado.
- [ ] Email abre con asunto y cuerpo.
- [ ] X abre intent de tweet.
- [ ] Facebook abre dialogo con URL configurada.
- [ ] Discord copia texto y muestra feedback.
- [ ] Compartir nativo funciona en navegador compatible o hace fallback.
- [ ] Escape cierra menu compacto.
- [ ] Click fuera cierra menu compacto.

## Checklist errores y fallbacks

- [ ] API caida o sin red muestra mensaje de error.
- [ ] Filtros sin resultados muestran empty state.
- [ ] Autor inexistente muestra fallback.
- [ ] Frase inexistente en `?quote=` no deja spinner infinito.
- [ ] Portapapeles bloqueado muestra feedback de error.
- [ ] Usuario sin permisos admin no ve herramientas admin.

## Cierre QA

- [ ] `npm run lint` OK.
- [ ] `npm run build` OK.
- [ ] QA manual desktop OK.
- [ ] QA manual movil OK.
- [ ] Dark mode OK.
- [ ] Light mode OK.
- [ ] Sin errores en consola.
- [ ] Riesgos aceptados anotados en PR.
