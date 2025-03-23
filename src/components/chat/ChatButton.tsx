import React from 'react';
import { FaComment } from 'react-icons/fa';
import { Business } from '../../types/auth';
import { useChat } from '../../context/ChatContext';

interface ChatButtonProps {
  business: Business;
  className?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ business, className = '' }) => {
  const chat = useChat();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("ChatButton clicked for business:", business.name);
    console.log("Chat context state before openChat:", chat);
    chat.openChat(business);
    console.log("Chat context state after openChat:", chat);
  };
  
  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-1 ${className || 'bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md transition-colors'}`}
      title={`Chat with ${business.name}`}
    >
      <FaComment className="text-sm" />
      <span className="text-sm">Message</span>
    </button>
  );
};

export default ChatButton; 