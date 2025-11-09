import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔄 Starting login process...');
      const response = await authAPI.login(email, password);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      console.log('✅ Login successful!');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Login error details:', {
        message: error.message,
        response: error.response?.data
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed - check console for details';
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  const signup = async (username, email, password) => {
    try {
      console.log('🔄 Starting signup process...');
      const response = await authAPI.signup(username, email, password);

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      console.log('✅ Signup successful!');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Signup error details:', {
        message: error.message,
        response: error.response?.data
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Signup failed - check console for details';
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}