import React, { useState, useEffect, useRef } from 'react';
import { FaStore, FaUtensils, FaHome, FaSearch, FaUser, FaSignOutAlt, FaCog, FaCamera, FaKey, FaAngleDown, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Business, BusinessType } from '../types/auth';
import BusinessCard from '../components/dashboard/BusinessCard';
import BusinessDetails from '../components/dashboard/BusinessDetails';

// Mock data for businesses
const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Corner Grocery Store',
    ownerEmail: 'store@example.com',
    businessType: 'store',
    description: 'A local grocery store with fresh produce and daily necessities.',
    location: '123 Market Street',
    contactInfo: '555-123-4567',
    rating: 4.5,
    photos: [
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506617420156-8e4536971650?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    businessHours: {
      monday: '8:00 AM - 9:00 PM',
      tuesday: '8:00 AM - 9:00 PM',
      wednesday: '8:00 AM - 9:00 PM',
      thursday: '8:00 AM - 9:00 PM',
      friday: '8:00 AM - 10:00 PM',
      saturday: '9:00 AM - 10:00 PM',
      sunday: '10:00 AM - 7:00 PM'
    },
    reviews: [
      {
        id: '101',
        userId: 'u1',
        userName: 'Alice Johnson',
        rating: 5,
        comment: 'Great selection of fresh produce. The staff is always helpful and friendly!',
        date: '2023-09-15'
      },
      {
        id: '102',
        userId: 'u2',
        userName: 'Bob Smith',
        rating: 4,
        comment: 'Good neighborhood store with reasonable prices.',
        date: '2023-10-20'
      },
      {
        id: '103',
        userId: 'u3',
        userName: 'Carol Davis',
        rating: 4,
        comment: 'I shop here weekly. They have everything I need.',
        date: '2023-11-05'
      }
    ],
    items: [
      {
        id: 's1',
        name: 'Organic Apples',
        description: 'Fresh, locally sourced organic apples',
        price: 2.99,
        category: 'Produce',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 's2',
        name: 'Whole Grain Bread',
        description: 'Freshly baked whole grain bread',
        price: 4.50,
        category: 'Bakery',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 's3',
        name: 'Organic Milk',
        description: 'Locally sourced organic milk',
        price: 3.99,
        category: 'Dairy',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 's4',
        name: 'Free-Range Eggs',
        description: 'Farm fresh free-range eggs',
        price: 5.99,
        category: 'Dairy',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: '2',
    name: 'Tech Store',
    ownerEmail: 'tech@example.com',
    businessType: 'store',
    description: 'Latest gadgets and tech accessories at competitive prices.',
    location: '456 Digital Avenue',
    contactInfo: '555-987-6543',
    rating: 4.2,
    photos: [
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    businessHours: {
      monday: '10:00 AM - 8:00 PM',
      tuesday: '10:00 AM - 8:00 PM',
      wednesday: '10:00 AM - 8:00 PM',
      thursday: '10:00 AM - 8:00 PM',
      friday: '10:00 AM - 9:00 PM',
      saturday: '10:00 AM - 9:00 PM',
      sunday: '11:00 AM - 6:00 PM'
    },
    reviews: [
      {
        id: '201',
        userId: 'u4',
        userName: 'David Wilson',
        rating: 5,
        comment: 'Amazing selection of gadgets and the staff are very knowledgeable about tech.',
        date: '2023-10-01'
      },
      {
        id: '202',
        userId: 'u5',
        userName: 'Emily Brown',
        rating: 3,
        comment: 'Good selection, but the prices are a bit high.',
        date: '2023-11-15'
      },
      {
        id: '203',
        userId: 'u6',
        userName: 'Frank Miller',
        rating: 5,
        comment: 'I found a rare accessory for my phone that I couldn\'t find anywhere else!',
        date: '2023-12-10'
      }
    ],
    items: [
      {
        id: 't1',
        name: 'Wireless Earbuds',
        description: 'Noise-cancelling wireless earbuds with 24-hour battery life',
        price: 99.99,
        category: 'Audio',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 't2',
        name: 'Smart Watch',
        description: 'Fitness tracking and notifications on your wrist',
        price: 199.99,
        category: 'Wearables',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 't3',
        name: 'Laptop Sleeve',
        description: 'Protective sleeve for 13-inch laptops',
        price: 29.99,
        category: 'Accessories',
        inStock: false,
        photo: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 't4',
        name: 'Bluetooth Speaker',
        description: 'Portable speaker with deep bass and 12-hour battery',
        price: 79.99,
        category: 'Audio',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: '3',
    name: 'Sunny Café',
    ownerEmail: 'cafe@example.com',
    businessType: 'restaurant',
    description: 'Cozy café serving specialty coffee and homemade pastries.',
    location: '789 Sunny Road',
    contactInfo: '555-234-5678',
    rating: 4.8,
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    businessHours: {
      monday: '7:00 AM - 6:00 PM',
      tuesday: '7:00 AM - 6:00 PM',
      wednesday: '7:00 AM - 6:00 PM',
      thursday: '7:00 AM - 6:00 PM',
      friday: '7:00 AM - 8:00 PM',
      saturday: '8:00 AM - 8:00 PM',
      sunday: '8:00 AM - 5:00 PM'
    },
    reviews: [
      {
        id: '301',
        userId: 'u7',
        userName: 'Grace Lee',
        rating: 5,
        comment: 'Best coffee in town! Their pastries are made fresh every morning and are absolutely delicious.',
        date: '2023-09-20'
      },
      {
        id: '302',
        userId: 'u8',
        userName: 'Henry Clark',
        rating: 5,
        comment: 'The atmosphere is so cozy and perfect for working or meeting friends.',
        date: '2023-10-15'
      },
      {
        id: '303',
        userId: 'u9',
        userName: 'Isabella Davis',
        rating: 4,
        comment: 'Good coffee and nice ambiance, but it gets pretty crowded on weekends.',
        date: '2023-11-02'
      }
    ],
    menu: [
      {
        id: 'c1',
        name: 'Cappuccino',
        description: 'Espresso with steamed milk foam',
        price: 4.50,
        category: 'Coffee',
        photo: 'https://images.unsplash.com/photo-1534778101976-62847782c213?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'c2',
        name: 'Blueberry Muffin',
        description: 'Freshly baked muffin loaded with blueberries',
        price: 3.75,
        category: 'Pastries',
        photo: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'c3',
        name: 'Avocado Toast',
        description: 'Sourdough toast with fresh avocado, cherry tomatoes, and microgreens',
        price: 8.50,
        category: 'Breakfast',
        photo: 'https://images.unsplash.com/photo-1603046891744-c228b38d8e13?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'c4',
        name: 'Chicken Pesto Sandwich',
        description: 'Grilled chicken with pesto, mozzarella, and tomato on ciabatta',
        price: 10.50,
        category: 'Lunch',
        photo: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'c5',
        name: 'Chai Latte',
        description: 'Spiced tea with steamed milk',
        price: 4.25,
        category: 'Coffee',
        photo: 'https://images.unsplash.com/photo-1578888213391-a226276184da?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: '4',
    name: 'Pizza Palace',
    ownerEmail: 'pizza@example.com',
    businessType: 'restaurant',
    description: 'Authentic Italian pizza made in a wood-fired oven.',
    location: '321 Cheese Street',
    contactInfo: '555-876-5432',
    rating: 4.6,
    photos: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1593504049359-74330189a345?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    businessHours: {
      monday: 'Closed',
      tuesday: '12:00 PM - 10:00 PM',
      wednesday: '12:00 PM - 10:00 PM',
      thursday: '12:00 PM - 10:00 PM',
      friday: '12:00 PM - 11:00 PM',
      saturday: '12:00 PM - 11:00 PM',
      sunday: '12:00 PM - 9:00 PM'
    },
    reviews: [
      {
        id: '401',
        userId: 'u10',
        userName: 'Jack Thompson',
        rating: 5,
        comment: 'The Margherita pizza here is as authentic as it gets outside of Naples! Thin crust, fresh ingredients, perfect wood-fired taste.',
        date: '2023-08-25'
      },
      {
        id: '402',
        userId: 'u11',
        userName: 'Karen Martinez',
        rating: 4,
        comment: 'Great pizzas, but they can get pretty busy on weekends with long wait times.',
        date: '2023-09-30'
      },
      {
        id: '403',
        userId: 'u12',
        userName: 'Liam Anderson',
        rating: 5,
        comment: 'Their house-made tiramisu is to die for! Pizza is excellent too.',
        date: '2023-11-14'
      }
    ],
    menu: [
      {
        id: 'p1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
        price: 12.99,
        category: 'Pizzas',
        photo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'p2',
        name: 'Pepperoni Pizza',
        description: 'Tomato sauce, mozzarella, and spicy pepperoni',
        price: 14.99,
        category: 'Pizzas',
        photo: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'p3',
        name: 'Vegetarian Pizza',
        description: 'Bell peppers, onions, mushrooms, olives, and fresh mozzarella',
        price: 13.99,
        category: 'Pizzas',
        photo: 'https://images.unsplash.com/photo-1571066811602-716837d681de?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'p4',
        name: 'Caprese Salad',
        description: 'Fresh tomatoes, mozzarella, and basil with balsamic glaze',
        price: 8.99,
        category: 'Appetizers',
        photo: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'p5',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with espresso, mascarpone, and cocoa',
        price: 6.99,
        category: 'Desserts',
        photo: 'https://images.unsplash.com/photo-1571877899815-1bf05246d90d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: '5',
    name: 'Student Apartments',
    ownerEmail: 'apartments@example.com',
    businessType: 'housing',
    description: 'Modern student apartments close to campus with all amenities.',
    location: '654 Campus Drive',
    contactInfo: '555-345-6789',
    rating: 4.1,
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    businessHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed'
    },
    reviews: [
      {
        id: '501',
        userId: 'u13',
        userName: 'Mia Johnson',
        rating: 4,
        comment: 'Great location, just a 5-minute walk to campus. The apartments are well-maintained and the staff is responsive.',
        date: '2023-08-10'
      },
      {
        id: '502',
        userId: 'u14',
        userName: 'Noah Williams',
        rating: 5,
        comment: 'The amenities are fantastic! The gym and study rooms are always clean and well-equipped.',
        date: '2023-09-25'
      },
      {
        id: '503',
        userId: 'u15',
        userName: 'Olivia Taylor',
        rating: 3,
        comment: 'The apartments are nice but can be noisy on weekends. Maintenance requests are handled quickly though.',
        date: '2023-10-18'
      }
    ],
    rooms: [
      {
        id: 'r1',
        name: 'Studio Apartment',
        description: 'Compact but efficient studio with kitchen and private bathroom',
        price: 850,
        bedrooms: 0,
        bathrooms: 1,
        available: true,
        photos: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1624204731522-f030a8a58e46?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ],
        amenities: ['High-speed internet', 'Laundry facility', 'Kitchenette', 'Study desk']
      },
      {
        id: 'r2',
        name: 'One-Bedroom Apartment',
        description: 'Spacious apartment with separate bedroom and living area',
        price: 1050,
        bedrooms: 1,
        bathrooms: 1,
        available: true,
        photos: [
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ],
        amenities: ['High-speed internet', 'Laundry facility', 'Full kitchen', 'Living room furniture']
      },
      {
        id: 'r3',
        name: 'Two-Bedroom Shared',
        description: 'Perfect for roommates with two private bedrooms and shared common areas',
        price: 750,
        bedrooms: 2,
        bathrooms: 1,
        available: false,
        photos: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1534595038511-9f219fe0c979?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ],
        amenities: ['High-speed internet', 'Laundry facility', 'Full kitchen', 'Shared living room']
      }
    ]
  },
  {
    id: '6',
    name: 'Cozy Homestay',
    ownerEmail: 'homestay@example.com',
    businessType: 'housing',
    description: 'Family-style homestay options for international students.',
    location: '987 Family Lane',
    contactInfo: '555-765-4321',
    rating: 4.9,
    photos: [
      'https://images.unsplash.com/photo-1617104423715-db8f38c9456d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1591247378418-c77740f75218?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    businessHours: {
      monday: '10:00 AM - 5:00 PM',
      tuesday: '10:00 AM - 5:00 PM',
      wednesday: '10:00 AM - 5:00 PM',
      thursday: '10:00 AM - 5:00 PM',
      friday: '10:00 AM - 5:00 PM',
      saturday: 'By appointment',
      sunday: 'Closed'
    },
    reviews: [
      {
        id: '601',
        userId: 'u16',
        userName: 'Pedro Sanchez',
        rating: 5,
        comment: 'I stayed here for my entire exchange semester. The host family was incredibly welcoming and helped me improve my language skills.',
        date: '2023-07-15'
      },
      {
        id: '602',
        userId: 'u17',
        userName: 'Qian Li',
        rating: 5,
        comment: 'Wonderful experience! The homestay included meals and the host family even showed me around the city.',
        date: '2023-09-12'
      },
      {
        id: '603',
        userId: 'u18',
        userName: 'Rachel Green',
        rating: 4,
        comment: 'Very comfortable and clean. The family was respectful of my privacy while still being welcoming.',
        date: '2023-11-20'
      }
    ],
    rooms: [
      {
        id: 'h1',
        name: 'Private Room with Meals',
        description: 'Private bedroom with shared bathroom and three meals included daily',
        price: 950,
        bedrooms: 1,
        bathrooms: 0.5,
        available: true,
        photos: [
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1519710889408-a67e1c7e0452?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ],
        amenities: ['Meals included', 'Wifi', 'Laundry service', 'Cultural exchange']
      },
      {
        id: 'h2',
        name: 'Private Suite',
        description: 'Private bedroom with ensuite bathroom and meals included',
        price: 1200,
        bedrooms: 1,
        bathrooms: 1,
        available: true,
        photos: [
          'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ],
        amenities: ['Private bathroom', 'Meals included', 'Wifi', 'Desk', 'Laundry service']
      },
      {
        id: 'h3',
        name: 'Shared Twin Room',
        description: 'Shared room with two beds, perfect for friends traveling together',
        price: 750,
        bedrooms: 0.5,
        bathrooms: 0.5,
        available: false,
        photos: [
          'https://images.unsplash.com/photo-1508253578933-20b529302151?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ],
        amenities: ['Shared bedroom', 'Meals included', 'Wifi', 'Cultural activities']
      }
    ]
  }
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BusinessType>('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeProfileSection, setActiveProfileSection] = useState<'main' | 'edit-profile' | 'change-password' | 'account-settings'>('main');
  
  // Form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    language: 'english'
  });
  
  // Add fade effect state for menu transitions
  const [isFading, setIsFading] = useState(false);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Filter businesses based on active tab and search query
    const filtered = mockBusinesses.filter(business => {
      const matchesType = business.businessType === activeTab;
      const matchesSearch = searchQuery === '' || 
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesType && matchesSearch;
    });
    
    setBusinesses(filtered);
  }, [activeTab, searchQuery]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
        // Reset to main menu when closing
        setActiveProfileSection('main');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef]);

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (tab: BusinessType) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  const openBusinessDetails = (business: Business) => {
    setSelectedBusiness(business);
  };

  const closeBusinessDetails = () => {
    setSelectedBusiness(null);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    // Reset to main section when toggling
    setActiveProfileSection('main');
  };

  const handleProfileNavigation = (section: 'main' | 'edit-profile' | 'change-password' | 'account-settings') => {
    setActiveProfileSection(section);
  };

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsChange = (setting: string, value: any) => {
    setAccountSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the user profile with an API call
    console.log('Saving profile:', profileForm);
    // Simulate success
    setTimeout(() => {
      handleProfileNavigation('main');
      // Update local display
      // In a real app, this would happen after API confirms success
    }, 500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the password with an API call
    console.log('Changing password:', passwordForm);
    // Simulate success
    setTimeout(() => {
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      handleProfileNavigation('main');
    }, 500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update settings with an API call
    console.log('Saving settings:', accountSettings);
    // Simulate success
    setTimeout(() => {
      handleProfileNavigation('main');
    }, 500);
  };

  // Modified navigation with fade transition
  const handleSectionTransition = (section: 'main' | 'edit-profile' | 'change-password' | 'account-settings') => {
    if (section === activeProfileSection) return;
    
    // Use a more immediate transition instead of the fade approach
    // which was causing flickering
    setActiveProfileSection(section);
  };

  // User profile modal component
  const ProfileMenu = () => {
    // Main menu with updated navigation
    const renderMainMenu = () => (
      <div className="py-2">
        <button 
          className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-gray-50"
          onClick={() => handleSectionTransition('edit-profile')}
        >
          <FaUser className="mr-3 text-gray-500" />
          <span>Edit Profile</span>
        </button>
        <button 
          className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-gray-50"
          onClick={() => handleSectionTransition('change-password')}
        >
          <FaKey className="mr-3 text-gray-500" />
          <span>Change Password</span>
        </button>
        <button 
          className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-gray-50"
          onClick={() => handleSectionTransition('account-settings')}
        >
          <FaCog className="mr-3 text-gray-500" />
          <span>Account Settings</span>
        </button>
        <div className="border-t my-2"></div>
        <button 
          className="w-full px-6 py-3 flex items-center text-red-600 hover:bg-gray-50"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    );

    // Edit profile form with back button using transitions
    const renderEditProfile = () => (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <button 
            className="p-2 mr-3 rounded-full hover:bg-gray-100"
            onClick={() => handleSectionTransition('main')}
          >
            <FaArrowLeft className="text-gray-500" />
          </button>
          <h3 className="text-lg font-medium">Edit Profile</h3>
        </div>
        
        <form onSubmit={handleSaveProfile}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-baby-blue flex items-center justify-center text-white text-2xl">
                {profileForm.firstName.charAt(0)}
              </div>
              <button type="button" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow">
                <FaCamera className="text-baby-blue" />
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profileForm.firstName}
              onChange={handleProfileFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profileForm.lastName}
              onChange={handleProfileFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-baby-blue text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    );

    // Change password form with back button using transitions
    const renderChangePassword = () => (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <button 
            className="p-2 mr-3 rounded-full hover:bg-gray-100"
            onClick={() => handleSectionTransition('main')}
          >
            <FaArrowLeft className="text-gray-500" />
          </button>
          <h3 className="text-lg font-medium">Change Password</h3>
        </div>
        
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
            {passwordForm.newPassword && passwordForm.confirmPassword && 
             passwordForm.newPassword !== passwordForm.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-baby-blue text-white rounded-lg hover:bg-blue-500 transition-colors"
            disabled={passwordForm.newPassword !== passwordForm.confirmPassword}
          >
            Update Password
          </button>
        </form>
      </div>
    );

    // Account settings form with back button using transitions
    const renderAccountSettings = () => (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <button 
            className="p-2 mr-3 rounded-full hover:bg-gray-100"
            onClick={() => handleSectionTransition('main')}
          >
            <FaArrowLeft className="text-gray-500" />
          </button>
          <h3 className="text-lg font-medium">Account Settings</h3>
        </div>
        
        <form onSubmit={handleSaveSettings}>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="toggleEmail"
                  checked={accountSettings.emailNotifications} 
                  onChange={() => handleSettingsChange('emailNotifications', !accountSettings.emailNotifications)}
                  className="sr-only"
                />
                <label 
                  htmlFor="toggleEmail"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${accountSettings.emailNotifications ? 'bg-baby-blue' : 'bg-gray-300'}`}
                >
                  <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${accountSettings.emailNotifications ? 'translate-x-4' : 'translate-x-0'}`}></span>
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Receive email notifications about new listings and updates</p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Dark Mode</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="toggleDarkMode"
                  checked={accountSettings.darkMode} 
                  onChange={() => handleSettingsChange('darkMode', !accountSettings.darkMode)}
                  className="sr-only"
                />
                <label 
                  htmlFor="toggleDarkMode"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${accountSettings.darkMode ? 'bg-baby-blue' : 'bg-gray-300'}`}
                >
                  <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${accountSettings.darkMode ? 'translate-x-4' : 'translate-x-0'}`}></span>
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Switch between light and dark theme</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={accountSettings.language}
              onChange={(e) => handleSettingsChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-baby-blue text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Save Settings
          </button>
          
          <div className="mt-8 pt-6 border-t">
            <button
              type="button"
              className="w-full py-2 px-4 flex items-center justify-center text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <FaTrash className="mr-2" />
              <span>Delete Account</span>
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">This action is permanent and cannot be undone.</p>
          </div>
        </form>
      </div>
    );

    // Get the current active content to display
    const getActiveContent = () => {
      switch (activeProfileSection) {
        case 'edit-profile':
          return renderEditProfile();
        case 'change-password':
          return renderChangePassword();
        case 'account-settings':
          return renderAccountSettings();
        default:
          return renderMainMenu();
      }
    };

    return (
      <div className="fixed inset-0 z-20">
        {/* Backdrop - always present */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm animate-fadeIn"
          onClick={() => {
            setShowProfileMenu(false);
            setActiveProfileSection('main');
          }}
        ></div>
        
        {/* Menu content */}
        <div 
          ref={profileMenuRef}
          className="absolute right-4 top-16 mt-2 z-30 w-80 bg-white rounded-xl shadow-xl overflow-hidden animate-slideIn"
          style={{ maxHeight: 'calc(100vh - 5rem)', overflowY: 'auto' }}
        >
          {/* Profile header - only show on main menu */}
          {activeProfileSection === 'main' && (
            <div className="bg-gradient-to-r from-baby-blue to-blue-400 p-6 text-white">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-30 flex items-center justify-center overflow-hidden text-xl">
                    {user?.firstName?.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                    <FaCamera className="text-baby-blue text-xs" />
                  </button>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-sm text-blue-100">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Dynamic content with key-based animation */}
          <div className="transition-all duration-150 ease-in-out">
            {getActiveContent()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <div className="fixed top-4 left-0 right-0 z-10 px-4 mx-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md py-3 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-baby-blue">QuickFind</h1>
            </div>
            
            <div className="flex space-x-6">
              <button
                onClick={() => handleTabChange('store')}
                className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-colors ${
                  activeTab === 'store' 
                    ? 'bg-red-100 text-red-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <FaStore />
                <span>Stores</span>
              </button>
              
              <button
                onClick={() => handleTabChange('restaurant')}
                className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-colors ${
                  activeTab === 'restaurant' 
                    ? 'bg-green-100 text-green-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <FaUtensils />
                <span>Restaurants</span>
              </button>
              
              <button
                onClick={() => handleTabChange('housing')}
                className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-colors ${
                  activeTab === 'housing' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <FaHome />
                <span>Housing</span>
              </button>
            </div>
            
            <div className="relative">
              <button 
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-expanded={showProfileMenu}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-baby-blue flex items-center justify-center text-white">
                  {user?.firstName?.charAt(0)}
                </div>
                <span className="text-sm">{user?.firstName}</span>
                <FaAngleDown className={`text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="pt-24 pb-10 px-4 max-w-6xl mx-auto">
        {/* Search bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search ${activeTab === 'store' ? 'stores' : activeTab === 'restaurant' ? 'restaurants' : 'housing'}`}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
          />
        </div>
        
        {/* Business list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.length > 0 ? (
            businesses.map(business => (
              <BusinessCard 
                key={business.id} 
                business={business}
                onClick={() => openBusinessDetails(business)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No {activeTab === 'store' ? 'stores' : activeTab === 'restaurant' ? 'restaurants' : 'housing options'} found.</p>
              <p className="text-gray-400 text-sm mt-2">Try a different search term or switch tabs.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Business details modal */}
      {selectedBusiness && (
        <BusinessDetails
          business={selectedBusiness}
          onClose={closeBusinessDetails}
        />
      )}

      {/* Profile menu modal - rendered as a portal in a fixed container */}
      {showProfileMenu && (
        <ProfileMenu />
      )}
    </div>
  );
};

export default Dashboard; 