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
      console.log(`Fetching business with ID: ${id}`);
      const response = await api.get(`/businesses/${id}`);
      
      // Log the response to help debug
      console.log(`Business data received from API:`, {
        id: response.data.id,
        name: response.data.name,
        reviewsCount: response.data.reviews?.length || 0
      });
      
      if (response.data.reviews) {
        console.log(`Business has ${response.data.reviews.length} reviews from API`);
      } else {
        console.log('No reviews found in API response');
      }
      
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
  },

  getBusinessByOwnerEmail: async (email: string): Promise<Business> => {
    try {
      const response = await fetch(`${API_URL}/api/businesses/owner/${email}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching business: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getBusinessByOwnerEmail:', error);
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
  }): Promise<{ user: User; message: string }> => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  // Register a new business
  businessRegister: async (businessData: {
    email: string;
    password: string;
    businessName: string;
    businessType?: string;
    location?: string;
    contactInfo?: string;
    description?: string;
  }): Promise<{ businessAccount: any; businessId: string; message: string }> => {
    try {
      const response = await api.post('/auth/business-register', businessData);
      return response.data;
    } catch (error) {
      console.error('Error registering business:', error);
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
  },
  
  // Login business
  businessLogin: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ businessAccount: any; business: Business; message: string }> => {
    try {
      const response = await api.post('/auth/business-login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in business:', error);
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
      console.log(`Fetching reviews for business ID: ${businessId}`);
      const response = await api.get(`/reviews/business/${businessId}`);
      console.log(`Received ${response.data.length} reviews from API`);
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
      console.log(`Adding review to business ${businessId}:`, reviewData);
      
      // Validate data before sending
      if (!reviewData.userId || !reviewData.userName || !reviewData.comment) {
        console.error('Review data validation failed:', reviewData);
        throw new Error('Invalid review data: Missing required fields');
      }
      
      // Log detailed information for debugging
      console.log('Review data details:');
      console.log('- userId:', reviewData.userId, '(type:', typeof reviewData.userId, ')');
      console.log('- userName:', reviewData.userName, '(type:', typeof reviewData.userName, ')');
      console.log('- comment:', reviewData.comment.substring(0, 20) + '...', '(type:', typeof reviewData.comment, ')');
      console.log('- rating:', reviewData.rating, '(type:', typeof reviewData.rating, ')');
      
      const response = await api.post(`/reviews/business/${businessId}`, reviewData);
      console.log('Review successfully added:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
        throw new Error(`Server error: ${error.response.data.message || 'Unknown error'}`);
      }
      throw error;
    }
  },
  
  // Delete a review
  delete: async (reviewId: string, userId: string): Promise<void> => {
    try {
      console.log(`Deleting review ${reviewId} for user ${userId}`);
      await api.delete(`/reviews/${reviewId}`, { data: { userId } });
      console.log('Review successfully deleted');
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
      console.log(`Adding reply to review ${reviewId}:`, replyData);
      const response = await api.post(`/reviews/${reviewId}/reply`, replyData);
      console.log('Reply successfully added:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error adding reply to review ${reviewId}:`, error);
      throw error;
    }
  }
};

// Export default api instance
export default api; 