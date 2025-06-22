import { useState, useEffect, useCallback } from 'react';
import { pinAPI } from '../utils/api';

export const usePins = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate position within canvas bounds, respecting top/bottom boundaries
  const generateSafePosition = useCallback((index = 0) => {
    const boxWidth = 200; // Approximate text box width
    const boxHeight = 100; // Approximate text box height
    
    // Define boundaries - respect top and bottom, but allow full width
    const topMargin = 80;    // Safe margin from top (below fixed buttons)
    const bottomMargin = 180; // Safe margin from bottom (above text input)
    const leftMargin = 20;   // Small margin from left edge
    const rightMargin = 20;  // Small margin from right edge
    
    // Calculate safe bounds
    const minX = leftMargin;
    const maxX = window.innerWidth - boxWidth - rightMargin; // Use full viewport width
    const minY = topMargin;
    const maxY = window.innerHeight - boxHeight - bottomMargin;
    
    // Calculate available space for positioning
    const availableWidth = maxX - minX;
    const availableHeight = maxY - minY;
    
    // Simple grid layout - calculate how many columns we can fit
    const cols = Math.floor(availableWidth / (boxWidth + 10)); // 10px spacing between boxes
    const rows = Math.floor(availableHeight / (boxHeight + 10)); // 10px spacing between boxes
    
    // Calculate grid position
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    // If we exceed the grid vertically, wrap to next "page" horizontally
    const pageWidth = availableWidth + 50; // Add some spacing between pages
    const page = Math.floor(row / rows);
    const wrappedRow = row % rows;
    
    // Calculate actual position
    const x = minX + col * (boxWidth + 10) + page * pageWidth;
    const y = minY + wrappedRow * (boxHeight + 10);
    
    return { x, y };
  }, []);

  // Convert backend pins to text boxes with positions
  const pinsToTextBoxes = useCallback((backendPins) => {
    return backendPins.map((pin, index) => {
      const position = generateSafePosition(index);
      return {
        id: index + 1,
        text: pin.message,
        x: position.x,
        y: position.y,
        isDragging: false,
        isPersisted: true, // Mark as saved to backend
      };
    });
  }, [generateSafePosition]);

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
      // Fallback to 20 sample pins if API fails
      const sampleMessages = [
        'brewing',
        'thinking out loud',
        'random thoughts',
        'coffee break',
        'work in progress',
        'debugging life',
        'late night coding',
        'weekend vibes',
        'monday blues',
        'quick note',
        'brain dump',
        'creative block',
        'eureka moment',
        'food for thought',
        'music playing',
        'deep focus',
        'scattered ideas',
        'perfect timing',
        'almost there',
        'final thoughts'
      ];
      
      const samplePins = sampleMessages.map((message, index) => {
        const position = generateSafePosition(index);
        return {
          id: index + 1,
          text: message,
          x: position.x,
          y: position.y,
          isDragging: false,
          isPersisted: false, // Mark as sample data
        };
      });
      
      setPins(samplePins);
    } finally {
      setLoading(false);
    }
  }, [pinsToTextBoxes, generateSafePosition]);

  // Save a new pin to backend
  const savePin = useCallback(async (message) => {
    try {
      // First, add the pin locally for immediate feedback
      const newId = Math.max(0, ...pins.map(p => p.id)) + 1;
      const position = generateSafePosition(pins.length); // Use current pins length as index
      const newPin = {
        id: newId,
        text: message,
        x: position.x,
        y: position.y,
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
  }, [pins, generateSafePosition]);

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