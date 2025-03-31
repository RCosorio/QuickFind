// Mock data for businesses
export const mockBusinesses = [
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
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
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
    reviews: [],
    items: [
      {
        id: 't1',
        name: 'Wireless Earbuds',
        description: 'Bluetooth 5.0 earbuds with noise cancellation',
        price: 89.99,
        category: 'Audio',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: '3',
    name: 'Sunny Café',
    ownerEmail: 'cafe@example.com',
    businessType: 'restaurant',
    description: 'Cozy café with freshly brewed coffee, pastries, and light meals.',
    location: '789 Sunny Avenue',
    contactInfo: '555-456-7890',
    rating: 4.8,
    photos: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
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
    reviews: [],
    menu: [
      {
        id: 'c1',
        name: 'House Blend Coffee',
        description: 'Our signature medium roast coffee',
        price: 3.50,
        category: 'Beverages',
        photo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: '4',
    name: 'Student Apartments',
    ownerEmail: 'housing@example.com',
    businessType: 'housing',
    description: 'Modern apartments designed specifically for student living, close to campus.',
    location: '555 University Drive',
    contactInfo: '555-321-6789',
    rating: 4.3,
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    businessHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 4:00 PM',
      saturday: '10:00 AM - 2:00 PM',
      sunday: 'Closed'
    },
    reviews: [],
    rooms: [
      {
        id: 'a1',
        name: 'Studio Apartment',
        description: 'Compact studio with kitchenette and full bathroom',
        price: 800,
        bedrooms: 0,
        bathrooms: 1,
        available: true,
        amenities: ['WiFi', 'Utilities Included', 'Laundry Facilities'],
        photos: [
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ]
      }
    ]
  }
]; 