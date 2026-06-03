import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout   from '../layouts/MainLayout';
import AuthLayout   from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import { Loader } from '../../shared/components/Loader';

const lazy_ = (fn: () => Promise<{ default: React.ComponentType }>) =>
  lazy(fn);

const LoginPage        = lazy_(() => import('../../features/auth/pages/LoginPage'));
const SignupPage       = lazy_(() => import('../../features/auth/pages/SignupPage'));
const DashboardPage    = lazy_(() => import('../../features/dashboard/pages/DashboardPage'));
const ProductsPage     = lazy_(() => import('../../features/products/pages/ProductsPage'));
const CreateProductPage= lazy_(() => import('../../features/products/pages/CreateProductPage'));
const EditProductPage  = lazy_(() => import('../../features/products/pages/EditProductPage'));
const SettingsPage     = lazy_(() => import('../../features/settings/pages/SettingsPage'));

const wrap = (el: React.ReactElement) => (
  <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><Loader /></div>}>
    {el}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',  element: wrap(<LoginPage />) },
      { path: '/signup', element: wrap(<SignupPage />) },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [{
      element: <MainLayout />,
      children: [
        { path: '/',                   element: wrap(<DashboardPage />) },
        { path: '/products',           element: wrap(<ProductsPage />) },
        { path: '/products/new',       element: wrap(<CreateProductPage />) },
        { path: '/products/:id/edit',  element: wrap(<EditProductPage />) },
        { path: '/settings',           element: wrap(<SettingsPage />) },
      ],
    }],
  },
]);