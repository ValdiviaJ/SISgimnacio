import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted session
    const savedUser = localStorage.getItem('fitflow_user');
    const savedToken = localStorage.getItem('fitflow_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      
      localStorage.setItem('fitflow_token', token);
      localStorage.setItem('fitflow_user', JSON.stringify(user));
      setUser(user);
      setLoading(false);
      return { success: true, user };
    } catch (err) {
      setLoading(false);
      const errorMsg = err.response?.data?.message || err.message || 'Error de conexión';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      localStorage.removeItem('fitflow_token');
      localStorage.removeItem('fitflow_user');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
