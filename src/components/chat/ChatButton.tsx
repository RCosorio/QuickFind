import React, { useEffect } from 'react';
import { FaComment } from 'react-icons/fa';
import { Business } from '../../types/auth';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

interface ChatButtonProps {
  business: Business;
  className?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ business, className = '' }) => {
  const { openChat, activeBusiness } = useChat();
  const { user } = useAuth();
  
  // Debug on mount
  useEffect(() => {
    console.log(`ChatButton for ${business.name} mounted, Business ID: ${business.id}`);
    return () => {
      console.log(`ChatButton for ${business.name} unmounted`);
    };
  }, [business.name, business.id]);
  
  // Debug when activeBusiness changes
  useEffect(() => {
    if (activeBusiness) {
      console.log(`Active business changed to: ${activeBusiness.name} (ID: ${activeBusiness.id})`);
    }
  }, [activeBusiness]);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      console.error("Cannot start chat: User is not logged in");
      alert("Please log in to start a conversation");
      return;
    }
    
    console.log("ChatButton clicked for business:", business.name);
    
    try {
      // First dispatch the event (before state changes)
      const chatEvent = new CustomEvent('chat-opened', { 
        detail: { businessId: business.id }
      });
      
      // Call openChat function which sets the active conversation
      openChat(business);
      
      // Give a small delay before dispatching the event to ensure
      // state changes have been processed
      setTimeout(() => {
        window.dispatchEvent(chatEvent);
        console.log("Dispatched chat-opened event with businessId:", business.id);
        
        // Force visibility of the chat window through DOM manipulation as a fallback
        const chatWindow = document.getElementById('active-chat-window');
        if (chatWindow) {
          chatWindow.style.display = 'flex';
          chatWindow.style.visibility = 'visible';
          chatWindow.style.opacity = '1';
          console.log("Forced chat window visibility via DOM");
        } else {
          console.warn("Could not find chat window element");
        }
      }, 100);
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-1 ${className || 'bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md transition-colors'}`}
      title={`Chat with ${business.name}`}
      data-business-id={business.id}
    >
      <FaComment className="text-sm" />
      <span className="text-sm">Message</span>
    </button>
  );
};

export default ChatButton; 