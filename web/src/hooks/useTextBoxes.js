import { useCallback } from 'react';
import { usePins } from './usePins';

export const useTextBoxes = () => {
  const { pins: textBoxes, loading, error, savePin, setPins } = usePins();

  const addTextBox = useCallback(async (text = 'brewing') => {
    try {
      await savePin(text);
    } catch (error) {
      console.error('Failed to save pin:', error);
      // The savePin function already adds the pin locally, so no need for fallback here
    }
  }, [savePin]);

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