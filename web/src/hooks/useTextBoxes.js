import { useCallback } from 'react';
import { usePins } from './usePins';

export const useTextBoxes = () => {
  const { pins: textBoxes, loading, error, savePin, setPins } = usePins();

  const addTextBox = useCallback(async (text = 'brewing') => {
    try {
      // Save to backend first
      await savePin(text);
      // The usePins hook will automatically reload and update the state
    } catch (error) {
      console.error('Failed to save pin:', error);
      // If backend save fails, still add locally as fallback
      const newId = Math.max(...textBoxes.map(b => b.id)) + 1;
      const randomX = Math.random() * (window.innerWidth - 250);
      const randomY = Math.random() * (window.innerHeight - 150);
      
      setPins(prev => [...prev, {
        id: newId,
        text: text,
        x: randomX,
        y: randomY,
        isDragging: false,
        isPersisted: false, // Mark as not saved to backend
      }]);
    }
  }, [savePin, textBoxes, setPins]);

  const updateTextBox = useCallback((boxId, updates) => {
    setPins(prev => prev.map(b => 
      b.id === boxId ? { ...b, ...updates } : b
    ));
  }, [setPins]);

  const updateTextBoxText = useCallback((boxId, newText) => {
    updateTextBox(boxId, { text: newText });
  }, [updateTextBox]);

  const setDragging = useCallback((boxId, isDragging) => {
    updateTextBox(boxId, { isDragging });
  }, [updateTextBox]);

  const updatePosition = useCallback((boxId, x, y) => {
    updateTextBox(boxId, { x, y });
  }, [updateTextBox]);

  const stopAllDragging = useCallback(() => {
    setPins(prev => prev.map(b => ({ ...b, isDragging: false })));
  }, [setPins]);

  return {
    textBoxes,
    loading,
    error,
    addTextBox,
    updateTextBoxText,
    setDragging,
    updatePosition,
    stopAllDragging
  };
}; 