import { Container, Paper, Title, Text, Center } from '@mantine/core';
import { Navigate } from 'react-router';

import { LoginForm } from '../features/auth/components/LoginForm';
import { useAuthStore } from '../stores/authStore';

export function Login() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <Center h="100vh" bg="gray.1">
            <Container size={420}>
                <Title ta="center" mb="md">
                    ¡Bienvenido!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mb="xl">
                    Ingresa tus credenciales para continuar
                </Text>

                <Paper withBorder shadow="md" p={30} radius="md">
                    <LoginForm />
                </Paper>
            </Container>
        </Center>
    );
}
