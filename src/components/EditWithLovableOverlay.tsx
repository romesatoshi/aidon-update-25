
import React, { useState, useEffect } from 'react';

const EditWithLovableOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Start the fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // Remove from DOM after the fade animation completes
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 2500); // 500ms extra for fade animation

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
      style={{ 
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 500ms ease-out'
      }}
    >
      {/* Optional: You can add a loading spinner or message here */}
    </div>
  );
};

export default EditWithLovableOverlay;
