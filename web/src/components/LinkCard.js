import React, { useState } from 'react';
import './LinkCard.css';

const LinkCard = ({ link, index, onUpdate, isEditable = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(link.title || '');
  const [tempUrl, setTempUrl] = useState(link.url || '');

  const handleEdit = () => {
    setTempTitle(link.title || '');
    setTempUrl(link.url || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(index, 'title', tempTitle);
    onUpdate(index, 'url', tempUrl);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTitle(link.title || '');
    setTempUrl(link.url || '');
    setIsEditing(false);
  };

  const handleUrlClick = (e) => {
    if (!link.url) {
      e.preventDefault();
      return;
    }
    
    let url = link.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isEmpty = !link.title && !link.url;

  if (isEditable) {
    if (isEditing) {
      return (
        <div className="link-card editing">
          <div className="card-header">
            <span className="card-number">{index + 1}</span>
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
          <div className="card-content">
            <input
              type="text"
              placeholder="Link title"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="title-input"
            />
            <input
              type="text"
              placeholder="https://example.com"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              className="url-input"
            />
          </div>
        </div>
      );
    }

    return (
      <div className={`link-card editable ${isEmpty ? 'empty' : ''}`}>
        <div className="card-header">
          <span className="card-number">{index + 1}</span>
          <button onClick={handleEdit} className="edit-btn">
            {isEmpty ? 'Add Link' : 'Edit'}
          </button>
        </div>
        <div className="card-content" onClick={isEmpty ? handleEdit : undefined}>
          {isEmpty ? (
            <div className="empty-state">
              <div className="empty-icon">+</div>
              <p>Click to add a link</p>
            </div>
          ) : (
            <>
              <h3 className="link-title">{link.title}</h3>
              <p className="link-url">{link.url}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Display-only mode for public pages - styled like old draggable text boxes
  if (isEmpty) {
    return null; // Don't show empty cards on public pages
  }

  return (
    <div className="text-box" onClick={handleUrlClick}>
      <div className="text-box-content">
        <h3 className="text-box-title">{link.title}</h3>
        <p className="text-box-url">{link.url}</p>
      </div>
    </div>
  );
};

export default LinkCard; 