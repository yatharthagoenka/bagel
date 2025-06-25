import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LinkCard from '../components/LinkCard';
import './UserPage.css';

const UserPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUserData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/user/${username}`);
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 404) {
        setError('User not found');
      } else {
        setError('Failed to load user data');
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  if (loading) {
    return (
      <div className="user-page loading">
        <div className="loading-text">Loading {username}'s links...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-page error">
        <div className="error-container">
          <div className="error-text">{error}</div>
          <button onClick={() => navigate('/')} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const validLinks = user.links?.filter(link => link.title && link.url) || [];

  return (
    <div className="user-page">
      <div className="user-header">
        <h1 className="username">{user.username}</h1>
      </div>

      <div className="links-container">
        {validLinks.length > 0 ? (
          validLinks.map((link, index) => (
            <LinkCard
              key={link.id || index}
              link={link}
              index={index}
              isEditable={false}
            />
          ))
        ) : (
          <div className="no-links">
            No links yet
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage; 