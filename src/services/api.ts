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

// User API calls
export const userApi = {
  // Update user details
  updateUser: async (userId: string, userData: {
    firstName?: string;
    lastName?: string;
  }): Promise<User> => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user details:', error);
      throw error;
    }
  },
  
  // Change user password
  changePassword: async (userId: string, passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    try {
      const response = await api.put(`/users/${userId}/password`, passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
  
  // Delete user account
  deleteAccount: async (userId: string, password: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/users/${userId}`, {
        data: { password }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting account:', error);
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
    rating?: number;
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
  },
  
  // Add a business owner reply to a review
  addReply: async (reviewId: string, replyData: {
    businessId: string;
    businessOwnerEmail: string;
    reply: string;
  }): Promise<Review> => {
    try {
      const response = await api.post(`/reviews/${reviewId}/reply`, replyData);
      return response.data;
    } catch (error) {
      console.error(`Error adding reply to review ${reviewId}:`, error);
      throw error;
    }
  }
};

// Export default api instance
export default api; 