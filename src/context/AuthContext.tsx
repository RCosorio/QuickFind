import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Business, AuthState, UserRole, BusinessAccount } from '../types/auth';
import { authApi, businessApi, userApi } from '../services/api';
import axios from 'axios';

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  businessAccount: null,
  business: null,
  loading: false
};

// Define context type
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  businessLogin: (email: string, password: string) => Promise<boolean>;
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
  // Initialize auth state from localStorage if available
  const initialAuthState = () => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedBusinessAccount = localStorage.getItem('businessAccount');
      const savedBusiness = localStorage.getItem('business');
      
      if (savedUser) {
        // Regular user login
        const user = JSON.parse(savedUser);
        console.log('Restored user from localStorage:', user);
        
        return {
          isAuthenticated: true,
          user: user,
          businessAccount: null,
          business: null,
          loading: false
        };
      } else if (savedBusinessAccount && savedBusiness) {
        // Business account login
        const businessAccount = JSON.parse(savedBusinessAccount);
        const business = JSON.parse(savedBusiness);
        console.log('Restored business account from localStorage:', businessAccount);
        
        return {
          isAuthenticated: true,
          user: null,
          businessAccount: businessAccount,
          business: business,
          loading: false
        };
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('businessAccount');
      localStorage.removeItem('business');
    }
    
    return initialState;
  };

  const [authState, setAuthState] = useState<AuthState>(initialAuthState());
  
  // Log auth state on initialization
  useEffect(() => {
    console.log('Auth Provider initialized with state:', authState);
  }, []);

  // Login function for regular users
  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState({ ...authState, loading: true });
    console.log("User login attempt:", { email });
    
    try {
      // Call the login API
      const credentials = { email, password };
      const response = await authApi.login(credentials);
      console.log("User login response received:", response);
      
      // Extract user data from response
      const userData: User = {
        id: response.user.id || response.user._id || '',
        email: response.user.email,
        firstName: response.user.firstName || 'Guest',
        lastName: response.user.lastName || 'User',
        role: response.user.role as UserRole,
        _id: response.user._id
      };
      
      console.log("Processed user data:", userData);
      
      // Regular login successful
      setAuthState({
        isAuthenticated: true,
        user: userData,
        businessAccount: null,
        business: null,
        loading: false
      });
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.removeItem('businessAccount');
      localStorage.removeItem('business');
      
      return true;
    } catch (error) {
      console.error('User login error:', error);
      setAuthState({ ...initialState, loading: false });
      return false;
    }
  };

  // Login function for business accounts
  const businessLogin = async (email: string, password: string): Promise<boolean> => {
    setAuthState({ ...authState, loading: true });
    console.log("Business login attempt:", { email });
    
    try {
      // Call the business login API
      const credentials = { email, password };
      const response = await authApi.businessLogin(credentials);
      console.log("Business login response received:", response);
      
      // Extract business account data from response
      const accountData: BusinessAccount = {
        id: response.businessAccount.id || response.businessAccount._id,
        email: response.businessAccount.email,
        businessId: response.businessAccount.businessId,
        _id: response.businessAccount._id
      };
      
      const businessData = response.business;
      
      console.log("Processed business account data:", accountData);
      console.log("Business data:", businessData);
      
      // Business login successful
      setAuthState({
        isAuthenticated: true,
        user: null,
        businessAccount: accountData,
        business: businessData,
        loading: false
      });
      
      // Store in localStorage for persistence
      localStorage.removeItem('user');
      localStorage.setItem('businessAccount', JSON.stringify(accountData));
      localStorage.setItem('business', JSON.stringify(businessData));
      
      return true;
    } catch (error) {
      console.error('Business login error:', error);
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
        password: password
      };
      
      // Call the register API endpoint
      const response = await authApi.register(registrationData);
      
      // No longer setting authentication state since we redirect to login
      setAuthState({
        ...initialState,
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
      // Register the business account
      const businessRegistrationData = {
        email: businessData.ownerEmail || '',
        password,
        businessName: businessData.name || '',
        businessType: businessData.businessType,
        location: businessData.location,
        contactInfo: businessData.contactInfo,
        description: businessData.description
      };
      
      // Register the business account and get created business ID
      const response = await authApi.businessRegister(businessRegistrationData);
      console.log('Business registration response:', response);
      
      // No longer setting authentication state since we redirect to login
      setAuthState({
        ...initialState,
        loading: false
      });
      
      return true;
    } catch (error) {
      console.error('Business registration error:', error);
      setAuthState({ ...initialState, loading: false });
      return false;
    }
  };

  // Logout function - updated to clear localStorage
  const logout = () => {
    console.log('Logging out, clearing auth state and localStorage');
    
    // Clear all saved data
    localStorage.removeItem('user');
    localStorage.removeItem('businessAccount');
    localStorage.removeItem('business');
    
    // Reset auth state
    setAuthState(initialState);
  };

  // Create a business using API
  const createBusiness = async (businessData: Partial<Business>) => {
    try {
      if (!authState.businessAccount) {
        throw new Error('Business account must be logged in to create a business');
      }
      
      const business: Omit<Business, 'id'> = {
        name: businessData.name || 'New Business',
        ownerEmail: authState.businessAccount.email,
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
      
      // Update localStorage
      localStorage.setItem('business', JSON.stringify(newBusiness));
      
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
      
      // Update localStorage
      localStorage.setItem('business', JSON.stringify(updatedBusiness));
      
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
        console.error('User must be logged in to update profile');
        throw new Error('User must be logged in to update profile');
      }
      
      console.log('Updating user profile with:', userData);
      
      // Validate the data
      if (userData.firstName === '' || userData.lastName === '') {
        console.error('First name and last name cannot be empty');
        throw new Error('First name and last name cannot be empty');
      }
      
      const updatedUser = await userApi.updateUser(authState.user.id, userData);
      console.log('User profile updated, server response:', updatedUser);
      
      // Create a new user object with the updated fields
      const newUserState = {
        ...authState.user,
        firstName: userData.firstName || authState.user.firstName,
        lastName: userData.lastName || authState.user.lastName
      };
      
      // Update the auth state
      setAuthState({
        ...authState,
        user: newUserState
      });
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(newUserState));
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };
  
  // Change password
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!authState.user && !authState.businessAccount) {
        throw new Error('User or business account must be logged in to change password');
      }
      
      if (authState.user) {
        await userApi.changePassword(authState.user.id, {
          currentPassword,
          newPassword
        });
      } else if (authState.businessAccount) {
        // You would implement a changeBusinessPassword API call here
        // await businessApi.changePassword(authState.businessAccount.id, {...})
        throw new Error('Business password change not implemented yet');
      }
      
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  };
  
  // Delete account
  const deleteAccount = async (password: string): Promise<boolean> => {
    try {
      if (!authState.user && !authState.businessAccount) {
        throw new Error('User or business account must be logged in to delete account');
      }
      
      if (authState.user) {
        await userApi.deleteAccount(authState.user.id, password);
      } else if (authState.businessAccount) {
        // You would implement a deleteBusinessAccount API call here
        // await businessApi.deleteAccount(authState.businessAccount.id, password);
        throw new Error('Business account deletion not implemented yet');
      }
      
      // Log out the user
      logout();
      
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
        businessLogin,
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

// Use auth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.error("useAuth must be used within an AuthProvider");
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  console.log("Current auth state:", {
    isAuthenticated: context.isAuthenticated,
    hasUser: !!context.user,
    hasBusinessAccount: !!context.businessAccount,
    hasBusiness: !!context.business
  });
  
  return context;
}; 