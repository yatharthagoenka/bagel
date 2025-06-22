import React, { useRef } from 'react';
import './DraggableTextBox.css';

export const DraggableTextBox = ({ box, onMouseDown }) => {
  const textRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!textRef.current || box.isDragging) return;
    
    const rect = textRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = Math.max(-8, Math.min(8, (mouseY / rect.height) * -12));
    const rotateY = Math.max(-8, Math.min(8, (mouseX / rect.width) * 12));
    
    textRef.current.style.setProperty('--mouse-x', `${rotateY}deg`);
    textRef.current.style.setProperty('--mouse-y', `${rotateX}deg`);
  };

  const handleMouseLeave = () => {
    if (textRef.current && !box.isDragging) {
      textRef.current.style.setProperty('--mouse-x', '0deg');
      textRef.current.style.setProperty('--mouse-y', '0deg');
    }
  };

  return (
    <div
      className={`draggable-text-box ${box.isDragging ? 'dragging' : ''} ${!box.isPersisted ? 'not-persisted' : ''}`}
      style={{
        left: `${box.x}px`,
        top: `${box.y}px`,
      }}
      onMouseDown={(e) => onMouseDown(e, box.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={textRef}
      title={!box.isPersisted ? "This pin is only saved locally" : ""}
    >
      {!box.isPersisted && (
        <div className="unsaved-indicator">!</div>
      )}
      <span className="text-content">{box.text}</span>
    </div>
  );
}; 