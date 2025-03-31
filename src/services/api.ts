import axios from 'axios';
import { Business, User, Review } from '../types/auth';

// Create an axios instance with base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Business API calls
export const businessApi = {
  // Get all businesses
  getAll: async (): Promise<Business[]> => {
    try {
      const response = await api.get('/businesses');
      return response.data;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  },
  
  // Get business by ID
  getById: async (id: string): Promise<Business> => {
    try {
      const response = await api.get(`/businesses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching business ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new business
  create: async (businessData: Omit<Business, 'id'>): Promise<Business> => {
    try {
      const response = await api.post('/businesses', businessData);
      return response.data;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  },
  
  // Update a business
  update: async (id: string, businessData: Partial<Business>): Promise<Business> => {
    try {
      const response = await api.put(`/businesses/${id}`, businessData);
      return response.data;
    } catch (error) {
      console.error(`Error updating business ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a business
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/businesses/${id}`);
    } catch (error) {
      console.error(`Error deleting business ${id}:`, error);
      throw error;
    }
  }
};

// Auth API calls
export const authApi = {
  // Register a new user
  register: async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: 'student' | 'business';
  }): Promise<{ user: User; message: string }> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ user: User; message: string }> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
};

// Reviews API calls
export const reviewApi = {
  // Get reviews for a business
  getForBusiness: async (businessId: string): Promise<Review[]> => {
    try {
      const response = await api.get(`/reviews/business/${businessId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for business ${businessId}:`, error);
      throw error;
    }
  },
  
  // Add a review
  add: async (businessId: string, reviewData: {
    userId: string;
    userName: string;
    rating: number;
    comment: string;
  }): Promise<Review> => {
    try {
      const response = await api.post(`/reviews/business/${businessId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },
  
  // Delete a review
  delete: async (reviewId: string, userId: string): Promise<void> => {
    try {
      await api.delete(`/reviews/${reviewId}`, { data: { userId } });
    } catch (error) {
      console.error(`Error deleting review ${reviewId}:`, error);
      throw error;
    }
  }
};

// Messages API calls
export const messageApi = {
  // Get all messages for a user
  getForUser: async (userId: string): Promise<any[]> => {
    try {
      const response = await api.get(`/messages/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Get conversation between two users
  getConversation: async (userId: string, otherUserId: string): Promise<any[]> => {
    try {
      const response = await api.get(`/messages/conversation/${userId}/${otherUserId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching conversation:`, error);
      throw error;
    }
  },
  
  // Get all conversations for a user
  getConversations: async (userId: string): Promise<any[]> => {
    try {
      const response = await api.get(`/messages/conversations/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching conversations for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Create a new conversation
  createConversation: async (conversationData: { userId: string; businessId: string; messages: any[] }): Promise<any> => {
    try {
      const response = await api.post('/messages/conversations', conversationData);
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },
  
  // Send a message
  send: async (messageData: {
    senderId: string;
    receiverId: string;
    content: string;
  }): Promise<any> => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  // Send a message to a specific conversation
  sendMessage: async (conversationId: string, messageData: {
    senderId: string;
    receiverId: string;
    text: string;
  }): Promise<any> => {
    try {
      const response = await api.post(`/messages/conversations/${conversationId}`, {
        ...messageData,
        content: messageData.text
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to conversation:', error);
      throw error;
    }
  },
  
  // Mark a message as read
  markAsRead: async (messageId: string, userId: string): Promise<any> => {
    try {
      const response = await api.put(`/messages/${messageId}/read`, { userId });
      return response.data;
    } catch (error) {
      console.error(`Error marking message ${messageId} as read:`, error);
      throw error;
    }
  }
}; 