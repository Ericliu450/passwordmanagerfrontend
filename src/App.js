import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EncryptionProvider } from './context/EncryptionContext';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';

// Public pages
import Welcome from './pages/public/Welcome';
import SimpleGenerator from './pages/public/SimpleGenerator';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import RequestReset from './pages/public/RequestReset';
import VerifyToken from './pages/public/VerifyToken';
import ResetPassword from './pages/public/ResetPassword';
import MasterPassword from './pages/public/MasterPassword';

// Protected pages
import Dashboard from './pages/protected/Dashboard';
import AddEditPassword from './pages/protected/AddEditPassword';

function App() {
  return (
    <AuthProvider>
      <EncryptionProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/generator" element={<SimpleGenerator />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/master-password" element={<MasterPassword />} /> 
            <Route path="/reset-password" element={<PublicRoute><RequestReset /></PublicRoute>} />
            <Route path="/verify-token" element={<PublicRoute><VerifyToken /></PublicRoute>} />
            <Route path="/new-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/password/new" element={<ProtectedRoute><AddEditPassword /></ProtectedRoute>} />
            <Route path="/password/edit/:id" element={<ProtectedRoute><AddEditPassword /></ProtectedRoute>} />
          </Routes>
        </Router>
      </EncryptionProvider>
    </AuthProvider>
  );
}

export default App;