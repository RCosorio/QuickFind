import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Business, AuthState } from '../types/auth';
import { mockBusinesses } from '../data/mockData';

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
        // Find business by owner email
        const foundBusiness = mockBusinesses.find(b => b.ownerEmail.toLowerCase() === email.toLowerCase());
        
        if (foundBusiness) {
          setAuthState({
            isAuthenticated: true,
            user: {
              id: `u-${foundBusiness.id}`,
              email,
              firstName: 'Business',
              lastName: 'Owner',
              role: 'business'
            },
            business: foundBusiness,
            loading: false
          });
        } else {
          // If no business matches, create a default one
          const mockBusiness: Business = {
            id: 'b123',
            name: 'Sample Business',
            ownerEmail: email,
            businessType: 'store',
            description: 'A sample business',
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
        }
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

  // Add a method to create a business
  const createBusiness = async (businessData: Partial<Business>) => {
    // In a real app, this would make an API call
    console.log('Creating business:', businessData);
    
    // Mock API call success
    const newBusiness: Business = {
      id: `new-${Date.now()}`,
      name: businessData.name || 'New Business',
      ownerEmail: authState.user?.email || 'user@example.com',
      businessType: businessData.businessType || 'store',
      description: businessData.description || '',
      location: businessData.location || '',
      contactInfo: businessData.contactInfo || '',
      businessHours: businessData.businessHours || {},
      photos: [],
      reviews: []
    };
    
    // Update business in state
    setAuthState(prevState => ({
      ...prevState,
      business: newBusiness
    }));
    
    return newBusiness;
  };

  // Add a method to update a business
  const updateBusiness = async (businessData: Partial<Business>) => {
    // In a real app, this would make an API call to update the business
    console.log('Updating business:', businessData);
    
    if (!authState.business) {
      throw new Error('No business found to update');
    }
    
    // Create updated business by merging current business with new data
    const updatedBusiness: Business = {
      ...authState.business,
      ...businessData,
      // Ensure nested properties are properly updated
      businessHours: {
        ...authState.business.businessHours,
        ...(businessData.businessHours || {})
      }
    };
    
    // Update state with the updated business
    setAuthState({
      ...authState,
      business: updatedBusiness
    });
    
    return updatedBusiness;
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
        updateBusiness
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