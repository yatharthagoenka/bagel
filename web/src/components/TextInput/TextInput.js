import React, { useState } from 'react';
import './TextInput.css';

export const TextInput = ({ onSubmit }) => {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(inputText.trim());
        setInputText('');
      } catch (error) {
        console.error('Failed to submit:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form className="text-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={isSubmitting ? "saving..." : "spill whatever, really..."}
        className={`text-input ${isSubmitting ? 'submitting' : ''}`}
        disabled={isSubmitting}
      />
    </form>
  );
}; 