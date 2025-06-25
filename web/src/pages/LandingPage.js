import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import './LandingPage.css';

const LandingPage = () => {
  const [searchUsername, setSearchUsername] = useState('');
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    setSearching(true);

    try {
      const response = await fetch(`/api/user/${searchUsername.trim()}`);
      
      if (response.ok) {
        // User found, navigate to their page
        navigate(`/${searchUsername.trim()}`);
      } else if (response.status === 404) {
        // User not found, still navigate to create the URL
        navigate(`/${searchUsername.trim()}`);
      } else {
        console.error('Search failed');
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleLoginSuccess = () => {
    navigate('/profile');
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter username to search..."
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            onKeyDown={handleKeyPress}
            className="search-input"
            disabled={searching}
            autoFocus
          />
        </div>

        <div className="login-container">
          {isAuthenticated ? (
            <button 
              onClick={() => navigate('/profile')}
              className="profile-button"
            >
              Go to Profile
            </button>
          ) : (
            <GoogleLoginButton onSuccess={handleLoginSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 