import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/api';
import EditableUsername from '../components/EditableUsername';
import ProfileLayout from '../components/ProfileLayout';
import '../styles/Dialog.css';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserProfile();
        setUserData(response.data.user);
      } catch (error) {
        console.error('Failed to load user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setShowShareDialog(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${userData?.username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLinksUpdate = async (newLinks) => {
    try {
      setError(null);
      const response = await updateUserProfile({ links: newLinks });
      setUserData(response.data.user);
    } catch (error) {
      console.error('Failed to update links:', error);
      setError(error.message);
    }
  };

  const handleUsernameUpdate = async (newUsername) => {
    try {
      setError(null);
      const response = await updateUserProfile({ username: newUsername });
      setUserData(response.data.user);
      setIsEditingUsername(false);
    } catch (error) {
      console.error('Failed to update username:', error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated || !authUser) {
    return null; // Let ProtectedRoute handle the redirect
  }

  // Filter out empty links
  const validLinks = userData?.links?.filter(link => link.title || link.url) || [];

  return (
    <ProfileLayout
      username={userData?.username}
      links={validLinks}
      isLoading={loading}
      error={error}
      isEditable={true}
      onLinksUpdate={handleLinksUpdate}
    >
      <button 
        className="info-button"
        onClick={() => setShowShareDialog(true)}
        aria-label="Show link information"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" 
            fill="currentColor"/>
        </svg>
      </button>

      {showShareDialog && (
        <div className="dialog-overlay" onClick={() => setShowShareDialog(false)}>
          <div className="dialog-content" onClick={e => e.stopPropagation()}>
            <button className="dialog-close" onClick={() => setShowShareDialog(false)}>×</button>
            <h3>What does this do?</h3>
            {userData?.username ? (
              <>
                <p className="dialog-text">
                  Share your profile with others using this link. Click the copy icon to copy it to your clipboard.
                </p>
                <div className="sharable-link-container">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/${userData.username}`}
                    className="sharable-link-input"
                  />
                  <button className="copy-button" onClick={copyToClipboard} title="Copy link">
                    {copied ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                      </svg>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <p className="dialog-text">
                Set a username to get your unique, sharable link. Your profile will be accessible at:<br/>
                <code>{window.location.origin}/your-username</code>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="profile-header">
        <div className="profile-info" onClick={() => setShowUserInfo(!showUserInfo)}>
          <img 
            src={authUser.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || '')}&background=random`} 
            alt={userData?.name} 
            className="profile-avatar" 
          />
          {showUserInfo && (
            <div className="profile-dropdown">
              <div className="profile-details">
                <span className="user-name">{userData?.name}</span>
                <span className="user-email">{userData?.email}</span>
                <button onClick={() => setIsEditingUsername(true)} className="edit-username-button">
                  Edit Username
                </button>
              </div>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditingUsername && (
        <div className="modal-overlay">
          <div className="username-edit-modal">
            <h3>Edit Username</h3>
            <p className="username-warning">
              Warning: Changing your username will update your public profile link.{' '}
              <span className="warning-highlight">No automatic redirects will be set up from your old username.</span>
            </p>
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              placeholder={userData?.username || 'Enter username'}
              className="username-input"
              autoFocus
            />
            <div className="modal-actions">
              <button 
                onClick={() => handleUsernameUpdate(tempUsername.trim())}
                className="save-btn"
                disabled={!tempUsername.trim() || tempUsername.trim() === userData?.username}
              >
                Save
              </button>
              <button 
                onClick={() => {
                  setIsEditingUsername(false);
                  setTempUsername('');
                }} 
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      )}

      <div className="username-section">
        <h1>{userData?.username || 'Set username'}</h1>
      </div>
    </ProfileLayout>
  );
};

export default ProfilePage; 