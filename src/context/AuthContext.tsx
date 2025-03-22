import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Business, AuthState } from '../types/auth';

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
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Mock login function - would connect to backend in real implementation
  const login = async (email: string, password: string, isBusinessLogin = false): Promise<boolean> => {
    setAuthState({ ...authState, loading: true });
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isBusinessLogin) {
        // Mock business login
        const mockBusiness: Business = {
          id: 'b123',
          name: 'Sample Business',
          ownerEmail: email,
          businessType: 'store',
          description: 'A sample business',
          location: '123 Business St',
          contactInfo: '555-123-4567'
        };
        
        setAuthState({
          isAuthenticated: true,
          user: {
            id: 'u123',
            email,
            firstName: 'Business',
            lastName: 'Owner',
            role: 'business'
          },
          business: mockBusiness,
          loading: false
        });
      } else {
        // Mock student login
        setAuthState({
          isAuthenticated: true,
          user: {
            id: 'u456',
            email,
            firstName: 'Student',
            lastName: 'User',
            role: 'student'
          },
          business: null,
          loading: false
        });
      }
      
      return true;
    } catch (error) {
      setAuthState({ ...initialState, loading: false });
      return false;
    }
  };

  // Mock register function
  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setAuthState({ ...authState, loading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthState({
        isAuthenticated: true,
        user: {
          id: 'new123',
          email: userData.email || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          role: 'student'
        },
        business: null,
        loading: false
      });
      
      return true;
    } catch (error) {
      setAuthState({ ...initialState, loading: false });
      return false;
    }
  };

  // Mock business registration function
  const registerBusiness = async (businessData: Partial<Business>, password: string): Promise<boolean> => {
    setAuthState({ ...authState, loading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBusiness: Business = {
        id: 'bnew123',
        name: businessData.name || '',
        ownerEmail: businessData.ownerEmail || '',
        businessType: businessData.businessType || 'store',
        description: businessData.description || '',
        location: businessData.location || '',
        contactInfo: businessData.contactInfo || ''
      };
      
      setAuthState({
        isAuthenticated: true,
        user: {
          id: 'u888',
          email: businessData.ownerEmail || '',
          firstName: 'Business',
          lastName: 'Owner',
          role: 'business'
        },
        business: newBusiness,
        loading: false
      });
      
      return true;
    } catch (error) {
      setAuthState({ ...initialState, loading: false });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setAuthState(initialState);
  };

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        registerBusiness,
        logout
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