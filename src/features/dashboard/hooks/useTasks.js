import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { tasksService } from '../../../api/services/tasks';
import { notifications } from '@mantine/notifications';

const TASKS_KEY = ['tasks'];

// Hook con paginación y filtros
export function useTasksPaginated({ page = 1, perPage = 10, status = '', search = '' } = {}) {
    return useQuery({
        queryKey: [...TASKS_KEY, { page, perPage, status, search }],
        queryFn: () => tasksService.getList({ page, perPage, status, search }),
        placeholderData: keepPreviousData,
    });
}

// Hook simple (sin paginación)
export function useTasks() {
    return useQuery({
        queryKey: TASKS_KEY,
        queryFn: tasksService.getAll,
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tasksService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
            notifications.show({
                title: 'Éxito',
                message: 'Tarea creada correctamente',
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

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => tasksService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
            notifications.show({
                title: 'Éxito',
                message: 'Tarea actualizada correctamente',
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

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tasksService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
            notifications.show({
                title: 'Éxito',
                message: 'Tarea eliminada correctamente',
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
