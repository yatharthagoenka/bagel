import { useState, useEffect, useCallback } from 'react';
import { pinAPI } from '../utils/api';

export const usePins = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert backend pins to text boxes with positions
  const pinsToTextBoxes = useCallback((backendPins) => {
    return backendPins.map((pin, index) => ({
      id: index + 1,
      text: pin.message,
      x: Math.random() * Math.max(100, window.innerWidth - 250),
      y: Math.random() * Math.max(100, window.innerHeight - 150),
      isDragging: false,
      isPersisted: true, // Mark as saved to backend
    }));
  }, []);

  // Load pins from backend
  const loadPins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const backendPins = await pinAPI.getAllPins();
      const textBoxes = pinsToTextBoxes(backendPins);
      setPins(textBoxes);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load pins:', err);
      // Fallback to default pin if API fails
      setPins([{
        id: 1,
        text: 'brewing',
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 40,
        isDragging: false,
        isPersisted: false,
      }]);
    } finally {
      setLoading(false);
    }
  }, [pinsToTextBoxes]);

  // Save a new pin to backend
  const savePin = useCallback(async (message) => {
    try {
      // First, add the pin locally for immediate feedback
      const newId = Math.max(0, ...pins.map(p => p.id)) + 1;
      const newPin = {
        id: newId,
        text: message,
        x: Math.random() * Math.max(100, window.innerWidth - 250),
        y: Math.random() * Math.max(100, window.innerHeight - 150),
        isDragging: false,
        isPersisted: false, // Mark as not yet saved
      };
      
      // Add to local state immediately
      setPins(prev => [...prev, newPin]);
      
      // Then save to backend
      await pinAPI.createPin(message);
      
      // Mark as persisted (don't reload all pins)
      setPins(prev => prev.map(pin => 
        pin.id === newId ? { ...pin, isPersisted: true } : pin
      ));
      
      return true;
    } catch (err) {
      setError(err.message);
      // If backend save fails, keep the pin locally but mark as not persisted
      console.error('Failed to save pin to backend:', err);
      throw err;
    }
  }, [pins]);

  // Load pins on component mount
  useEffect(() => {
    loadPins();
  }, [loadPins]);

  return {
    pins,
    loading,
    error,
    loadPins,
    savePin,
    setPins, // For local updates like dragging
  };
}; 