'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, DataProvider, ToastProvider, ThemeProvider } from '@/context';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 60000 },
      mutations: { retry: 1 },
    },
  }));

  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <DataProvider>
            <ToastProvider>{children}</ToastProvider>
          </DataProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
