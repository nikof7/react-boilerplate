import { useState } from 'react';
import { Container, Title, Paper, Group, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IoAdd } from 'react-icons/io5';

import { AppShell } from '../components/layout/AppShell';
import { TasksTable } from '../features/dashboard/components/TasksTable';
import { TaskModal } from '../features/dashboard/components/TaskModal';

export function Dashboard() {
    const [opened, { open, close }] = useDisclosure(false);
    const [editingTask, setEditingTask] = useState(null);

    const handleNewTask = () => {
        setEditingTask(null);
        open();
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        open();
    };

    const handleCloseModal = () => {
        setEditingTask(null);
        close();
    };

    return (
        <AppShell>
            <Container size="lg">
                <Group justify="space-between" mb="lg">
                    <Title order={2}>Mis Tareas</Title>
                    <Button leftSection={<IoAdd size={18} />} onClick={handleNewTask}>
                        Nueva Tarea
                    </Button>
                </Group>

                <Paper withBorder p="md" radius="md">
                    <TasksTable onEdit={handleEditTask} />
                </Paper>
            </Container>

            <TaskModal
                opened={opened}
                onClose={handleCloseModal}
                task={editingTask}
            />
        </AppShell>
    );
}
