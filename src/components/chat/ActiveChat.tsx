import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaTimes, FaRegSmile } from 'react-icons/fa';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

const predefinedMessages = [
  "Hi! I'm interested in your business. Can you provide more information?",
  "What are your operating hours this weekend?",
  "Do you offer student discounts?",
  "How can I make a reservation?",
  "Is there parking available nearby?"
];

const ActiveChat: React.FC = () => {
  const { activeConversation, activeBusiness, conversations, closeChat, sendMessage, markConversationAsRead } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [showPredefinedMessages, setShowPredefinedMessages] = useState(false);
  const [visible, setVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  
  // Find the current conversation and its messages
  const currentConversation = activeConversation 
    ? conversations.find(conv => conv.id === activeConversation) 
    : null;
    
  const messages = currentConversation?.messages || [];
  
  // Set visible to true after a short delay
  useEffect(() => {
    console.log('ActiveChat effect: activeBusiness changed to:', activeBusiness?.name);
    console.log('ActiveChat effect: activeConversation changed to:', activeConversation);
    
    if (activeBusiness && activeConversation && user) {
      console.log('Setting visible to true for business:', activeBusiness.name);
      setVisible(true);
      
      // Force visibility through DOM as well
      if (chatWindowRef.current) {
        chatWindowRef.current.style.display = 'flex';
        chatWindowRef.current.style.visibility = 'visible';
        chatWindowRef.current.style.opacity = '1';
      }
    } else {
      setVisible(false);
    }
  }, [activeBusiness, activeConversation, user]);
  
  // Listen for chat-opened event
  useEffect(() => {
    const handleChatOpened = (e: any) => {
      console.log('chat-opened event received with detail:', e.detail);
      setVisible(true);
      
      // Force visibility through DOM
      if (chatWindowRef.current) {
        chatWindowRef.current.style.display = 'flex';
        chatWindowRef.current.style.visibility = 'visible';
        chatWindowRef.current.style.opacity = '1';
        console.log('Force applied visibility in event handler');
      }
    };

    window.addEventListener('chat-opened', handleChatOpened);
    
    return () => {
      window.removeEventListener('chat-opened', handleChatOpened);
    };
  }, []);
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Mark conversation as read when opened
  useEffect(() => {
    if (activeConversation) {
      markConversationAsRead(activeConversation);
    }
  }, [activeConversation, markConversationAsRead]);
  
  // If there's no active business or conversation, render nothing
  // but maintain the DOM node for direct manipulation
  if (!activeBusiness || !activeConversation || !user) {
    return (
      <div 
        ref={chatWindowRef}
        id="active-chat-window"
        className="chat-popup"
        style={{ display: 'none' }}
      ></div>
    );
  }
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    sendMessage(newMessage);
    setNewMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handlePredefinedMessage = (message: string) => {
    setNewMessage(message);
    setShowPredefinedMessages(false);
  };
  
  // Format timestamp to readable format
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div 
      ref={chatWindowRef}
      className="chat-popup w-80 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col h-96"
      style={{ 
        display: visible ? 'flex' : 'none'
      }}
      id="active-chat-window"
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white p-3 rounded-t-lg">
        <div className="font-medium truncate">
          {activeBusiness.name}
        </div>
        <button 
          onClick={() => closeChat()}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <FaTimes />
        </button>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>Start a conversation with {activeBusiness.name}</p>
            <p className="text-sm mt-2">Use the predefined messages below or type your own</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`mb-3 ${message.senderId === user.id ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div 
                className={`max-w-3/4 p-3 rounded-lg ${
                  message.senderId === user.id 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Predefined Messages */}
      {showPredefinedMessages && (
        <div className="p-2 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {predefinedMessages.map((message, index) => (
              <button
                key={index}
                onClick={() => handlePredefinedMessage(message)}
                className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100"
              >
                {message.length > 25 ? message.substring(0, 25) + '...' : message}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <button
            onClick={() => setShowPredefinedMessages(!showPredefinedMessages)}
            className="text-gray-500 hover:text-gray-700 mr-2"
            title="Show suggested messages"
          >
            <FaRegSmile />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ''}
            className={`ml-2 p-2 rounded-full ${
              newMessage.trim() === '' 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveChat;
