import { createBrowserRouter } from 'react-router';

import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
]);
