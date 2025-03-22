export type UserRole = 'student' | 'business';
export type BusinessType = 'housing' | 'restaurant' | 'store';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface Business {
  id: string;
  name: string;
  ownerEmail: string;
  businessType: BusinessType;
  description: string;
  location: string;
  contactInfo: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  business: Business | null;
  loading: boolean;
} 