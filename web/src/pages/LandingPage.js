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
        <div className="hero-section animate-up">
          <h1 className="hero-title animate-title">bagel</h1>
          <p className="hero-subtitle animate-fade-in">Your free link-tree alternative.</p>
          <div className="hero-features animate-fade-in">
            <span className="feature-tag">✨ No Ads</span>
            <span className="feature-tag">🔗 Unlimited Links</span>
            <span className="feature-tag">🖊️ Custom Profile</span>
            <span className="feature-tag">💯 Forever Free</span>
          </div>
        </div>

        <div className="search-container animate-fade-in">
          <input
            type="text"
            placeholder="Search by username" style={{textAlign: 'center'}}
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            onKeyDown={handleKeyPress}
            className="search-input"
            disabled={searching}
            autoFocus
          />
        </div>

        <div className="divider animate-fade-in">
          <span>or</span>
        </div>

        <div className="login-container animate-fade-in">
          <p className="create-text">Create your own</p>
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