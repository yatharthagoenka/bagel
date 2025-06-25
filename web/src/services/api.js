// Get the API base URL from environment variables with fallback
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    // If response is not JSON, get the text and include it in the error
    const text = await response.text();
    throw new Error(`Non-JSON response (${response.status}): ${text.substring(0, 100)}...`);
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
};

// Get the Google token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('google_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Initialize user after Google login
export const initUser = async (email, name, token) => {
  // Store the token for future requests
  if (token) {
    localStorage.setItem('google_token', token);
  }

  const response = await fetch(`${API_BASE_URL}/user/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
    body: JSON.stringify({ email, name }),
  });
  return handleResponse(response);
};

// Get public user data by username
export const getUserPublicData = async (username) => {
  const response = await fetch(`${API_BASE_URL}/user/p?username=${encodeURIComponent(username)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

// Get authenticated user data
export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
  });
  return handleResponse(response);
};

// Update user profile (username and/or links)
export const updateUserProfile = async (updates) => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
}; 