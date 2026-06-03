import React from 'react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from '../../features/auth/hooks/AuthProvider';
import { Toaster } from 'react-hot-toast';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryProvider>
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#161b27',
            color:      '#f1f5f9',
            border:     '1px solid #1e2535',
            fontSize:   '13px',
          },
          success: { iconTheme: { primary: '#14b8a6', secondary: '#161b27' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#161b27' } },
        }}
      />
    </AuthProvider>
  </QueryProvider>
);