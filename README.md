# React + Vite + PocketBase Boilerplate

Un boilerplate moderno y escalable para construir aplicaciones web con React, Vite y PocketBase como backend.

---

## 🚀 Stack Tecnológico

| Tecnología           | Propósito               |
| -------------------- | ----------------------- |
| **Vite**             | Build tool ultra rápido |
| **React 19**         | UI Library              |
| **Mantine UI**       | Component Library       |
| **React Router DOM** | Routing SPA             |
| **TanStack Query**   | Data fetching & caching |
| **Zustand**          | State management        |
| **React Hook Form**  | Gestión de formularios  |
| **Zod**              | Validación de schemas   |
| **PocketBase**       | Backend & Database      |
| **dayjs**            | Manejo de fechas        |
| **React Icons**      | Iconografía             |

---

## 📁 Estructura del Proyecto

```
src/
├── api/                      # Configuración de PocketBase y servicios
│   ├── client.js            # Instancia singleton de PocketBase
│   └── services/            # Un service por colección
│       ├── auth.js          # Autenticación
│       └── tasks.js         # CRUD de tareas (ejemplo)
│
├── components/
│   ├── common/              # Componentes reutilizables (botones, inputs, etc.)
│   ├── forms/               # Componentes de formularios genéricos
│   └── layout/              # Layouts (AppShell, Header, Sidebar, etc.)
│
├── features/                # Funcionalidades organizadas por dominio
│   ├── auth/
│   │   ├── components/      # LoginForm, RegisterForm, etc.
│   │   └── stores/          # Stores específicos del feature
│   └── dashboard/
│       ├── components/      # TasksTable, TaskModal, etc.
│       └── hooks/           # useTasks, useTasksPaginated, etc.
│
├── hooks/                   # Custom hooks globales
├── lib/                     # Configuraciones de librerías
│   ├── react-query.js      # QueryClient setup
│   └── validations/        # Schemas Zod reutilizables
│
├── pages/                   # Componentes de página (rutas)
│   ├── Login.jsx
│   └── Dashboard.jsx
│
├── routes/                  # Configuración del router
│   ├── index.jsx           # Definición de rutas
│   └── ProtectedRoute.jsx  # HOC para rutas privadas
│
├── stores/                  # Zustand stores globales
│   └── authStore.js
│
├── utils/                   # Helpers y constantes
├── App.jsx                  # Componente raíz
└── main.jsx                 # Entry point con providers
```

---

## 🏁 Inicio Rápido

### 1. Clonar y configurar

```bash
# Clonar el repositorio
git clone <url-del-repo> mi-proyecto
cd mi-proyecto

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### 2. Configurar PocketBase

Edita `.env` con la URL de tu instancia de PocketBase:

```env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

### 3. Ejecutar

```bash
# Desarrollo
npm run dev

# Build producción
npm run build
```

---

## 🔧 Cómo Extender el Boilerplate

### Crear un nuevo Feature

Ejemplo: Agregar un módulo de "Proyectos"

#### 1. Crear la estructura de carpetas

```
src/features/projects/
├── components/
│   ├── ProjectsTable.jsx
│   └── ProjectModal.jsx
└── hooks/
    └── useProjects.js
```

#### 2. Crear el Service

```javascript
// src/api/services/projects.js
import pb from "../client";

const COLLECTION = "projects";

export const projectsService = {
  async getList({ page = 1, perPage = 10, filter = "" } = {}) {
    return await pb.collection(COLLECTION).getList(page, perPage, {
      sort: "-created",
      filter,
    });
  },

  async getOne(id) {
    return await pb.collection(COLLECTION).getOne(id);
  },

  async create(data) {
    return await pb.collection(COLLECTION).create(data);
  },

  async update(id, data) {
    return await pb.collection(COLLECTION).update(id, data);
  },

  async delete(id) {
    return await pb.collection(COLLECTION).delete(id);
  },
};
```

#### 3. Crear el Hook con TanStack Query

```javascript
// src/features/projects/hooks/useProjects.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsService } from "../../../api/services/projects";
import { notifications } from "@mantine/notifications";

const PROJECTS_KEY = ["projects"];

export function useProjects({ page = 1, perPage = 10 } = {}) {
  return useQuery({
    queryKey: [...PROJECTS_KEY, { page, perPage }],
    queryFn: () => projectsService.getList({ page, perPage }),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
      notifications.show({
        title: "Éxito",
        message: "Proyecto creado correctamente",
        color: "green",
      });
    },
  });
}
```

