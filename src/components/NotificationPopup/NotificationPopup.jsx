import React, { useState, useEffect } from 'react';
import './NotificationPopup.scss';

function NotificationPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already seen and accepted the notification
    const hasAccepted = localStorage.getItem('notificationAccepted') === 'true';
    
    // If they haven't accepted yet, show the popup
    if (!hasAccepted) {
      // Small delay to show the popup for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    // Return undefined if user has already accepted
    return undefined;
  }, []);

  const handleAccept = () => {
    // Store in localStorage so we don't show it again
    localStorage.setItem('notificationAccepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="notification-overlay">
      <div className="notification-popup">
        <div className="notification-content">
          <h3>Welcome to VidPlay</h3>
          <p>Caution: The content on this website use on you own risk. We are not responsible for any damage. The content provided in this website is gathered from the internet and we are not responsible for the content. If you have any question please contact us at atozmovies@protonmail.com</p>
          
          <div className="notification-actions">
            <button 
              type="button" 
              className="accept-button" 
              onClick={handleAccept}
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationPopup; 