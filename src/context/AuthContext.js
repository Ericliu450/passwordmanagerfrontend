import React, { createContext, useState, useEffect, useCallback } from 'react';
import AuthService from '../services/auth';
import { userAPI } from '../services/api';
import { passwordResetAPI } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tempAuth, setTempAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore auth state from localStorage on initial load
  useEffect(() => {
    const storedUser = AuthService.getUser();
    const storedTempAuth = sessionStorage.getItem('tempAuth');
    
    if (storedUser) {
      setUser(storedUser);
    }
    if (storedTempAuth) {
      setTempAuth(JSON.parse(storedTempAuth));
    }
    setLoading(false);
  }, []);

  // Save tempAuth to sessionStorage when it changes
  useEffect(() => {
    if (tempAuth) {
      sessionStorage.setItem('tempAuth', JSON.stringify(tempAuth));
    } else {
      sessionStorage.removeItem('tempAuth');
    }
  }, [tempAuth]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await userAPI.login(email, password);
      
      // Store token but don't set full user auth yet
      AuthService.setToken(response.token);
      setTempAuth({ email: response.email });
      
      return { success: true };
    } catch (error) {
      AuthService.clear();
      setTempAuth(null);
      return { success: false, error: error.message };
    }
  }, []);

  const signup = useCallback(async (email, password) => {
    try {
      const response = await userAPI.signup(email, password);
      
      // Store token but don't set full user auth yet
      AuthService.setToken(response.token);
      setTempAuth({ email: response.email });
      
      return { success: true };
    } catch (error) {
      AuthService.clear();
      setTempAuth(null);
      return { success: false, error: error.message };
    }
  }, []);

  const finalizeMasterPasswordSetup = useCallback((email) => {
    // Set full authentication after master password verification
    const userData = { email };
    setUser(userData);
    AuthService.setUser(userData);
    setTempAuth(null); // Clear temporary auth state
  }, []);

  const logout = useCallback(async () => {
    try {
      await userAPI.logout();
    } finally {
      AuthService.clear();
      sessionStorage.removeItem('tempAuth');
      setUser(null);
      setTempAuth(null);
    }
  }, []);

  const clearTempAuth = useCallback(() => {
    setTempAuth(null);
    sessionStorage.removeItem('tempAuth');
  }, []);
  
  // Provide auth state and functions to children
  const value = {
    user,
    tempAuth,
    isAuthenticated: !!user,
    hasTempAuth: !!tempAuth,
    login,
    signup,
    logout,
    finalizeMasterPasswordSetup,
    clearTempAuth,
    loading
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}