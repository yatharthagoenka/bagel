import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/api';
import EditableUsername from '../components/EditableUsername';
import ProfileLayout from '../components/ProfileLayout';
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