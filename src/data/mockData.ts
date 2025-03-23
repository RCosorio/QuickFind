import { Business } from '../types/auth';

// Mock data for businesses
export const mockBusinesses: Business[] = [
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
        description: 'Bluetooth 5.0 earbuds with noise cancellation',
        price: 89.99,
        category: 'Audio',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 't2',
        name: 'Smart Watch',
        description: 'Fitness and health tracking with notifications',
        price: 149.99,
        category: 'Wearables',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 't3',
        name: 'Phone Tripod',
        description: 'Flexible tripod for smartphones with remote',
        price: 24.99,
        category: 'Accessories',
        inStock: false,
        photo: 'https://images.unsplash.com/photo-1612111483536-193e3e169d1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
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
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
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
        userName: 'Grace Taylor',
        rating: 5,
        comment: 'The lattes here are amazing! And the pastries are baked fresh daily.',
        date: '2023-09-10'
      },
      {
        id: '302',
        userId: 'u8',
        userName: 'Henry Clark',
        rating: 5,
        comment: 'Perfect spot to work remotely. Good wifi and comfortable seating.',
        date: '2023-10-05'
      },
      {
        id: '303',
        userId: 'u9',
        userName: 'Ivy Lee',
        rating: 4,
        comment: 'Great coffee but it can get crowded during peak hours.',
        date: '2023-11-20'
      }
    ],
    menu: [
      {
        id: 'c1',
        name: 'House Blend Coffee',
        description: 'Our signature medium roast coffee',
        price: 3.50,
        category: 'Beverages',
        photo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'c2',
        name: 'Almond Croissant',
        description: 'Buttery croissant filled with almond cream',
        price: 4.25,
        category: 'Pastries',
        photo: 'https://images.unsplash.com/photo-1586989512301-3cf0f9cb2aa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'c3',
        name: 'Avocado Toast',
        description: 'Sourdough toast with avocado, cherry tomatoes, and microgreens',
        price: 8.95,
        category: 'Food',
        photo: 'https://images.unsplash.com/photo-1603046891744-76e6300255a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'c4',
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam',
        price: 4.50,
        category: 'Beverages',
        photo: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: '4',
    name: 'Pizza Palace',
    ownerEmail: 'pizza@example.com',
    businessType: 'restaurant',
    description: 'Authentic Italian pizzas baked in a wood-fired oven.',
    location: '321 Italian Street',
    contactInfo: '555-789-0123',
    rating: 4.6,
    photos: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1564936281291-294551497d81?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    businessHours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 10:00 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '11:00 AM - 11:00 PM',
      sunday: '12:00 PM - 9:00 PM'
    },
    reviews: [
      {
        id: '401',
        userId: 'u10',
        userName: 'Jack Robinson',
        rating: 5,
        comment: 'Best pizza in town! The crust is perfect and toppings are always fresh.',
        date: '2023-08-20'
      },
      {
        id: '402',
        userId: 'u11',
        userName: 'Kate Martinez',
        rating: 4,
        comment: 'Great pizza and fast delivery. Love their special garlic sauce.',
        date: '2023-09-25'
      },
      {
        id: '403',
        userId: 'u12',
        userName: 'Liam Taylor',
        rating: 5,
        comment: "I can't get enough of their margherita pizza. Simple but perfect!",
        date: '2023-11-15'
      }
    ],
    menu: [
      {
        id: 'p1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 12.99,
        category: 'Pizza',
        photo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'p2',
        name: 'Pepperoni Pizza',
        description: 'Tomato sauce, mozzarella, and pepperoni',
        price: 14.99,
        category: 'Pizza',
        photo: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'p3',
        name: 'Vegetarian Pizza',
        description: 'Tomato sauce, mozzarella, bell peppers, mushrooms, and olives',
        price: 13.99,
        category: 'Pizza',
        photo: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'p4',
        name: 'Garlic Bread',
        description: 'Freshly baked bread with garlic butter and herbs',
        price: 5.99,
        category: 'Sides',
        photo: 'https://images.unsplash.com/photo-1573140401455-d82f626a486a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: '5',
    name: 'Student Apartments',
    ownerEmail: 'apartments@example.com',
    businessType: 'housing',
    description: 'Modern apartments designed specifically for student living, close to campus.',
    location: '555 University Drive',
    contactInfo: '555-321-6789',
    rating: 4.3,
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
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
    reviews: [
      {
        id: '501',
        userId: 'u13',
        userName: 'Mia Johnson',
        rating: 5,
        comment: 'Great location close to campus and the apartments are modern and well-maintained.',
        date: '2023-07-15'
      },
      {
        id: '502',
        userId: 'u14',
        userName: 'Noah Williams',
        rating: 4,
        comment: 'Good amenities and responsive management team. Walls could be a bit thicker though.',
        date: '2023-08-10'
      },
      {
        id: '503',
        userId: 'u15',
        userName: 'Olivia Davis',
        rating: 4,
        comment: "I've lived here for two years and love it. Study spaces are excellent.",
        date: '2023-10-20'
      }
    ],
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
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ]
      },
      {
        id: 'a2',
        name: 'One Bedroom Apartment',
        description: 'Comfortable one bedroom apartment with study area',
        price: 1000,
        bedrooms: 1,
        bathrooms: 1,
        available: true,
        amenities: ['WiFi', 'Utilities Included', 'Laundry Facilities', 'Study Desk'],
        photos: [
          'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ]
      },
      {
        id: 'a3',
        name: 'Two Bedroom Shared Apartment',
        description: 'Spacious two bedroom apartment perfect for sharing',
        price: 1400,
        bedrooms: 2,
        bathrooms: 2,
        available: false,
        amenities: ['WiFi', 'Utilities Included', 'Laundry Facilities', 'Study Room', 'Balcony'],
        photos: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ]
      }
    ]
  },
  {
    id: '6',
    name: 'Cozy Homestay',
    ownerEmail: 'homestay@example.com',
    businessType: 'housing',
    description: 'Family-run homestay offering comfortable rooms for international students.',
    location: '777 Garden Road',
    contactInfo: '555-654-3210',
    rating: 4.7,
    photos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    businessHours: {
      monday: '10:00 AM - 6:00 PM',
      tuesday: '10:00 AM - 6:00 PM',
      wednesday: '10:00 AM - 6:00 PM',
      thursday: '10:00 AM - 6:00 PM',
      friday: '10:00 AM - 6:00 PM',
      saturday: '11:00 AM - 3:00 PM',
      sunday: 'By appointment'
    },
    reviews: [
      {
        id: '601',
        userId: 'u16',
        userName: 'Peter Kim',
        rating: 5,
        comment: 'The hosts are extremely welcoming and have made my transition to studying abroad so much easier.',
        date: '2023-09-05'
      },
      {
        id: '602',
        userId: 'u17',
        userName: 'Quinn Chen',
        rating: 5,
        comment: 'Homemade meals are included and they are delicious! It really feels like a home away from home.',
        date: '2023-10-12'
      },
      {
        id: '603',
        userId: 'u18',
        userName: 'Rachel Smith',
        rating: 4,
        comment: 'Great location with good transportation links. The family is very helpful with local information.',
        date: '2023-11-09'
      }
    ],
    rooms: [
      {
        id: 'h1',
        name: 'Single Room',
        description: 'Cozy single room with shared bathroom',
        price: 600,
        bedrooms: 1,
        bathrooms: 0.5,
        available: true,
        amenities: ['Breakfast and Dinner Included', 'Laundry Service', 'WiFi', 'Study Desk'],
        photos: [
          'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1598928636135-d146006ff4be?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ]
      },
      {
        id: 'h2',
        name: 'Double Room with Balcony',
        description: 'Spacious double room with private balcony and ensuite bathroom',
        price: 850,
        bedrooms: 1,
        bathrooms: 1,
        available: true,
        amenities: ['Breakfast and Dinner Included', 'Laundry Service', 'WiFi', 'Study Desk', 'Private Balcony'],
        photos: [
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ]
      },
      {
        id: 'h3',
        name: 'Family Suite',
        description: 'Large room suitable for two students with shared facilities',
        price: 1100,
        bedrooms: 1,
        bathrooms: 1,
        available: false,
        amenities: ['Breakfast and Dinner Included', 'Laundry Service', 'WiFi', 'Study Desks', 'TV'],
        photos: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        ]
      }
    ]
  }
]; 