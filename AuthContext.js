import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const userData = await authService.getMe();
          setUser(userData.data);
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, senha) => {
    try {
      setError(null);
      
      const response = await authService.login(email, senha);
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      return true;
    } catch (err) {
      console.error('Erro de login:', err);
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
