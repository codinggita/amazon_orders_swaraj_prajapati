import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('orderpulse_token');
    const storedUser = localStorage.getItem('orderpulse_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('orderpulse_user');
      }
    }
    setLoading(false);
  }, []);

  const persistSession = (newToken, newUser) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('orderpulse_token', newToken);
    }
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('orderpulse_user', JSON.stringify(newUser));
    }
  };

  const updateUser = (partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('orderpulse_user', JSON.stringify(next));
      return next;
    });
  };

  const login = async (data) => {
    try {
      const res = await authAPI.login(data);
      if (res.data?.success) {
        const { accessToken, token: legacyToken, user: newUser } = res.data.data;
        const newToken = accessToken || legacyToken;
        persistSession(newToken, newUser);
        toast.success(res.data.message || 'Logged in successfully');
        return true;
      }
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (data) => {
    try {
      const res = await authAPI.register(data);
      if (res.data?.success) {
        const { accessToken, token: legacyToken, user: newUser } = res.data.data || {};
        const newToken = accessToken || legacyToken;
        if (newToken && newUser) {
          persistSession(newToken, newUser);
        }
        toast.success(res.data.message || 'Registration successful');
        return { success: true, autoLogin: !!(newToken && newUser) };
      }
      return { success: false };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      if (token) await authAPI.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('orderpulse_token');
      localStorage.removeItem('orderpulse_user');
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    token,
    loading,
    isLoggedIn: !!token,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
