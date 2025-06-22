import React from 'react';
import { DraggableTextBox, TextInput } from './components';
import { useTextBoxes, useDragAndDrop } from './hooks';
import './App.css';

function App() {
  const {
    textBoxes,
    loading,
    error,
    addTextBox,
    updateTextBoxText,
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
    <div className="App canvas">
      {error && (
        <div className="error-message">
          Failed to load pins: {error}
        </div>
      )}
      
      {textBoxes.map(box => (
        <DraggableTextBox
          key={box.id}
          box={box}
          onMouseDown={handleMouseDown}
          onUpdateText={updateTextBoxText}
        />
      ))}
      
      <TextInput onSubmit={handleAddTextBox} />
      
      <div className="twitter-link">
        <span className="twitter-message">If it's something private, I'm available at</span>
        <a href="https://twitter.com/whhygee" target="_blank" rel="noopener noreferrer">
          @whhygee
        </a>
      </div>
    </div>
  );
}

export default App;
