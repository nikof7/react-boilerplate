import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Modal,
    TextInput,
    Textarea,
    Select,
    Button,
    Stack,
    Group,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';

import { taskSchema, STATUS_OPTIONS } from '../../../lib/validations/tasks';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks';

export function TaskModal({ opened, onClose, task = null }) {
    const isEditing = !!task;
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'pending',
            due_date: '',
        },
    });

    // Cargar datos de la tarea al editar
    useEffect(() => {
        if (task) {
            reset({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'pending',
                due_date: task.due_date || '',
            });
        } else {
            reset({
                title: '',
                description: '',
                status: 'pending',
                due_date: '',
            });
        }
    }, [task, reset]);

    const onSubmit = async (data) => {
        // Formatear fecha para PocketBase
        const formattedData = {
            ...data,
            due_date: data.due_date ? dayjs(data.due_date).format('YYYY-MM-DD') : null,
        };

        if (isEditing) {
            updateTask.mutate(
                { id: task.id, data: formattedData },
                {
                    onSuccess: () => {
                        onClose();
                        reset();
                    },
                }
            );
        } else {
            createTask.mutate(formattedData, {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const isLoading = createTask.isPending || updateTask.isPending;

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
            centered
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="md">
                    <TextInput
                        label="Título"
                        placeholder="Nombre de la tarea"
                        {...register('title')}
                        error={errors.title?.message}
                        required
                    />

                    <Textarea
                        label="Descripción"
                        placeholder="Descripción opcional"
                        rows={3}
                        {...register('description')}
                        error={errors.description?.message}
                    />

                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Estado"
                                data={STATUS_OPTIONS}
                                {...field}
                                error={errors.status?.message}
                            />
                        )}
                    />

                    <Controller
                        name="due_date"
                        control={control}
                        render={({ field }) => (
                            <DateInput
                                label="Fecha límite"
                                placeholder="Selecciona una fecha"
                                valueFormat="DD/MM/YYYY"
                                clearable
                                value={field.value ? new Date(field.value) : null}
                                onChange={(date) =>
                                    field.onChange(date ? date.toISOString() : '')
                                }
                                error={errors.due_date?.message}
                            />
                        )}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" loading={isLoading}>
                            {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
