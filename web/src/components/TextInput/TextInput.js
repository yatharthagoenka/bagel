import React, { useState } from 'react';
import './TextInput.css';

export const TextInput = ({ onSubmit }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSubmit(inputText.trim());
      setInputText('');
    }
  };

  return (
    <form className="text-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="spill whatever, really..."
        className="text-input"
      />
    </form>
  );
}; 