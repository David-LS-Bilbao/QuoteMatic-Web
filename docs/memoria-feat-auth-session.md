# Memoria técnica — Sprint `feat/auth-session`

Proyecto: **QuoteMatic-Web**  
Repositorio: `git@github.com:David-LS-Bilbao/QuoteMatic-Web.git`  
Rama de trabajo: `feat/auth-session`  
Rama base: `dev`  
Backend/API: <https://quotematic.davlos.es>  
Swagger: <https://quotematic.davlos.es/api-docs/>

---

## 1. Contexto

Tras completar el explorador público de frases (`feat/explore-quotes`), QuoteMatic-Web tenía todas las funcionalidades de visitante no registrado implementadas.

Este sprint introduce el sistema de autenticación completo para usuarios registrados y administradores. Es el paso necesario antes de implementar favoritos, frases privadas y panel admin, ya que todas esas features requieren sesión activa.

El backend gestiona la sesión con cookies HTTP. El frontend no maneja tokens JWT ni credenciales directamente: solo detecta el rol devuelto por `GET /api/auth/me`.

---

## 2. Objetivo de la rama

Implementar la capa de autenticación completa en el frontend:

- Login y registro con los endpoints del backend.
- Comprobación de sesión al arrancar la app.
- Estado de autenticación global disponible en toda la aplicación.
- Navbar reactiva según el estado de sesión.
- Rutas protegidas para usuarios autenticados y administradores.
- Páginas de cuenta y panel admin/dev (placeholder).

---

## 3. Alcance

### Incluido

- Tipos TypeScript de autenticación.
- Servicio de autenticación (`authService.ts`).
- Contexto global (`AuthContext` + `AuthProvider`).
- Hook de acceso al contexto (`useAuth`).
- Componente de ruta protegida (`ProtectedRoute`).
- Página de login (`LoginPage`).
- Página de registro (`RegisterPage`).
- Página de cuenta (`AccountPage`).
- Página placeholder de panel admin/dev (`AdminDevPanelPage`).
- Navbar reactiva según estado de sesión y rol.
- Rutas `/login`, `/register`, `/account`, `/admin/dev-panel` en el router.
- Wrapping de la app con `AuthProvider`.

### Fuera de alcance

- Favoritos reales.
- CRUD privado de frases.
- Panel admin funcional.
- Modo claro.
- `localStorage` para sesión (la sesión la gestiona el backend con cookies).

---

## 4. Archivos creados

```txt
src/types/auth.ts
src/services/authService.ts
src/context/authContext.ts
src/context/AuthProvider.tsx
src/hooks/useAuth.ts
src/components/auth/ProtectedRoute.tsx
src/pages/LoginPage.tsx
src/pages/RegisterPage.tsx
src/pages/AccountPage.tsx
src/pages/AdminDevPanelPage.tsx
```

## 5. Archivos modificados

```txt
src/app/App.tsx          — wrapping con AuthProvider
src/app/router.tsx       — rutas auth + rutas protegidas
src/components/layout/Navbar.tsx — estado reactivo de sesión
```

---

## 6. Implementación técnica

### 6.1. Tipos de autenticación

`src/types/auth.ts` define el contrato completo entre el frontend y el backend:

```txt
AuthRole        — 'user' | 'admin'
AgeGroup        — 'teen_14_17' | 'adult_18_plus'  (lo que devuelve el backend)
AgeRange        — 'teen_14_17' | 'adult_18_plus'  (lo que envía el frontend al registrar)
AuthUser        — usuario normalizado (id, name?, email?, role?, ageGroup?)
AuthStatus      — 'checking' | 'anonymous' | 'authenticated'
LoginCredentials
RegisterCredentials
AuthContextValue
```

`name` y `email` son opcionales en `AuthUser` porque el backend no los devuelve en la respuesta de autenticación. Solo devuelve `id`, `role` y `ageGroup`.

---

### 6.2. Servicio de autenticación

`src/services/authService.ts` expone cuatro funciones:

