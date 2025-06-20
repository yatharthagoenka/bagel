import { useState, useCallback } from 'react';

export const useTextBoxes = () => {
  const [textBoxes, setTextBoxes] = useState([
    { 
      id: 1, 
      text: 'brewing', 
      x: window.innerWidth / 2 - 100, 
      y: window.innerHeight / 2 - 40, 
      isDragging: false 
    }
  ]);

  const addTextBox = useCallback((text = 'brewing') => {
    const newId = Math.max(...textBoxes.map(b => b.id)) + 1;
    const randomX = Math.random() * (window.innerWidth - 150);
    const randomY = Math.random() * (window.innerHeight - 150);
    
    setTextBoxes(prev => [...prev, {
      id: newId,
      text: text,
      x: randomX,
      y: randomY,
      isDragging: false
    }]);
  }, [textBoxes]);

  const updateTextBox = useCallback((boxId, updates) => {
    setTextBoxes(prev => prev.map(b => 
      b.id === boxId ? { ...b, ...updates } : b
    ));
  }, []);

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
    setTextBoxes(prev => prev.map(b => ({ ...b, isDragging: false })));
  }, []);

  return {
    textBoxes,
    addTextBox,
    updateTextBoxText,
    setDragging,
    updatePosition,
    stopAllDragging
  };
}; 