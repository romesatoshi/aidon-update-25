import React, { useState, useEffect } from 'react';

const EditWithLovableOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
      style={{ 
        opacity: 1,
        transition: 'opacity 500ms ease-out'
      }}
    >
      {/* Permanent white overlay after initial page load */}
    </div>
  );
};

export default EditWithLovableOverlay;