```txt
loginUser(credentials)     → AuthUser
registerUser(credentials)  → AuthUser
getCurrentUser()           → AuthUser
logoutUser()               → void
```

La función interna `normalizeAuthUser` acepta múltiples formas de respuesta del backend:

```txt
{ success, data: { user } }   ← forma real actual del backend
{ success, data: user }
{ user }
user directo
```

El type guard `isAuthUser` valida que el objeto tenga `id` o `_id` de tipo string. No exige `name` ni `email` porque el backend no los incluye en la respuesta de auth.

---

### 6.3. Contexto global

El contexto sigue el patrón de separación entre definición y proveedor:

```txt
src/context/authContext.ts   — createContext (solo la definición)
src/context/AuthProvider.tsx — useState, useCallback, useMemo, useEffect
```

`AuthProvider` gestiona:

```txt
user        — AuthUser | null
status      — AuthStatus
isLoading   — boolean
errorMessage — string | null
```

Al montar, lanza `getCurrentUser()` para comprobar si hay sesión activa (cookie). Si el backend responde sin sesión, el estado queda `anonymous`. Los errores de red o de sesión expirada son silenciosos y dejan la app en modo visitante.

Los métodos `login`, `register` y `logout` propagan los errores hacia arriba para que cada página los gestione visualmente.

---

### 6.4. Hook de acceso

`src/hooks/useAuth.ts` es un wrapper de `useContext` con guard de contexto:

```typescript
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
```

Expone el valor completo del contexto: `user`, `status`, `isLoading`, `isAuthenticated`, `isAdmin`, `errorMessage`, `login`, `register`, `logout`, `refreshSession`.

---

### 6.5. Ruta protegida

`src/components/auth/ProtectedRoute.tsx` tiene tres estados:

```txt
isLoading → muestra "Comprobando sesión" (evita flash de redirect)
!isAuthenticated → redirige a /login
requireAdmin && !isAdmin → muestra "Acceso restringido"
autenticado (y admin si se exige) → renderiza children o Outlet
```

Se usa `children` explícito en el router (no `Outlet`), lo que hace las rutas más legibles.

---

### 6.6. Páginas de autenticación

`LoginPage` y `RegisterPage` comparten el mismo patrón:

```txt
1. Si ya hay sesión (isAuthenticated), redirigir a /account con <Navigate>.
2. Submit → llamar al método del contexto (login/register).
3. Éxito → navigate('/account').
4. Error → mostrar en formError local.
```

`RegisterPage` envía exactamente:

```json
{
  "name": "...",
  "email": "...",
  "password": "...",
  "ageRange": "adult_18_plus" | "teen_14_17"
}
```

El campo `ageRange` se gestiona con un `<select>` con los dos valores reales aceptados por el backend.

---

### 6.7. Navbar reactiva

La Navbar usa `useAuth` y renderiza condicionalmente:

```txt
isLoading          → "Sesión..."
isAuthenticated    → user?.name ?? 'Usuario' + botón Salir + link Mi cuenta
isAdmin            → además link Admin
!isAuthenticated   → link Acceder → /login
```

El nombre de usuario usa `user?.name ?? 'Usuario'` como fallback porque el backend no devuelve `name`.

---

### 6.8. AccountPage

Muestra el estado de la sesión activa con fallbacks seguros:

```txt
user.name   → user.name ?? 'Usuario'
user.email  → user.email ?? 'Email no disponible'
user.role   → isAdmin ? 'Administrador' : 'Usuario'
```

Incluye botón de logout que llama a `logout()` del contexto.

Si `user` es null (caso de llegada directa sin sesión válida), muestra un `EmptyState`.

---

### 6.9. Router actualizado

Nuevas rutas añadidas:

```txt
/login              → LoginPage (pública)
/register           → RegisterPage (pública)
/account            → ProtectedRoute → AccountPage
/admin/dev-panel    → ProtectedRoute (requireAdmin) → AdminDevPanelPage
```

---

## 7. Bug encontrado y corregido durante auditoría

### Causa raíz

