import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (token in localStorage)
    const storedToken = localStorage.getItem('google_token');
    const storedUser = localStorage.getItem('user_data');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('Restored user data:', parsedUser); // Debug log
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('google_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (googleToken, userData) => {
    console.log('Logging in with user data:', userData); // Debug log
    // Store token and user data
    localStorage.setItem('google_token', googleToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    setToken(googleToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('google_token');
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
  };

  const apiRequest = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }

    return response.json();
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    apiRequest,
    setUser,
    setToken,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 