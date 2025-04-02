import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Business, AuthState } from '../types/auth';
import { authApi, businessApi, userApi } from '../services/api';

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  business: null,
  loading: false
};

// Define context type
interface AuthContextType extends AuthState {
  login: (email: string, password: string, isBusinessLogin?: boolean) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  registerBusiness: (businessData: Partial<Business>, password: string) => Promise<boolean>;
  logout: () => void;
  createBusiness: (businessData: Partial<Business>) => Promise<Business>;
  updateBusiness: (businessData: Partial<Business>) => Promise<Business>;
  updateUserProfile: (userData: { firstName?: string; lastName?: string }) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  deleteAccount: (password: string) => Promise<boolean>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Login function using API
  const login = async (email: string, password: string, isBusinessLogin = false): Promise<boolean> => {
    setAuthState({ ...authState, loading: true });
    
    try {
      // Call the login API
      const credentials = { email, password };
      const response = await authApi.login(credentials);
      
      // Check if this is a business login
      if (isBusinessLogin) {
        if (response.user.role !== 'business') {
          throw new Error('Not a business account');
        }
        
        // Find the associated business
        const businesses = await businessApi.getAll();
        const foundBusiness = businesses.find(b => b.ownerEmail.toLowerCase() === email.toLowerCase());
        
        if (foundBusiness) {
          setAuthState({
            isAuthenticated: true,
            user: response.user,
            business: foundBusiness,
            loading: false
          });
          return true;
        } else {
          // For demo purposes, create a default business if none exists
          const defaultBusiness: Omit<Business, 'id'> = {
            name: 'New Business',
            ownerEmail: email,
            businessType: 'store',
            description: 'A new business',
            location: '123 Business St',
            contactInfo: '555-123-4567',
            businessHours: {
              monday: '9:00 AM - 5:00 PM',
              tuesday: '9:00 AM - 5:00 PM',
              wednesday: '9:00 AM - 5:00 PM',
              thursday: '9:00 AM - 5:00 PM',
              friday: '9:00 AM - 5:00 PM',
              saturday: 'Closed',
              sunday: 'Closed'
            }
          };
          
          const newBusiness = await businessApi.create(defaultBusiness as Business);
          
          setAuthState({
            isAuthenticated: true,
            user: response.user,
            business: newBusiness,
            loading: false
          });
          return true;
        }
      } else {
        // Regular student login
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          business: null,
          loading: false
        });
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState({ ...initialState, loading: false });
      return false;
    }
  };

  // Register function using API
  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setAuthState({ ...authState, loading: true });
    
    try {
      // Create registration data
      const registrationData = {
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        password: password,
        role: 'student' as 'student' | 'business'
      };
      
      // Call the register API endpoint
      const response = await authApi.register(registrationData);
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        business: null,
        loading: false
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setAuthState({ ...initialState, loading: false });
      return false;
    }
  };

  // Business registration function using API
  const registerBusiness = async (businessData: Partial<Business>, password: string): Promise<boolean> => {
    setAuthState({ ...authState, loading: true });
    
    try {
      // Register the business owner as a user first
      const userRegistrationData = {
        email: businessData.ownerEmail || '',
        firstName: 'Business', // Default values
        lastName: 'Owner',
        password,
        role: 'business' as 'business' | 'student'
      };
      
      // Register the user first
      const userResponse = await authApi.register(userRegistrationData);
      
      // Then create the business
      const business: Omit<Business, 'id'> = {
        name: businessData.name || '',
        ownerEmail: businessData.ownerEmail || '',
        businessType: businessData.businessType || 'store',
        description: businessData.description || '',
        location: businessData.location || '',
        contactInfo: businessData.contactInfo || ''
      };
      
      const newBusiness = await businessApi.create(business as Business);
      
      setAuthState({
        isAuthenticated: true,
        user: userResponse.user,
        business: newBusiness,
        loading: false
      });
      
      return true;
    } catch (error) {
      console.error('Business registration error:', error);
      setAuthState({ ...initialState, loading: false });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setAuthState(initialState);
  };

  // Create a business using API
  const createBusiness = async (businessData: Partial<Business>) => {
    try {
      if (!authState.user) {
        throw new Error('User must be logged in to create a business');
      }
      
      const business: Omit<Business, 'id'> = {
        name: businessData.name || 'New Business',
        ownerEmail: authState.user.email,
        businessType: businessData.businessType || 'store',
        description: businessData.description || '',
        location: businessData.location || '',
        contactInfo: businessData.contactInfo || '',
        businessHours: businessData.businessHours || {}
      };
      
      const newBusiness = await businessApi.create(business as Business);
      
      setAuthState(prevState => ({
        ...prevState,
        business: newBusiness
      }));
      
      return newBusiness;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  };

  // Update a business using API
  const updateBusiness = async (businessData: Partial<Business>) => {
    try {
      if (!authState.business) {
        throw new Error('No business found to update');
      }
      
      const updatedBusiness = await businessApi.update(
        authState.business.id,
        businessData
      );
      
      setAuthState({
        ...authState,
        business: updatedBusiness
      });
      
      return updatedBusiness;
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (userData: { firstName?: string; lastName?: string }): Promise<boolean> => {
    try {
      if (!authState.user) {
        throw new Error('User must be logged in to update profile');
      }
      
      const updatedUser = await userApi.updateUser(authState.user.id, userData);
      
      setAuthState({
        ...authState,
        user: updatedUser
      });
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };
  
  // Change password
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!authState.user) {
        throw new Error('User must be logged in to change password');
      }
      
      await userApi.changePassword(authState.user.id, {
        currentPassword,
        newPassword
      });
      
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  };
  
  // Delete account
  const deleteAccount = async (password: string): Promise<boolean> => {
    try {
      if (!authState.user) {
        throw new Error('User must be logged in to delete account');
      }
      
      await userApi.deleteAccount(authState.user.id, password);
      
      // Log out the user
      setAuthState(initialState);
      
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  };

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        registerBusiness,
        logout,
        createBusiness,
        updateBusiness,
        updateUserProfile,
        changePassword,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 