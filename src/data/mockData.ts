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