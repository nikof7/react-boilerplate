import {
    AppShell as MantineAppShell,
    Burger,
    Group,
    Title,
    Avatar,
    Menu,
    ActionIcon,
    useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IoLogOut, IoPerson, IoSunny, IoMoon } from 'react-icons/io5';
import { useNavigate } from 'react-router';

import { useAuthStore } from '../../stores/authStore';

export function AppShell({ children }) {
    const [opened, { toggle }] = useDisclosure();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
                        <Title order={3}>
                            Mi App
                        </Title>
                    </Group>

                    <Group>
                        <ActionIcon
                            variant="light"
                            size="lg"
                            radius="md"
                            onClick={toggleColorScheme}
                        >
                            {colorScheme === 'dark' ? <IoSunny size={20} /> : <IoMoon size={20} />}
                        </ActionIcon>

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
                </Group>
            </MantineAppShell.Header>

            <MantineAppShell.Main>{children}</MantineAppShell.Main>
        </MantineAppShell>
    );
}