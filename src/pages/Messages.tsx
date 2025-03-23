import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { mockBusinesses } from '../data/mockData';
import { FaComment, FaRegComment, FaEnvelope, FaRegEnvelope, FaSearch, FaStore, FaUtensils, FaHome, FaArrowLeft } from 'react-icons/fa';
import ActiveChat from '../components/chat/ActiveChat';
import { Business } from '../types/auth';
import { Link, useNavigate } from 'react-router-dom';

const Messages: React.FC = () => {
  const { conversations, openChat, activeBusiness, clearActiveChat } = useChat();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to view your messages</p>
      </div>
    );
  }
  
  const handleBackToDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    clearActiveChat();
    navigate('/dashboard');
  };
  
  // Sort conversations by last updated time (newest first)
  const sortedConversations = [...conversations].sort(
    (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()
  );
  
  // Filter conversations by search term
  const filteredConversations = sortedConversations.filter(conversation => {
    const business = mockBusinesses.find(b => b.id === conversation.businessId);
    if (!business) return false;
    
    const businessNameMatch = business.name.toLowerCase().includes(searchTerm.toLowerCase());
    const messageMatch = conversation.messages.some(msg => 
      msg.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return businessNameMatch || messageMatch;
  });
  
  const getBusinessDetails = (businessId: string): Business | undefined => {
    return mockBusinesses.find(b => b.id === businessId);
  };
  
  const getLastMessage = (messages: any[]): string => {
    if (messages.length === 0) return 'No messages yet';
    return messages[messages.length - 1].text.length > 60
      ? `${messages[messages.length - 1].text.substring(0, 60)}...`
      : messages[messages.length - 1].text;
  };
  
  const formatDate = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (today.getTime() - messageDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      // Less than a week ago
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <FaArrowLeft className="mr-2" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold mb-6">Your Conversations</h2>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search messages or businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Conversations List */}
            {filteredConversations.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                {searchTerm ? (
                  <p>No messages matching your search</p>
                ) : (
                  <div>
                    <div className="flex justify-center mb-4">
                      <FaRegComment className="text-4xl text-gray-300" />
                    </div>
                    <p className="text-lg mb-2">No messages yet</p>
                    <p className="text-sm">Your conversations with businesses will appear here</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredConversations.map(conversation => {
                  const business = getBusinessDetails(conversation.businessId);
                  if (!business) return null;
                  
                  const lastMessage = conversation.messages[conversation.messages.length - 1];
                  const hasUnread = conversation.unreadCount > 0;
                  
                  return (
                    <div 
                      key={conversation.id}
                      className={`py-4 px-2 hover:bg-gray-50 cursor-pointer flex items-center ${
                        activeBusiness?.id === business.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => openChat(business)}
                    >
                      <div className="relative flex-shrink-0 mr-4">
                        {business.photos && business.photos[0] ? (
                          <img 
                            src={business.photos[0]} 
                            alt={business.name} 
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            {business.businessType === 'store' && <FaStore className="text-gray-500" />}
                            {business.businessType === 'restaurant' && <FaUtensils className="text-gray-500" />}
                            {business.businessType === 'housing' && <FaHome className="text-gray-500" />}
                          </div>
                        )}
                        {hasUnread && (
                          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className={`text-sm font-medium ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                            {business.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {lastMessage && formatDate(lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${hasUnread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                          {getLastMessage(conversation.messages)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Active Chat Window */}
      {activeBusiness && <ActiveChat />}
    </div>
  );
};

export default Messages; 