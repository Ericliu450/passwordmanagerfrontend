import { createBrowserRouter } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';

// Public pages
import Welcome from '../pages/public/Welcome';
import SimpleGenerator from '../pages/public/SimpleGenerator';
import Login from '../pages/public/Login';
import Signup from '../pages/public/Signup';
import MasterPassword from '../pages/public/MasterPassword';
import RequestReset from '../pages/public/RequestReset';
import VerifyToken from '../pages/public/VerifyToken';
import ResetPassword from '../pages/public/ResetPassword';

// Protected pages
import Dashboard from '../pages/protected/Dashboard';
import ViewPassword from '../pages/protected/ViewPassword';
import AddEditPassword from '../pages/protected/AddEditPassword';

export const router = createBrowserRouter([
  // Public routes (accessible without auth)
  {
    path: '/',
    element: <Welcome />
  },
  {
    path: '/generator',
    element: <SimpleGenerator />
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    )
  },
  {
    path: '/master-password',
    element: (
      <PublicRoute>
        <MasterPassword />
      </PublicRoute>
    )
  },
  {
    path: '/reset-password',
    element: (
      <PublicRoute>
        <RequestReset />
      </PublicRoute>
    )
  },
  {
    path: '/verify-token',
    element: (
      <PublicRoute>
        <VerifyToken />
      </PublicRoute>
    )
  },
  {
    path: '/new-password',
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    )
  },

  // Protected routes (require authentication)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/password/new',
    element: (
      <ProtectedRoute>
        <AddEditPassword />
      </ProtectedRoute>
    )
  },
  {
    path: '/password/edit/:id',
    element: (
      <ProtectedRoute>
        <AddEditPassword />
      </ProtectedRoute>
    )
  },
  
  // Catch all - redirect to home
  {
    path: '*',
    element: <Welcome />
  }
]);

export default router;