# Boilerplate React + Vite + PocketBase - Knowledge Base

Guía de referencia para configurar y mantener el boilerplate.

---

## Stack Tecnológico

- **Vite** - Bundler rápido
- **React** - UI Library
- **Mantine UI** - Component Library
- **React Router DOM** - Routing
- **TanStack Query** - Data Fetching & Caching
- **Zustand** - State Management
- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **PocketBase** - Backend & Database
- **React Icons** - Icon Library
- **dayjs** - Date Management

---

## 2. Estructura de Carpetas

```
src/
├── api/                      # PocketBase config y servicios
│   ├── client.js            # Instancia de PocketBase
│   └── services/            # CRUD por colección
│       ├── auth.js
│       └── tasks.js
├── components/
│   ├── common/              # Componentes reutilizables
│   ├── forms/               # Componentes de formularios
│   └── layout/              # Layouts (Header, Sidebar, etc.)
├── features/                # Funcionalidades por dominio
│   ├── auth/
│   │   ├── components/      # LoginForm, etc.
│   │   └── stores/          # Zustand stores del feature
│   └── dashboard/
│       ├── components/      # TasksTable, etc.
│       └── hooks/           # useTasks, etc.
├── hooks/                   # Custom hooks globales
├── lib/                     # Configuraciones
│   ├── react-query.js      # QueryClient setup
│   └── validations/        # Schemas Zod reutilizables
├── pages/                   # Componentes de página
│   ├── Login.jsx
│   └── Dashboard.jsx
├── routes/                  # Configuración de rutas
│   ├── index.jsx           # Router principal
│   └── ProtectedRoute.jsx  # HOC para rutas privadas
├── stores/                  # Zustand stores globales
│   └── authStore.js
├── utils/                   # Helpers y constantes
├── App.jsx
└── main.jsx
```

---

## 3. PocketBase

Ya está configurado, en ella hay:

### Colección de ejemplo: `tasks`

**Campos:**

- `title` (text, required)
- `description` (text)
- `status` (select: "pending", "in_progress", "completed")
- `due_date` (date)
- `created` y `updated` (auto-generados)

**API Rules (todas requieren autenticación):**

```
List/View/Create/Update/Delete: @request.auth.id != ""
```

### Usuario de prueba

- Email: `test@test.com`
- Password: `test123456`

---

## 4. Conceptos Clave por Tecnología

### PocketBase Client (`src/api/client.js`)

- Inicializar una única instancia de PocketBase
- Configurar `autoCancellation(false)` para permitir múltiples requests
- Exportar para reutilizar en toda la app

### Services (`src/api/services/`)

- Un service por colección (auth, tasks, etc.)
- Encapsulan toda la lógica de comunicación con PocketBase
- Métodos típicos: `getAll()`, `getOne(id)`, `create(data)`, `update(id, data)`, `delete(id)`

### Zustand Store (`src/stores/authStore.js`)

- Manejo de estado global simple y reactivo
- Para auth: guardar `user`, `isAuthenticated`
- Métodos: `setUser()`, `logout()`
- Sincronizar con `pb.authStore` de PocketBase

### TanStack Query (`src/lib/react-query.js`)

- Configurar `QueryClient` con opciones por defecto
- En componentes usar `useQuery` para fetch, `useMutation` para create/update/delete
- Beneficios: caching automático, refetch, estados de loading/error

### React Hook Form + Zod

- Definir schemas en `src/lib/validations/`
- Usar `zodResolver` en formularios
- Validación client-side automática con mensajes de error

### Protected Routes

- HOC que verifica `isAuthenticated` del store
- Si no está autenticado → redirect a `/login`
- Wrapper para rutas privadas en el router

---

## 5. Flujo de Autenticación

1. Usuario ingresa credenciales en `LoginForm`
2. `authService.login()` llama a PocketBase
3. Si es exitoso, guardar user en `authStore` con `setUser()`
4. Redirigir a Dashboard
5. `ProtectedRoute` verifica auth antes de renderizar
6. Al hacer logout, `authStore.logout()` limpia el estado y `pb.authStore`

---

## 6. Flujo de Datos (Ejemplo: Tasks)

### Lectura

1. Componente `TasksTable` usa hook `useTasks()`
2. Hook usa `useQuery` con key `['tasks']`
3. Query llama a `tasksService.getAll()`
4. Service hace request a PocketBase
5. TanStack Query cachea y maneja estados (loading, error, data)

### Escritura (Create/Update/Delete)

1. Usar `useMutation` en el hook
2. Al ejecutar, llamar al service correspondiente
3. En `onSuccess`, invalidar queries con `queryClient.invalidateQueries(['tasks'])`
4. Tabla se actualiza automáticamente

---

## 7. Configuración de Mantine

### En `main.jsx`

```javascript
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

// Wrap App con MantineProvider y Notifications
```

### Theme customization (opcional)

Pasar prop `theme` a `MantineProvider` para personalizar colores, fonts, etc.

---

## 8. Manejo de Fechas con dayjs

```javascript
import dayjs from "dayjs";

// Formatear
dayjs(date).format("DD/MM/YYYY");

// Comparar
dayjs(date1).isAfter(date2);

// Manipular
dayjs().add(7, "day");
```

Configurar locale español:

```javascript
import "dayjs/locale/es";
dayjs.locale("es");
```

---

## 9. Patterns y Best Practices

### Naming Conventions

- Components: PascalCase (`LoginForm.jsx`)
- Hooks: camelCase con prefijo `use` (`useTasks.js`)
- Services: camelCase (`tasksService`)
- Stores: camelCase con sufijo `Store` (`authStore`)

### Organización de imports

```javascript
// 1. External libraries
// 2. Internal modules (api, components, hooks, stores)
// 3. Styles
```

### Error Handling

- Usar `try/catch` en servicios
- Mostrar notificaciones de error con Mantine Notifications
- TanStack Query maneja estados de error automáticamente

### Loading States

- TanStack Query provee `isLoading`, `isFetching`
- Mostrar spinners o skeletons mientras carga

### Colocation

- Mantener código relacionado junto (hooks del feature dentro de la carpeta feature)
- Si algo se usa en un solo lugar, dejarlo cerca

---

## 11. Próximos Pasos (Extensiones)

- **Paginación**: Implementar con `getList()` de PocketBase
- **Búsqueda y filtros**: Usar parámetros `filter` en queries
- **Upload de archivos**: Usar campos `file` de PocketBase

---

## 12. Troubleshooting

### Auth no persiste al refrescar

Verificar que `pb.authStore` tenga auto-refresh habilitado. PocketBase guarda el token en localStorage automáticamente.

### Queries no se actualizan

Asegurarse de invalidar queries después de mutations con `queryClient.invalidateQueries()`.

### Build errors

Verificar que todas las dependencias estén instaladas y los imports sean correctos.

---

## Referencias Rápidas

- **Mantine Docs**: https://mantine.dev/
- **TanStack Query**: https://tanstack.com/query/latest
- **PocketBase**: https://pocketbase.io/docs/
- **React Router**: https://reactrouter.com/
- **Zustand**: https://docs.pmnd.rs/zustand/
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/
