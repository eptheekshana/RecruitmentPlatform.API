import React from 'react';

const SkipLink = ({ targetId = 'main-content' }) => {
  return (
    <a href={`#${targetId}`} className="skip-link">
      Skip to main content
    </a>
  );
};

export default SkipLink;
