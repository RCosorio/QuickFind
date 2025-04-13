export type UserRole = 'student';
export type BusinessType = 'housing' | 'restaurant' | 'store';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string; // Only for auth, never sent to client
}

export interface BusinessAccount {
  id: string;
  email: string;
  password?: string; // Only for auth, never sent to client
  businessId: string; // Reference to the business this account is for
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

export interface BusinessData {
  businesses: Business[];
}

export interface UserData {
  users: User[];
}

export interface ReviewData {
  reviews: Review[];
}

export interface BusinessAccountData {
  businessAccounts: BusinessAccount[];
} 