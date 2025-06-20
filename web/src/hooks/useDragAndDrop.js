import { useState, useCallback, useEffect } from 'react';

export const useDragAndDrop = (textBoxes, setDragging, updatePosition, stopAllDragging) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e, boxId) => {
    e.preventDefault();
    const box = textBoxes.find(b => b.id === boxId);
    if (!box) return;

    const offsetX = e.clientX - box.x;
    const offsetY = e.clientY - box.y;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDragging(boxId, true);
  }, [textBoxes, setDragging]);

  const handleMouseMove = useCallback((e) => {
    const draggingBox = textBoxes.find(b => b.isDragging);
    if (!draggingBox) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Constrain to viewport boundaries
    const boxWidth = 150;
    const boxHeight = 50;
    const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - boxWidth));
    const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - boxHeight));

    updatePosition(draggingBox.id, constrainedX, constrainedY);
  }, [textBoxes, dragOffset, updatePosition]);

  const handleMouseUp = useCallback(() => {
    stopAllDragging();
  }, [stopAllDragging]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    handleMouseDown
  };
}; 