`isAuthUser` exigía `name` y `email` como strings. El backend no los devuelve. Resultado: `normalizeAuthUser` siempre lanzaba `'No se pudo obtener el usuario autenticado'`, haciendo que register y login nunca actualizaran el estado de la app.

### Archivos corregidos

| Archivo | Cambio |
|---|---|
| `src/types/auth.ts` | `name?` y `email?` opcionales, `ageGroup?` añadido |
| `src/services/authService.ts` | `isAuthUser` valida `id` o `_id`, no `name`/`email` |
| `src/pages/AccountPage.tsx` | Fallbacks `'Usuario'` y `'Email no disponible'` |

### Por qué el build no lo detectó

TypeScript confía en las anotaciones de tipo del return de `normalizeAuthUser`. El bug era en la lógica de runtime del type guard, no en los tipos estáticos. lint y build pasaban limpios. El error solo era visible en ejecución.

---

## 8. Decisiones técnicas

### Separar contexto de proveedor

`authContext.ts` solo crea el contexto. `AuthProvider.tsx` lo implementa. Esto facilita el testing y evita dependencias circulares.

### No usar localStorage para la sesión

La sesión la gestiona el backend con cookies HTTP. El frontend no necesita persistir nada localmente. Al arrancar, `getCurrentUser()` comprueba si hay cookie válida.

### Propagar errores desde el contexto

`login`, `register` y `logout` re-lanzan los errores después de actualizar el estado. Así cada página puede mostrar su propio mensaje de error sin que el contexto tenga que conocer la UI.

### isLoading en ProtectedRoute

El guard comprueba `isLoading` antes de redirigir. Sin esto, al refrescar una página protegida, el usuario vería un flash de redirect a `/login` mientras se comprueba la sesión real.

### Placeholder de admin/dev panel

`AdminDevPanelPage` es un placeholder funcional: requiere `requireAdmin` en `ProtectedRoute`, pero no implementa funcionalidad admin aún. El contenido se desarrollará en `feat/admin-dev-panel`.

---

## 9. Roles y permisos

El frontend detecta el rol desde la respuesta de `GET /api/auth/me`. No hay lógica de permisos en frontend: solo muestra u oculta navegación y rutas.

| Rol | Acceso |
|---|---|
| Visitante | `/`, `/explore`, `/authors`, `/about`, `/login`, `/register` |
| User | todo anterior + `/account` |
| Admin | todo anterior + `/admin/dev-panel` |

El usuario admin se crea desde el backend (seed o base de datos). El frontend no gestiona la creación de admins.

---

## 10. QA ejecutado

```bash
npm run lint   → sin errores
npm run build  → sin errores
```

Checklist manual recomendado:

```txt
[ ] Register con email nuevo → navega a /account
[ ] Register con email duplicado → muestra error 409 en formulario
[ ] Login con credenciales correctas → navega a /account
[ ] Login con credenciales incorrectas → muestra error en formulario
[ ] Refrescar /account con sesión activa → no redirige a /login
[ ] Acceder a /account sin sesión → redirige a /login
[ ] Logout → Navbar muestra "Acceder"
[ ] Navbar muestra nombre de usuario o "Usuario" tras autenticarse
[ ] /admin/dev-panel sin rol admin → muestra "Acceso restringido"
```

---

## 11. Contrato real del backend

### Endpoints

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

### Payload de registro

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "ageRange": "adult_18_plus" | "teen_14_17"
}
```

### Respuesta de register / login / me

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "role": "user" | "admin",
      "ageGroup": "adult_18_plus" | "teen_14_17"
    }
  }
}
```

El backend NO devuelve `name` ni `email` en la respuesta de autenticación.

Las peticiones usan `credentials: 'include'` para enviar y recibir cookies de sesión.

---

## 12. Próximos pasos

Siguiente rama recomendada:

```txt
feat/favorites
```

Objetivo:
- guardar frases favoritas para usuario logueado;
- ver lista de favoritos;
- eliminar favorito;
- integrar botón en `QuoteCard`.

Después:

```txt
feat/my-private-quotes
feat/admin-dev-panel
feat/theme-toggle
feat/share-quote
```
