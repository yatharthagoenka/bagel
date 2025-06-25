import React from 'react';
import LinkCard from './LinkCard';
import { MIN_LINK_CARDS } from '../utils/linkUtils';
import './ProfileLayout.css';

const ProfileLayout = ({ 
  username, 
  links = [], 
  isLoading, 
  error, 
  isEditable, 
  onLinksUpdate,
  children 
}) => {
  const handleUpdateLink = (updatedLink, index) => {
    const newLinks = [...links];
    newLinks[index] = updatedLink;
    onLinksUpdate(newLinks.filter(link => link.title || link.url));
  };

  const handleDeleteLink = (index) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    onLinksUpdate(newLinks.filter(link => link.title || link.url));
  };

  const handleAddLink = () => {
    onLinksUpdate([...links, { title: '', url: '' }]);
  };

  // Calculate how many empty cards we need to show
  const totalCards = Math.max(MIN_LINK_CARDS, links.length + 1);
  const emptyCards = Array(totalCards - links.length).fill({ title: '', url: '' });

  if (isLoading) {
    return (
      <div className="profile-layout">
        {children}
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-layout">
        {children}
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-layout">
      {children}
      <div className={`links-grid ${!isEditable ? 'centered' : ''}`}>
        {links.map((link, index) => (
          <LinkCard
            key={`link-${index}`}
            link={link}
            isReadOnly={!isEditable}
            onUpdate={(updatedLink) => handleUpdateLink(updatedLink, index)}
            onDelete={() => handleDeleteLink(index)}
          />
        ))}
        {isEditable && emptyCards.map((_, index) => (
          <LinkCard
            key={`empty-${index}`}
            link={{ title: '', url: '' }}
            isReadOnly={false}
            onUpdate={(newLink) => {
              if (newLink.title || newLink.url) {
                handleUpdateLink(newLink, links.length + index);
              }
            }}
            isPlaceholder={true}
            onDelete={() => {}}
          />
        ))}
      </div>
      {isEditable && (
        <div className="cmd-click-hint">
          Tip: Use ⌘+Click (Mac) or Ctrl+Click (Windows) to open links in a new tab
        </div>
      )}
    </div>
  );
};

export default ProfileLayout; 