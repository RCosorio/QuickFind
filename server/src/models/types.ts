export type UserRole = 'student' | 'business';
export type BusinessType = 'housing' | 'restaurant' | 'store';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string; // Only for auth, never sent to client
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
  rating: number;
  comment: string;
  date: string;
  businessId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
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

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
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

export interface MessageData {
  messages: Message[];
} 