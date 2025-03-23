import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaTimes, FaRegSmile } from 'react-icons/fa';
import { Business } from '../../types/auth';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatProps {
  userId: string;
  business: Business;
  onClose: () => void;
  initialMessages?: Message[];
}

const predefinedMessages = [
  "Hi! I'm interested in your business. Can you provide more information?",
  "What are your operating hours this weekend?",
  "Do you offer student discounts?",
  "How can I make a reservation?",
  "Is there parking available nearby?"
];

const ChatBox: React.FC<ChatProps> = ({ userId, business, onClose, initialMessages = [] }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showPredefinedMessages, setShowPredefinedMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: userId,
      receiverId: business.id,
      text: newMessage,
      timestamp: new Date(),
      read: false
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // In a real app, you would send this message to a backend
    console.log('Sending message:', message);
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
    <div className="fixed z-50 bottom-20 right-8 w-80 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white p-3 rounded-t-lg">
        <div className="font-medium truncate">
          {business.name}
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <FaTimes />
        </button>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 p-3 overflow-y-auto max-h-80 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Start a conversation with {business.name}</p>
            <p className="text-sm mt-2">Click the suggestions below to quickly send a message</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.senderId === userId 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div>{message.text}</div>
                  <div className={`text-xs mt-1 ${message.senderId === userId ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Predefined Messages */}
      {showPredefinedMessages && (
        <div className="p-2 border-t border-gray-200 max-h-40 overflow-y-auto">
          <div className="text-xs font-medium text-gray-500 mb-2">Suggested Messages:</div>
          <div className="space-y-2">
            {predefinedMessages.map((message, index) => (
              <button
                key={index}
                onClick={() => handlePredefinedMessage(message)}
                className="w-full text-left text-sm p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {message}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Chat Input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center">
          <button 
            onClick={() => setShowPredefinedMessages(!showPredefinedMessages)}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Show suggested messages"
          >
            <FaRegSmile />
          </button>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 resize-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ''}
            className={`ml-2 p-2 rounded-full ${
              newMessage.trim() === '' 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox; 