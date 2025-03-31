import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Business } from '../types/auth';
import { useAuth } from './AuthContext';
import { messageApi } from '../services/api';

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
  loading: boolean;
}

// Chat context interface
interface ChatContextType extends ChatState {
  openChat: (business: Business) => void;
  closeChat: () => void;
  sendMessage: (text: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  getAllUnreadCount: () => number;
  clearActiveChat: () => void;
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [chatState, setChatState] = useState<ChatState>({
    conversations: [],
    activeConversation: null,
    activeBusiness: null,
    loading: false
  });

  // Fetch conversations when user changes
  useEffect(() => {
    if (!user) {
      setChatState(prev => ({
        ...prev,
        conversations: [],
        activeConversation: null,
        activeBusiness: null,
        loading: false
      }));
      return;
    }

    const fetchConversations = async () => {
      try {
        setChatState(prev => ({ ...prev, loading: true }));
        const response = await messageApi.getConversations(user.id);
        
        // Transform server response to our conversation format
        const formattedConversations = response.map((conv: any) => ({
          id: conv.id,
          businessId: conv.businessId || conv.participants.find((p: string) => p !== user.id),
          userId: user.id,
          messages: conv.messages.map((msg: any) => ({
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            text: msg.content,
            timestamp: new Date(msg.timestamp),
            read: msg.read
          })),
          lastUpdated: new Date(conv.lastUpdated || conv.updatedAt),
          unreadCount: conv.unreadCount || 0
        }));
        
        setChatState(prev => ({
          ...prev,
          conversations: formattedConversations,
          loading: false
        }));
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setChatState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchConversations();
  }, [user]);

  // Open chat with a business
  const openChat = (business: Business) => {
    if (!user) {
      console.error("Cannot open chat: No user is logged in");
      return;
    }
    
    console.log("Opening chat with business:", business.name, business.id, "User:", user.id);
    
    // Check if conversation already exists
    let conversation = chatState.conversations.find(conv => conv.businessId === business.id);
    console.log("Existing conversation found:", conversation ? conversation.id : "None");
    
    if (!conversation) {
      // Create new conversation with the first message
      console.log("Creating new conversation for business:", business.id);
      (async () => {
        try {
          // First set the active business immediately for better UI responsiveness
          setChatState(prev => ({
            ...prev,
            activeBusiness: business,
            loading: true
          }));
          
          // Create a new conversation
          console.log("Calling createConversation API");
          const newConversation = await messageApi.createConversation({
            userId: user.id,
            businessId: business.id,
            messages: []
          });
          console.log("API returned conversation:", newConversation);
          
          // Format the new conversation
          const formattedConversation: Conversation = {
            id: newConversation.id,
            businessId: business.id,
            userId: user.id,
            messages: newConversation.messages ? newConversation.messages.map((msg: any) => ({
              id: msg.id,
              senderId: msg.senderId,
              receiverId: msg.receiverId,
              text: msg.content,
              timestamp: new Date(msg.timestamp),
              read: msg.read
            })) : [],
            lastUpdated: new Date(newConversation.lastUpdated || newConversation.updatedAt || Date.now()),
            unreadCount: 0
          };
          
          setChatState(prev => {
            console.log("Setting active conversation state:", formattedConversation.id);
            console.log("Active business should already be set to:", business.name);
            
            return {
              ...prev,
              conversations: [...prev.conversations, formattedConversation],
              activeConversation: formattedConversation.id,
              loading: false
            };
          });
        } catch (error) {
          console.error('Error creating conversation:', error);
          setChatState(prev => ({ ...prev, loading: false }));
        }
      })();
    } else {
      // Use existing conversation
      console.log("Using existing conversation:", conversation.id);
      
      // Set the state in a single update to avoid race conditions
      setChatState(prev => {
        console.log("Setting active conversation to:", conversation!.id);
        console.log("Setting active business to:", business.name);
        
        return {
          ...prev,
          activeConversation: conversation!.id,
          activeBusiness: business
        };
      });
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
    if (!chatState.activeConversation || !chatState.activeBusiness || !user) return;
    
    const conversationId = chatState.activeConversation;
    const businessId = chatState.activeBusiness.id;
    
    // Create new message locally first for immediate UI update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      receiverId: businessId,
      text,
      timestamp: new Date(),
      read: false
    };
    
    // Update conversation with new message locally
    setChatState(prev => {
      const updatedConversations = prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, tempMessage],
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
    
    // Send message to API
    (async () => {
      try {
        const sentMessage = await messageApi.sendMessage(conversationId, {
          senderId: user.id,
          receiverId: businessId,
          text
        });
        
        // Format the API response to match our Message interface
        const formattedMessage: Message = {
          id: sentMessage.id,
          senderId: user.id,
          receiverId: businessId,
          text,
          timestamp: new Date(sentMessage.timestamp || Date.now()),
          read: false
        };
        
        // Replace temporary message with the one from the server
        setChatState(prev => {
          const updatedConversations = prev.conversations.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: conv.messages.map(msg => 
                  msg.id === tempMessage.id ? formattedMessage : msg
                ),
                lastUpdated: new Date(formattedMessage.timestamp)
              };
            }
            return conv;
          });
          
          return {
            ...prev,
            conversations: updatedConversations
          };
        });
        
        // Simulate business response after a delay
        setTimeout(async () => {
          try {
            // Generate automated reply
            const replyText = getAutomatedReply(text);
            
            // Send business reply to API
            const replyMessage = await messageApi.sendMessage(conversationId, {
              senderId: businessId,
              receiverId: user.id,
              text: replyText
            });
            
            // Format the business reply to match our Message interface
            const formattedReply: Message = {
              id: replyMessage.id,
              senderId: businessId,
              receiverId: user.id,
              text: replyText,
              timestamp: new Date(replyMessage.timestamp || Date.now()),
              read: false
            };
            
            // Update conversation with reply message
            setChatState(prev => {
              const updatedConversations = prev.conversations.map(conv => {
                if (conv.id === conversationId) {
                  return {
                    ...conv,
                    messages: [...conv.messages, formattedReply],
                    lastUpdated: new Date(formattedReply.timestamp),
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
          } catch (error) {
            console.error('Error sending business reply:', error);
          }
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
        
      } catch (error) {
        console.error('Error sending message:', error);
        // Revert UI if message fails to send
        setChatState(prev => {
          const updatedConversations = prev.conversations.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: conv.messages.filter(msg => msg.id !== tempMessage.id)
              };
            }
            return conv;
          });
          
          return {
            ...prev,
            conversations: updatedConversations
          };
        });
      }
    })();
  };

  // Mark conversation as read
  const markConversationAsRead = (conversationId: string) => {
    if (!user) return;
    
    // Update locally first
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
    
    // Update on server - for each unread message
    (async () => {
      try {
        const conversation = chatState.conversations.find(c => c.id === conversationId);
        if (conversation) {
          // Get all unread messages from the other party
          const unreadMessages = conversation.messages.filter(
            msg => !msg.read && msg.senderId !== user.id
          );
          
          // Mark each message as read
          for (const msg of unreadMessages) {
            await messageApi.markAsRead(msg.id, user.id);
          }
        }
      } catch (error) {
        console.error('Error marking conversation as read:', error);
      }
    })();
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

  // Clear active chat when navigating between pages
  const clearActiveChat = () => {
    setChatState(prev => ({
      ...prev,
      activeConversation: null,
      activeBusiness: null
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        ...chatState,
        openChat,
        closeChat,
        sendMessage,
        markConversationAsRead,
        getAllUnreadCount,
        clearActiveChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 