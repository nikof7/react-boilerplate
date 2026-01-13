# Guía Rápida de Desarrollo

Referencia rápida para desarrolladores que trabajan con este boilerplate.

---

## 🚀 Comandos Esenciales

```bash
npm run dev      # Iniciar desarrollo
npm run build    # Build producción
npm run preview  # Preview del build
```

---

## 📂 Agregar un Nuevo Feature

### Checklist

- [ ] Crear carpeta en `src/features/{nombre}/`
- [ ] Crear service en `src/api/services/{nombre}.js`
- [ ] Crear hook en `src/features/{nombre}/hooks/use{Nombre}.js`
- [ ] Crear validación en `src/lib/validations/{nombre}.js`
- [ ] Crear componentes en `src/features/{nombre}/components/`
- [ ] Crear página en `src/pages/{Nombre}.jsx`
- [ ] Agregar ruta en `src/routes/index.jsx`

---

## 📝 Templates de Código

### Service (CRUD completo)

```javascript
// src/api/services/{collection}.js
import pb from '../client';

const COLLECTION = '{collection}';

export const {collection}Service = {
  async getList({ page = 1, perPage = 10, filter = '' } = {}) {
    try {
      return await pb.collection(COLLECTION).getList(page, perPage, {
        sort: '-created',
        filter,
      });
    } catch (error) {
      throw new Error(error.message || 'Error al obtener datos');
    }
  },

  async getOne(id) {
    try {
      return await pb.collection(COLLECTION).getOne(id);
    } catch (error) {
      throw new Error(error.message || 'Error al obtener registro');
    }
  },

  async create(data) {
    try {
      return await pb.collection(COLLECTION).create(data);
    } catch (error) {
      throw new Error(error.message || 'Error al crear');
    }
  },

  async update(id, data) {
    try {
      return await pb.collection(COLLECTION).update(id, data);
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar');
    }
  },

  async delete(id) {
    try {
      await pb.collection(COLLECTION).delete(id);
      return true;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar');
    }
  },
};
```

### Hook (TanStack Query)

```javascript
// src/features/{feature}/hooks/use{Feature}.js
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { {feature}Service } from '../../../api/services/{feature}';
import { notifications } from '@mantine/notifications';

const KEY = ['{feature}'];

// Query con paginación
export function use{Feature}({ page = 1, perPage = 10 } = {}) {
  return useQuery({
    queryKey: [...KEY, { page, perPage }],
    queryFn: () => {feature}Service.getList({ page, perPage }),
    placeholderData: keepPreviousData,
  });
}

// Mutation para crear
export function useCreate{Feature}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: {feature}Service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      notifications.show({
        title: 'Éxito',
        message: 'Creado correctamente',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });
}

// Mutation para actualizar
export function useUpdate{Feature}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => {feature}Service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      notifications.show({
        title: 'Éxito',
        message: 'Actualizado correctamente',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });
}

// Mutation para eliminar
export function useDelete{Feature}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: {feature}Service.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      notifications.show({
        title: 'Éxito',
        message: 'Eliminado correctamente',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });
}
```

### Validación (Zod)

```javascript
// src/lib/validations/{feature}.js
import { z } from 'zod';

export const {feature}Schema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'Máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'Máximo 500 caracteres')
    .optional(),
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: 'Estado inválido' }),
  }),
});

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
];
```

### Página

```javascript
// src/pages/{Feature}.jsx
import { useState } from 'react';
import { Container, Title, Paper, Group, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IoAdd } from 'react-icons/io5';

import { AppShell } from '../components/layout/AppShell';
import { {Feature}Table } from '../features/{feature}/components/{Feature}Table';
import { {Feature}Modal } from '../features/{feature}/components/{Feature}Modal';

export function {Feature}() {
  const [opened, { open, close }] = useDisclosure(false);
  const [editing, setEditing] = useState(null);

  const handleNew = () => {
    setEditing(null);
    open();
  };

  const handleEdit = (item) => {
    setEditing(item);
    open();
  };

  const handleClose = () => {
    setEditing(null);
    close();
  };

  return (
    <AppShell>
      <Container size="lg">
        <Group justify="space-between" mb="lg">
          <Title order={2}>{Feature}</Title>
          <Button leftSection={<IoAdd size={18} />} onClick={handleNew}>
            Nuevo
          </Button>
        </Group>

        <Paper withBorder p="md" radius="md">
          <{Feature}Table onEdit={handleEdit} />
        </Paper>
      </Container>

      <{Feature}Modal opened={opened} onClose={handleClose} item={editing} />
    </AppShell>
  );
}
```

### Ruta Protegida

```javascript
// Agregar en src/routes/index.jsx
{
  path: '/{feature}',
  element: (
    <ProtectedRoute>
      <{Feature} />
    </ProtectedRoute>
  ),
},
```

---

## 🎯 Snippets Útiles

### Notificación de éxito

```javascript
import { notifications } from "@mantine/notifications";

notifications.show({
  title: "Éxito",
  message: "Operación completada",
  color: "green",
});
```

### Notificación de error

```javascript
notifications.show({
  title: "Error",
  message: error.message,
  color: "red",
});
```

### Formatear fecha

```javascript
import dayjs from "dayjs";

dayjs(date).format("DD/MM/YYYY"); // 13/01/2026
dayjs(date).format("DD/MM/YYYY HH:mm"); // 13/01/2026 14:30
```

### Obtener usuario actual

```javascript
import { useAuthStore } from "../stores/authStore";

const { user, isAuthenticated } = useAuthStore();
```

### Navegar programáticamente

```javascript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/dashboard");
```

---

## 🔍 PocketBase Filters

```javascript
// Filtrar por campo exacto
filter: 'status = "active"';

// Filtrar por múltiples condiciones (AND)
filter: 'status = "active" && priority = "high"';

// Filtrar por múltiples condiciones (OR)
filter: 'status = "active" || status = "pending"';

// Búsqueda parcial (LIKE)
filter: 'title ~ "urgente"';

// Filtrar por fecha
filter: 'due_date >= "2026-01-01"';

// Filtrar por relación
filter: 'user = "USER_ID"';
```

---

## 📋 Estructura de Respuesta PocketBase

### getList()

```javascript
{
  page: 1,
  perPage: 10,
  totalItems: 100,
  totalPages: 10,
  items: [...]
}
```

### getOne() / create() / update()

```javascript
{
  id: "RECORD_ID",
  collectionId: "...",
  collectionName: "tasks",
  created: "2026-01-13 10:00:00.000Z",
  updated: "2026-01-13 10:00:00.000Z",
  // ... campos personalizados
}
```
