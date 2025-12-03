import React, { createContext, useState, useEffect, useCallback } from 'react';
import { mockAuthService } from '../services/mockService';
import { getToken, setToken, clearToken } from '../utils/token';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getToken();
      if (savedToken) {
        try {
          const result = await mockAuthService.getMe(savedToken);
          if (result.success) {
            setUser(result.data.user);
            setTokenState(savedToken);
          } else {
            clearToken();
            setTokenState(null);
            setUser(null);
          }
        } catch (err) {
          console.error('Auth initialization failed:', err);
          clearToken();
          setTokenState(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signup = useCallback(async (name, email, password) => {
    try {
      setError(null);
      const result = await mockAuthService.signup(name, email, password);

      if (result.success) {
        const { token: newToken, user: newUser } = result.data;
        setToken(newToken);
        setTokenState(newToken);
        setUser(newUser);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const signin = useCallback(async (email, password) => {
    try {
      setError(null);
      const result = await mockAuthService.signin(email, password);

      if (result.success) {
        const { token: newToken, user: newUser } = result.data;
        setToken(newToken);
        setTokenState(newToken);
        setUser(newUser);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'Signin failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const signout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    signin,
    signout,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
