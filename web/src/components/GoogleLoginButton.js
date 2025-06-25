import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { initUser } from '../services/api';

const GoogleLoginButton = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const initializeGoogleSignIn = useCallback(() => {
    if (!window.google) return;

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      callback: handleGoogleResponse,
    });

    // Store the client for later use
    window.googleClient = client;

    // Create a button container for the Google Sign-In button
    const buttonContainer = document.getElementById('google-signin-button');
    if (buttonContainer) {
      buttonContainer.onclick = () => {
        client.requestAccessToken();
      };
    }
  }, []);

  const handleGoogleResponse = useCallback(async (tokenResponse) => {
    try {
      setIsLoading(true);
      setError('');

      if (tokenResponse.error) {
        throw new Error(tokenResponse.error);
      }

      const accessToken = tokenResponse.access_token;

      // Get user info using the access token
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userInfo = await userInfoResponse.json();
      console.log('Google user info:', userInfo); // Debug log
      
      // Initialize user in our backend with the access token
      const response = await initUser(userInfo.email, userInfo.name, accessToken);
      console.log('Backend response:', response); // Debug log
      
      // Create auth user data with Google profile info
      const authUserData = {
        ...response.data.user,
        picture: userInfo.picture // Add Google profile picture URL
      };
      
      // Update auth context with user data and token
      await login(accessToken, authUserData);
      
      // Navigate to profile page
      navigate('/profile');
      
      // Call success callback
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [login, onSuccess, navigate]);

  if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
    return (
      <div className="google-login-error">
        <p>⚠️ Google Client ID not configured</p>
        <p>Set REACT_APP_GOOGLE_CLIENT_ID in your environment</p>
      </div>
    );
  }

  return (
    <div className="google-login-container">
      <button 
        id="google-signin-button"
        className="google-login-button"
        disabled={isLoading}
      >
        <svg className="google-icon" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {isLoading ? 'Signing in...' : 'Login with Google'}
      </button>
      {error && <p className="google-login-error">{error}</p>}
    </div>
  );
};

export default GoogleLoginButton; 