#### 4. Crear validación Zod

```javascript
// src/lib/validations/projects.js
import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  status: z.enum(["active", "completed", "archived"]),
});
```

#### 5. Crear la página y agregar la ruta

```javascript
// src/pages/Projects.jsx
import { Container, Title } from "@mantine/core";
import { AppShell } from "../components/layout/AppShell";
import { ProjectsTable } from "../features/projects/components/ProjectsTable";

export function Projects() {
  return (
    <AppShell>
      <Container fluid>
        <Title order={2} mb="lg">
          Proyectos
        </Title>
        <ProjectsTable />
      </Container>
    </AppShell>
  );
}
```

```javascript
// src/routes/index.jsx - Agregar la ruta
import { Projects } from '../pages/Projects';

// En el array de rutas:
{
  path: '/projects',
  element: (
    <ProtectedRoute>
      <Projects />
    </ProtectedRoute>
  ),
},
```

---

## 📐 Patrones y Convenciones

### Naming Conventions

| Tipo         | Convención                   | Ejemplo          |
| ------------ | ---------------------------- | ---------------- |
| Componentes  | PascalCase                   | `TasksTable.jsx` |
| Hooks        | camelCase + prefijo `use`    | `useTasks.js`    |
| Services     | camelCase + sufijo `Service` | `tasksService`   |
| Stores       | camelCase + sufijo `Store`   | `authStore`      |
| Validaciones | camelCase + sufijo `Schema`  | `taskSchema`     |

### Organización de Imports

```javascript
// 1. Librerías externas
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// 2. Componentes internos
import { AppShell } from "../components/layout/AppShell";

// 3. Hooks, stores, services
import { useTasks } from "../features/dashboard/hooks/useTasks";
import { useAuthStore } from "../stores/authStore";

// 4. Utils y constantes
import { formatDate } from "../utils/dates";
```

### Flujo de Datos

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │────▶│    Hook     │────▶│   Service   │
│             │     │ (useQuery)  │     │ (PocketBase)│
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   ▼                   │
       │            ┌─────────────┐            │
       └───────────▶│   Cache     │◀───────────┘
                    │(TanStack Q) │
                    └─────────────┘
```

---

## 🔐 Autenticación

### Login

```javascript
import { authService } from "../api/services/auth";
import { useAuthStore } from "../stores/authStore";

const { setUser } = useAuthStore();

// Login
const authData = await authService.login(email, password);
setUser(authData.record);
```

### Logout

```javascript
const { logout } = useAuthStore();
logout(); // Limpia authStore y pb.authStore
```

### Proteger Rutas

```javascript
// Las rutas protegidas se envuelven con ProtectedRoute
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

---

## 🎨 Personalización de Mantine

Edita el theme en `main.jsx`:

```javascript
<MantineProvider
  theme={{
    primaryColor: 'blue',
    fontFamily: 'Inter, sans-serif',
    components: {
      Button: {
        defaultProps: {
          radius: 'md',
        },
      },
    },
  }}
>
```

---

## 📝 Formularios

### Con React Hook Form + Zod

```javascript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../lib/validations/tasks";

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(taskSchema),
});

const onSubmit = (data) => {
  // data está validado
};
```

---

## 🔄 Queries y Mutations

### Fetch con paginación

```javascript
const { data, isLoading, error } = useTasksPaginated({
  page: 1,
  perPage: 10,
  status: "pending",
  search: "urgente",
  // `assignedTo` puede ser un id o un arreglo de ids
  assignedTo: "user123",
});
```

### Crear/Actualizar

```javascript
const createTask = useCreateTask();

createTask.mutate(
  { title: "Nueva tarea", status: "pending" },
  {
    onSuccess: () => {
      // Acción después de crear
    },
  },
);
```

---

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Linter
```

---

## 🐛 Troubleshooting

### Auth no persiste al refrescar

PocketBase guarda el token en localStorage automáticamente. Verifica que `pb.authStore.isValid` sea `true`.

### Queries no se actualizan

Después de mutations, invalida las queries:

```javascript
queryClient.invalidateQueries({ queryKey: ["tasks"] });
```

### CORS en desarrollo

Configura PocketBase para permitir tu origen de desarrollo.

---

## 📚 Recursos

- [Mantine UI](https://mantine.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [PocketBase](https://pocketbase.io/docs/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

## 📄 Licencia

MIT
