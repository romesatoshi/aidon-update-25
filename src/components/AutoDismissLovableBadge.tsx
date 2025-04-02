
import { useEffect } from "react";

/**
 * AutoDismissLovableBadge component
 * 
 * This component automatically dismisses the "Edit with Lovable" badge
 * that appears on the page by triggering a click on its close button
 * shortly after the page loads
 */
const AutoDismissLovableBadge = () => {
  useEffect(() => {
    // Wait for the DOM to fully load and the badge to appear
    const timeoutId = setTimeout(() => {
      // Target the close button on the Lovable badge
      // The exact selector might need adjustment based on the actual badge HTML structure
      const closeButtons = document.querySelectorAll('button[aria-label="Close"]');
      
      // Look for buttons that might be part of the Lovable badge
      closeButtons.forEach(button => {
        // Only click if it appears to be from the Lovable badge
        const isLovableBadgeButton = 
          button.closest('[class*="lovable"]') || 
          button.closest('[id*="lovable"]') ||
          Array.from(button.parentElement?.children || []).some(el => 
            el.textContent?.toLowerCase().includes('lovable') || 
            el.textContent?.toLowerCase().includes('edit with')
          );
          
        if (isLovableBadgeButton) {
          // Click the button to dismiss the badge
          (button as HTMLButtonElement).click();
          console.log('Auto-dismissed Lovable badge');
        }
      });
    }, 2000); // Wait 2 seconds for the badge to appear

    return () => clearTimeout(timeoutId);
  }, []);

  return null; // This component doesn't render anything
};

export default AutoDismissLovableBadge;
