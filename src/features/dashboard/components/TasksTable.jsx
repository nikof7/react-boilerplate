import { useState } from 'react';
import {
    Table,
    Badge,
    ActionIcon,
    Group,
    Text,
    Loader,
    Center,
    TextInput,
    Select,
    Pagination,
    Stack,
    Paper,
} from '@mantine/core';
import { IoTrash, IoCheckmark, IoSearch, IoPencil } from 'react-icons/io5';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

import { useTasksPaginated, useUpdateTask, useDeleteTask } from '../hooks/useTasks';

dayjs.locale('es');

const STATUS_COLORS = {
    pending: 'yellow',
    in_progress: 'blue',
    completed: 'green',
};

const STATUS_LABELS = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    completed: 'Completada',
};

const STATUS_OPTIONS = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completada' },
];

export function TasksTable({ onEdit }) {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const perPage = 10;

    const { data, isLoading, error } = useTasksPaginated({
        page,
        perPage,
        status,
        search,
    });

    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setSearch(searchInput);
            setPage(1);
        }
    };

    const handleStatusChange = (value) => {
        setStatus(value || '');
        setPage(1);
    };

    const handleComplete = (task) => {
        updateTask.mutate({
            id: task.id,
            data: { status: 'completed' },
        });
    };

    const handleDelete = (id) => {
        deleteTask.mutate(id);
    };

    return (
        <Stack gap="md">
            {/* Filtros */}
            <Group>
                <TextInput
                    placeholder="Buscar tareas..."
                    leftSection={<IoSearch size={16} />}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearch}
                    style={{ flex: 1, maxWidth: 300 }}
                />
                <Select
                    placeholder="Filtrar por estado"
                    data={STATUS_OPTIONS}
                    value={status}
                    onChange={handleStatusChange}
                    clearable
                    style={{ width: 180 }}
                />
            </Group>

            {/* Tabla */}
            {isLoading ? (
                <Center py="xl">
                    <Loader size="lg" />
                </Center>
            ) : error ? (
                <Center py="xl">
                    <Text c="red">Error al cargar tareas: {error.message}</Text>
                </Center>
            ) : !data?.items || data.items.length === 0 ? (
                <Center py="xl">
                    <Text c="dimmed">No hay tareas que coincidan con los filtros</Text>
                </Center>
            ) : (
                <>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Título</Table.Th>
                                <Table.Th>Descripción</Table.Th>
                                <Table.Th>Estado</Table.Th>
                                <Table.Th>Fecha Límite</Table.Th>
                                <Table.Th>Acciones</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data.items.map((task) => (
                                <Table.Tr key={task.id}>
                                    <Table.Td>
                                        <Text fw={500}>{task.title}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm" c="dimmed" lineClamp={2}>
                                            {task.description || '-'}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color={STATUS_COLORS[task.status]} variant="light">
                                            {STATUS_LABELS[task.status]}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        {task.due_date
                                            ? dayjs(task.due_date).format('DD/MM/YYYY')
                                            : '-'}
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon
                                                variant="light"
                                                color="blue"
                                                onClick={() => onEdit?.(task)}
                                            >
                                                <IoPencil size={16} />
                                            </ActionIcon>
                                            {task.status !== 'completed' && (
                                                <ActionIcon
                                                    variant="light"
                                                    color="green"
                                                    onClick={() => handleComplete(task)}
                                                    loading={updateTask.isPending}
                                                >
                                                    <IoCheckmark size={16} />
                                                </ActionIcon>
                                            )}
                                            <ActionIcon
                                                variant="light"
                                                color="red"
                                                onClick={() => handleDelete(task.id)}
                                                loading={deleteTask.isPending}
                                            >
                                                <IoTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    {/* Paginación */}
                    {data.totalPages > 1 && (
                        <Group justify="center" mt="md">
                            <Pagination
                                value={page}
                                onChange={setPage}
                                total={data.totalPages}
                            />
                        </Group>
                    )}
                </>
            )}
        </Stack>
    );
}
