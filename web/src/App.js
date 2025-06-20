import React from 'react';
import { DraggableTextBox, TextInput } from './components';
import { useTextBoxes, useDragAndDrop } from './hooks';
import './App.css';

function App() {
  const {
    textBoxes,
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

  return (
    <div className="App canvas">
      {textBoxes.map(box => (
        <DraggableTextBox
          key={box.id}
          box={box}
          onMouseDown={handleMouseDown}
          onUpdateText={updateTextBoxText}
        />
      ))}
      
      <TextInput onSubmit={addTextBox} />
      
      <div className="twitter-link">
        <a href="https://twitter.com/whhygee" target="_blank" rel="noopener noreferrer">
          @whhygee
        </a>
      </div>
    </div>
  );
}

export default App;
