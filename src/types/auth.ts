export type UserRole = 'student';
export type BusinessType = 'housing' | 'restaurant' | 'store';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  _id?: string; // MongoDB ID
}

export interface BusinessAccount {
  id: string; 
  email: string;
  businessId: string;
  _id?: string; // MongoDB ID
}

export interface Business {
  id: string;
  name: string;
  ownerEmail: string;
  businessType: BusinessType;
  description: string;
  location: string;
  contactInfo: string;
  rating?: number;
  reviews?: Review[];
  photos?: string[];
  businessHours?: {
    [key: string]: string;
  };
  menu?: MenuItem[];
  items?: StoreItem[];
  rooms?: HousingUnit[];
  _id?: string; // MongoDB ID
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  businessAccount: BusinessAccount | null;
  business: Business | null;
  loading: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating?: number;
  comment: string;
  date: string;
  businessId: string;
  ownerReply?: string;
  ownerReplyDate?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available?: boolean;
  photo?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  photo?: string;
}

export interface HousingUnit {
  id: string;
  name: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  available: boolean;
  photos?: string[];
  amenities?: string[];
} 