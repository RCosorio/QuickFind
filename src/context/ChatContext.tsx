import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Business } from '../types/auth';

// Message interface
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

// Conversation interface
export interface Conversation {
  id: string;
  businessId: string;
  userId: string;
  messages: Message[];
  lastUpdated: Date;
  unreadCount: number;
}

// Chat state interface
interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  activeBusiness: Business | null;
}

// Chat context interface
interface ChatContextType extends ChatState {
  openChat: (business: Business) => void;
  closeChat: () => void;
  sendMessage: (text: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  getAllUnreadCount: () => number;
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatState, setChatState] = useState<ChatState>({
    conversations: [],
    activeConversation: null,
    activeBusiness: null
  });

  // Open chat with a business
  const openChat = (business: Business) => {
    // Check if conversation already exists
    let conversation = chatState.conversations.find(conv => conv.businessId === business.id);
    
    if (!conversation) {
      // Create new conversation
      conversation = {
        id: `conv-${Date.now()}`,
        businessId: business.id,
        userId: 'user123', // This would be the current user's ID in a real app
        messages: [],
        lastUpdated: new Date(),
        unreadCount: 0
      };
      
      setChatState(prev => ({
        ...prev,
        conversations: [...prev.conversations, conversation!],
        activeConversation: conversation!.id,
        activeBusiness: business
      }));
    } else {
      // Use existing conversation
      setChatState(prev => ({
        ...prev,
        activeConversation: conversation!.id,
        activeBusiness: business
      }));
    }
  };

  // Close active chat
  const closeChat = () => {
    setChatState(prev => ({
      ...prev,
      activeConversation: null,
      activeBusiness: null
    }));
  };

  // Send a message in the active conversation
  const sendMessage = (text: string) => {
    if (!chatState.activeConversation || !chatState.activeBusiness) return;
    
    const conversationId = chatState.activeConversation;
    const businessId = chatState.activeBusiness.id;
    
    // Create new message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user123', // This would be the current user's ID in a real app
      receiverId: businessId,
      text,
      timestamp: new Date(),
      read: false
    };
    
    // Update conversation with new message
    setChatState(prev => {
      const updatedConversations = prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastUpdated: new Date()
          };
        }
        return conv;
      });
      
      return {
        ...prev,
        conversations: updatedConversations
      };
    });
    
    // In a real app, you would send this message to a backend
    console.log('Sending message to business:', businessId, text);
    
    // Simulate receiving a response after a delay
    setTimeout(() => {
      // Create reply message
      const replyMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: businessId,
        receiverId: 'user123', // This would be the current user's ID in a real app
        text: getAutomatedReply(text),
        timestamp: new Date(),
        read: false
      };
      
      // Update conversation with reply message
      setChatState(prev => {
        // Only add the reply if the conversation is still in the state
        const conversation = prev.conversations.find(conv => conv.id === conversationId);
        if (!conversation) return prev;
        
        const updatedConversations = prev.conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, replyMessage],
              lastUpdated: new Date(),
              unreadCount: prev.activeConversation === conversationId ? 0 : conv.unreadCount + 1
            };
          }
          return conv;
        });
        
        return {
          ...prev,
          conversations: updatedConversations
        };
      });
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  // Mark conversation as read
  const markConversationAsRead = (conversationId: string) => {
    setChatState(prev => {
      const updatedConversations = prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map(msg => ({
              ...msg,
              read: true
            }))
          };
        }
        return conv;
      });
      
      return {
        ...prev,
        conversations: updatedConversations
      };
    });
  };

  // Get total unread count across all conversations
  const getAllUnreadCount = () => {
    return chatState.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  };

  // Helper function to generate automated replies
  const getAutomatedReply = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hour') || lowerMessage.includes('open')) {
      return "We're open Monday to Friday from 9 AM to 6 PM, and weekends from 10 AM to 4 PM. Looking forward to seeing you!";
    }
    
    if (lowerMessage.includes('discount') || lowerMessage.includes('offer')) {
      return "Yes, we offer a 10% discount for students with a valid ID. Just show your student ID at checkout!";
    }
    
    if (lowerMessage.includes('reservation') || lowerMessage.includes('book')) {
      return "You can make a reservation by calling us at the contact number on our page or by using our online booking system. How many people will be in your party?";
    }
    
    if (lowerMessage.includes('parking')) {
      return "We have limited parking available on-site, but there's also a public parking lot just a block away.";
    }
    
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return "Hi there! Thanks for reaching out. How can I help you today?";
    }
    
    return "Thank you for your message! We'll get back to you as soon as possible. If you have any urgent inquiries, please call the number listed on our profile.";
  };

  return (
    <ChatContext.Provider
      value={{
        ...chatState,
        openChat,
        closeChat,
        sendMessage,
        markConversationAsRead,
        getAllUnreadCount
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 