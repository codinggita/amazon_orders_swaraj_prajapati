import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectUser, 
  selectIsLoggedIn, 
  selectIsAdmin, 
  selectAuthLoading, 
  loginUser, 
  registerUser, 
  logoutUser,
  setUser
} from '../store/slices/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  const user       = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAdmin    = useSelector(selectIsAdmin);
  const loading    = useSelector(selectAuthLoading);

  const login = async (data) => {
    const result = await dispatch(loginUser(data));
    return loginUser.fulfilled.match(result);
  };

  const register = async (data) => {
    const result = await dispatch(registerUser(data));
    return { success: registerUser.fulfilled.match(result) };
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const updateUser = (partial) => {
    dispatch(setUser({ ...user, ...partial }));
  };

  const setOAuthSession = (accessToken, userData, refreshToken) => {
    // Basic compatibility wrapper for OAuth
    localStorage.setItem('orderpulse_token', accessToken);
    localStorage.setItem('orderpulse_user',  JSON.stringify(userData));
    if (refreshToken) localStorage.setItem('orderpulse_refresh_token', refreshToken);
    dispatch(setUser(userData));
  };

  const value = {
    user,
    token: localStorage.getItem('orderpulse_token'),
    loading,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
    updateUser,
    setOAuthSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
