import { useState, useCallback, useEffect, useRef } from 'react';

export const useDragAndDrop = (textBoxes, setDragging, updatePosition, stopAllDragging) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragDataRef = useRef({
    boxId: null,
    startMouseX: 0,
    startMouseY: 0,
    startBoxX: 0,
    startBoxY: 0
  });

  const handleMouseDown = useCallback((e, boxId) => {
    e.preventDefault();
    const box = textBoxes.find(b => b.id === boxId);
    if (!box) return;

    // Store initial drag data
    dragDataRef.current = {
      boxId: boxId,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startBoxX: box.x,
      startBoxY: box.y
    };
    
    setIsDragging(true);
    setDragging(boxId, true);
  }, [textBoxes, setDragging]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !dragDataRef.current.boxId) return;

    const dragData = dragDataRef.current;
    
    // Calculate how much the mouse has moved since drag started
    const mouseDeltaX = e.clientX - dragData.startMouseX;
    const mouseDeltaY = e.clientY - dragData.startMouseY;
    
    // Calculate new box position based on initial position + mouse movement
    const newX = dragData.startBoxX + mouseDeltaX;
    const newY = dragData.startBoxY + mouseDeltaY;

    // NO BOUNDARIES - let boxes go anywhere to test
    updatePosition(dragData.boxId, newX, newY);
  }, [isDragging, updatePosition]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      stopAllDragging();
      
      // Clear drag data
      dragDataRef.current = {
        boxId: null,
        startMouseX: 0,
        startMouseY: 0,
        startBoxX: 0,
        startBoxY: 0
      };
    }
  }, [isDragging, stopAllDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    handleMouseDown
  };
}; 