import React, { useState, useEffect, useRef } from 'react';
import { getLinkIcon } from '../utils/linkUtils';
import './LinkCard.css';

const LinkCard = ({ link, isReadOnly, onUpdate, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(link.title);
  const [tempUrl, setTempUrl] = useState(link.url);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    onUpdate({ ...link, title: tempTitle.trim(), url: tempUrl.trim() });
    setIsEditing(false);
    setShowDropdown(false);
  };

  const handleCancel = () => {
    setTempTitle(link.title);
    setTempUrl(link.url);
    setIsEditing(false);
    setShowDropdown(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleCardClick = (e) => {
    if (isReadOnly) {
      let url = link.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (!isReadOnly && !isEditing) {
      e.preventDefault();
      if (e.metaKey || e.ctrlKey) {
        // Open in new tab on cmd/ctrl + click
        let url = link.url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // Show dropdown menu on regular click
        setShowDropdown(!showDropdown);
      }
    }
  };

  const handleContextMenu = (e) => {
    if (!isReadOnly) {
      e.preventDefault();
      setShowDropdown(!showDropdown);
    }
  };

  const icon = getLinkIcon(link.url);

  if (!link.title && !link.url) {
    return (
      <>
        <div 
          className="link-card empty" 
          onClick={() => setIsEditing(true)}
        >
          <div className="add-icon">+</div>
        </div>
        {isEditing && !isReadOnly && (
          <div className="modal-overlay">
            <div className="link-card editing">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter title"
                className="link-input"
                autoFocus
              />
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter URL"
                className="link-input"
              />
              <div className="link-actions">
                <button onClick={handleSave} className="save-btn">
                  Save
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div 
        className={`link-card ${isReadOnly ? 'clickable' : ''}`} 
        onClick={handleCardClick}
        onContextMenu={handleContextMenu}
      >
        <div className="link-content">
          <div className="link-icon">
            {icon}
          </div>
          <h3 className="link-title">
            {link.title || 'Untitled'}
            {link.title && link.title.length > 15 && (
              <span className="link-title-tooltip">{link.title}</span>
            )}
          </h3>
        </div>
        {!isReadOnly && showDropdown && (
          <div className="link-dropdown" ref={dropdownRef}>
            <button onClick={() => setIsEditing(true)} className="dropdown-btn">
              <span className="dropdown-icon">✎</span>
              Edit
            </button>
            <button onClick={() => window.open(link.url, '_blank')} className="dropdown-btn">
              <span className="dropdown-icon">🔗</span>
              Open link
            </button>
            <button onClick={() => navigator.clipboard.writeText(link.url)} className="dropdown-btn">
              <span className="dropdown-icon">📋</span>
              Copy
            </button>
            <button onClick={() => onDelete()} className="dropdown-btn delete">
              <span className="dropdown-icon">🗑</span>
              Delete
            </button>
          </div>
        )}
      </div>
      {isEditing && !isReadOnly && (
        <div className="modal-overlay">
          <div className="link-card editing">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter title"
              className="link-input"
              autoFocus
            />
            <input
              type="url"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter URL"
              className="link-input"
            />
            <div className="link-actions">
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkCard; 