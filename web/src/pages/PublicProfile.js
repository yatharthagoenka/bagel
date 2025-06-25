import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserPublicData } from '../services/api';
import ProfileLayout from '../components/ProfileLayout';
import './PublicProfile.css';

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserPublicData(username);
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  // Filter out empty links
  const validLinks = userData?.links?.filter(link => link.title || link.url) || [];

  return (
    <ProfileLayout
      username={userData?.username}
      links={validLinks}
      isLoading={loading}
      error={error}
      isEditable={false}
    >
      <div className="profile-header">
        <button onClick={() => navigate('/')} className="home-button">
          <svg viewBox="0 0 24 24" className="home-icon">
            <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
      </div>

      <div className="username-section">
        <h1>{userData?.username || username}</h1>
      </div>
    </ProfileLayout>
  );
};

export default PublicProfile; 