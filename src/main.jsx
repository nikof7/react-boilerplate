import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './lib/react-query';
import App from './App.jsx';

// Mantine styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

// dayjs locale
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications position="top-right" />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
