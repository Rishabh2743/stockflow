import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './app/providers/AppProvider';
import { router } from './app/router';

const App: React.FC = () => (
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
);

export default App;