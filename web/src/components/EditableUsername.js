import React, { useState } from 'react';
import './EditableUsername.css';

const EditableUsername = ({ username, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setTempUsername(username || '');
    setError('');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!tempUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }

    if (tempUsername === username) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    setError('');

    try {
      await onUpdate(tempUsername.trim());
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTempUsername(username || '');
    setError('');
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="editable-username editing">
        <input
          type="text"
          value={tempUsername}
          onChange={(e) => setTempUsername(e.target.value)}
          onKeyDown={handleKeyPress}
          className="username-input"
          placeholder="Enter your username"
          autoFocus
          disabled={saving}
        />
        <div className="edit-actions">
          <button 
            onClick={handleSave} 
            disabled={saving || !tempUsername.trim()}
            className="save-btn"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={handleCancel} 
            disabled={saving}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
        {error && <p className="username-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="editable-username">
      <div className="username-display" onClick={handleEdit}>
        {username ? (
          <>
            <span className="username">{username}</span>
            <span className="edit-icon">✏️</span>
          </>
        ) : (
          <>
            <span className="placeholder">set username</span>
            <span className="edit-icon">✏️</span>
          </>
        )}
      </div>
    </div>
  );
};

export default EditableUsername; 