import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, PasswordInput, Button, Stack, Alert } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { IoAlertCircle } from 'react-icons/io5';

import { loginSchema } from '../../../lib/validations/auth';
import { authService } from '../../../api/services/auth';
import { useAuthStore } from '../../../stores/authStore';

export function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            const authData = await authService.login(data.email, data.password);
            setUser(authData.record);

            notifications.show({
                title: '¡Bienvenido!',
                message: 'Inicio de sesión exitoso',
                color: 'green',
            });

            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
                {error && (
                    <Alert icon={<IoAlertCircle size={16} />} color="red" variant="light">
                        {error}
                    </Alert>
                )}

                <TextInput
                    label="Email"
                    placeholder="tu@email.com"
                    {...register('email')}
                    error={errors.email?.message}
                />

                <PasswordInput
                    label="Contraseña"
                    placeholder="Tu contraseña"
                    {...register('password')}
                    error={errors.password?.message}
                />

                <Button type="submit" loading={loading} fullWidth>
                    Iniciar Sesión
                </Button>
            </Stack>
        </form>
    );
}
