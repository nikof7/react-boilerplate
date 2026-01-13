import { useEffect } from 'react';
import { RouterProvider } from 'react-router';

import { router } from './routes';
import { useAuthStore } from './stores/authStore';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  // Inicializar estado de auth al cargar la app
  useEffect(() => {
    initialize();
  }, [initialize]);

  return <RouterProvider router={router} />;
}

export default App;
