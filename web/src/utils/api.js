// Use different API base URLs for development and production
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:4000/api'  // Local development - direct to Go server
  : '/api';                      // Production - through nginx proxy

export const pinAPI = {
  // Get all pins from the backend
  getAllPins: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data?.pins || [];
    } catch (error) {
      console.error('Error fetching pins:', error);
      throw error;
    }
  },

  // Create a new pin
  createPin: async (message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error creating pin:', error);
      throw error;
    }
  },
}; 