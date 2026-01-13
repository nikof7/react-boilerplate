# Tareas del Boilerplate React + Vite + PocketBase

## Estado: ✅ Completado

---

## Tareas

### 1. Configuración Base

- [x] `src/api/client.js` - Instancia de PocketBase
- [x] `src/lib/react-query.js` - Configuración QueryClient
- [x] `src/main.jsx` - Providers (Mantine, QueryClient, Router)

### 2. Autenticación

- [x] `src/stores/authStore.js` - Zustand store de auth
- [x] `src/api/services/auth.js` - Servicio de autenticación
- [x] `src/lib/validations/auth.js` - Schema Zod para login
- [x] `src/features/auth/components/LoginForm.jsx` - Formulario de login
- [x] `src/pages/Login.jsx` - Página de login

### 3. Rutas

- [x] `src/routes/ProtectedRoute.jsx` - HOC para rutas privadas
- [x] `src/routes/index.jsx` - Router principal
- [x] `src/App.jsx` - Componente principal con Router

### 4. Feature: Tasks (Dashboard)

- [x] `src/api/services/tasks.js` - CRUD de tasks
- [x] `src/features/dashboard/hooks/useTasks.js` - Hook con TanStack Query
- [x] `src/features/dashboard/components/TasksTable.jsx` - Tabla de tareas
- [x] `src/pages/Dashboard.jsx` - Página del dashboard

### 5. Layout

- [x] `src/components/layout/AppShell.jsx` - Layout principal con header

### 6. Mejoras (Fase 2)

- [x] `src/lib/validations/tasks.js` - Schema Zod para tareas
- [x] `src/features/dashboard/components/TaskModal.jsx` - Modal crear/editar tarea
- [x] Actualizar `Dashboard.jsx` - Integrar modal con botón Nueva Tarea
- [x] Actualizar `tasksService` - Añadir paginación con getList()
- [x] Actualizar `useTasks` - Soporte paginación y filtros
- [x] Actualizar `TasksTable` - Filtros por estado y búsqueda

---

## Progreso

| Sección            | Completado   |
| ------------------ | ------------ |
| Configuración Base | 3/3 ✅       |
| Autenticación      | 5/5 ✅       |
| Rutas              | 3/3 ✅       |
| Feature Tasks      | 4/4 ✅       |
| Layout             | 1/1 ✅       |
| Mejoras (Fase 2)   | 6/6 ✅       |
| **TOTAL**          | **22/22** ✅ |
| **TOTAL**          | **16/22**    |
