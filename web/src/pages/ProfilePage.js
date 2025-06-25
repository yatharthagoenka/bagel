import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LinkCard from '../components/LinkCard';
import EditableUsername from '../components/EditableUsername';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, isAuthenticated, logout, apiRequest } = useAuth();
  const navigate = useNavigate();
  const [links, setLinks] = useState([
    { id: 1, title: '', url: '', order: 1 },
    { id: 2, title: '', url: '', order: 2 },
    { id: 3, title: '', url: '', order: 3 },
    { id: 4, title: '', url: '', order: 4 },
    { id: 5, title: '', url: '', order: 5 },
    { id: 6, title: '', url: '', order: 6 }
  ]);
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      const data = await apiRequest(`/api/user/${user.id}`);
      if (data.user) {
        setUsername(data.user.username || '');
        if (data.user.links && data.user.links.length > 0) {
          const userLinks = [...data.user.links];
          // Fill remaining slots with empty links
          while (userLinks.length < 5) {
            userLinks.push({
              id: userLinks.length + 1,
              title: '',
              url: '',
              order: userLinks.length + 1
            });
          }
          setLinks(userLinks.slice(0, 5)); // Only show first 5
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, [user?.id, apiRequest]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (user) {
      loadUserData();
    }
  }, [isAuthenticated, navigate, loadUserData, user]);

  const handleUsernameUpdate = async (newUsername) => {
    if (!newUsername.trim()) return;

    try {
      await apiRequest('/api/username', {
        method: 'PUT',
        body: JSON.stringify({ username: newUsername })
      });
      setUsername(newUsername);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      throw new Error(error.message || 'Failed to update username');
    }
  };

  const handleLinkUpdate = (index, field, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };
    setLinks(updatedLinks);
  };

  const handleSaveLinks = async () => {
    setSaving(true);
    setSaveError('');

    try {
      // Filter out empty links
      const validLinks = links
        .filter(link => link.title.trim() || link.url.trim())
        .map((link, index) => ({
          title: link.title.trim(),
          url: link.url.trim(),
          order: index + 1
        }));

      await apiRequest('/api/links', {
        method: 'PUT',
        body: JSON.stringify({ links: validLinks })
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(error.message || 'Failed to save links');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info" onClick={() => setShowUserInfo(!showUserInfo)}>
          <img src={user.picture} alt={user.name} className="profile-avatar" />
          {showUserInfo && (
            <div className="profile-dropdown">
              <div className="profile-details">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-container">
        <div className="username-section">
          <EditableUsername 
            username={username}
            onUpdate={handleUsernameUpdate}
          />
        </div>

        <div className="links-section">
          <div className="link-cards">
            {links.map((link, index) => (
              <LinkCard
                key={link.id}
                link={link}
                index={index}
                onUpdate={handleLinkUpdate}
                isEditable={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 