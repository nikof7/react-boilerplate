import {
    AppShell as MantineAppShell,
    Burger,
    Group,
    Title,
    Button,
    Avatar,
    Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IoLogOut, IoPerson } from 'react-icons/io5';
import { useNavigate } from 'react-router';

import { useAuthStore } from '../../stores/authStore';

export function AppShell({ children }) {
    const [opened, { toggle }] = useDisclosure();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <MantineAppShell
            header={{ height: 60 }}
            navbar={{
                width: 250,
                breakpoint: 'sm',
                collapsed: { mobile: !opened, desktop: true },
            }}
            padding="md"
        >
            <MantineAppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Title order={3}>Mi App</Title>
                    </Group>

                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Avatar
                                radius="xl"
                                size="md"
                                color="blue"
                                style={{ cursor: 'pointer' }}
                            >
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>{user?.email}</Menu.Label>
                            <Menu.Item leftSection={<IoPerson size={14} />}>
                                Perfil
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                color="red"
                                leftSection={<IoLogOut size={14} />}
                                onClick={handleLogout}
                            >
                                Cerrar Sesión
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </MantineAppShell.Header>

            <MantineAppShell.Main>{children}</MantineAppShell.Main>
        </MantineAppShell>
    );
}
