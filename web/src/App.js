import React, { useState, useEffect } from 'react';
import { DraggableTextBox, TextInput } from './components';
import { useTextBoxes, useDragAndDrop } from './hooks';
import './App.css';

function App() {
  const [showInfo, setShowInfo] = useState(false);
  const {
    textBoxes,
    loading,
    error,
    addTextBox,
    setDragging,
    updatePosition,
    stopAllDragging
  } = useTextBoxes();

  const { handleMouseDown } = useDragAndDrop(
    textBoxes,
    setDragging,
    updatePosition,
    stopAllDragging
  );

  const handleAddTextBox = async (text) => {
    await addTextBox(text);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  // Handle escape key to close dialog
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showInfo) {
        closeInfo();
      }
    };

    if (showInfo) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showInfo]);

  if (loading) {
    return (
      <div className="App canvas">
        <div className="loading-state">
          <div className="loading-text">Loading pins...</div>
        </div>
        <div className="twitter-link"> 
          <span className="twitter-message">If it's something private, I'm available at</span>
          <a href="https://twitter.com/whhygee" target="_blank" rel="noopener noreferrer">
            @whhygee
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Fixed UI Elements - Outside scrollable container */}
      {/* Info Button */}
      <button className="info-button" onClick={toggleInfo} title="App Info">
        i
      </button>

      {/* GitHub Button */}
      <a 
        href="https://github.com/yatharthagoenka/bagel/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="github-button"
        title="View on GitHub"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>

      {/* Text Input - Fixed at bottom */}
      <TextInput onSubmit={handleAddTextBox} />
      
      {/* Twitter Link - Fixed at bottom */}
      <div className="twitter-link">
        <span className="twitter-message">If it's something private, I'm available at</span>
        <a href="https://twitter.com/whhygee" target="_blank" rel="noopener noreferrer">
          @whhygee
        </a>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          Failed to load pins: {error}
        </div>
      )}

      {/* Info Dialog */}
      {showInfo && (
        <div className="info-overlay" onClick={closeInfo}>
          <div className="info-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="info-close" onClick={closeInfo}>×</button>
            <h3>TF is this even about?</h3>
            <div className="info-content">
              <div className="info-item">
                <strong>Read everything:</strong>
                <span>Anything anyone says is displayed on the canvas. Nobody's here yet so it's empty, maybe we can have it scroll or some shi later.</span>
              </div>
              <div className="info-item">
                <strong>Rant/Shout/Shitpost:</strong>
                <span>Type whatever the hell in the text box below for it to go up. For now if it goes up, it stays up (unless I delete it lol).</span>
              </div>
              <div className="info-item">
                <strong>Manage existing messages:</strong> 
                <span>Feature to edit and delete messages will be added soon</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Canvas */}
      <div className="App canvas">
        <div className="canvas-content">
          {textBoxes.map(box => (
            <DraggableTextBox
              key={box.id}
              box={box}
              onMouseDown={handleMouseDown}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
