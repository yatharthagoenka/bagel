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
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (googleToken) => {
    try {
      // Verify token with Google and get user info
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${googleToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const googleUser = await response.json();
      
      // Store token and user data
      localStorage.setItem('google_token', googleToken);
      localStorage.setItem('user_data', JSON.stringify(googleUser));
      
      setToken(googleToken);
      setUser(googleUser);

      // Initialize user in our backend
      const initResponse = await fetch('/api/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${googleToken}`
        },
        body: JSON.stringify({
          email: googleUser.email,
          name: googleUser.name
        })
      });

      if (!initResponse.ok) {
        console.warn('Failed to initialize user in backend');
      }

      return googleUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
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
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 