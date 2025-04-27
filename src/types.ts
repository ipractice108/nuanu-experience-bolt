import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'guide' | 'manager' | 'admin';
  managerType?: 'experience' | 'stay';
}

export interface Experience {
  id: string;
  name: string;
  category: Category;
  isPaid: boolean;
  description: string;
  imageUrl: string;
  price?: number;
  teacher: Teacher;  // Made required
  availableSlots?: TimeSlot[];
  isVisible?: boolean;
  createdBy?: string;
  updatedAt?: Date;
  locationId: string;  // Made required
  isFullyBooked?: boolean;
}

export interface Guide {
  id: string;
  userId: string;
  name: string;
  bio: string;
  photoUrl: string;
  specialties: string[];
  commission: number;
  totalEarnings: number;
  referralCode: string;
  referralCount: number;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  experienceId: string;
  guideId?: string;
  userId: string;
  timeSlot: TimeSlot;
  price: number;
  commission?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  referralCode?: string;
  createdAt: Date;
}

export interface Teacher {
  id: string;
  name: string;
  bio: string;
  photoUrl: string;
  specialties: string[];
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface CartItem {
  experience?: Experience;
  accommodation?: Accommodation;
  food?: {
    name: string;
    price: number;
    description?: string;
    venue?: string;
    orderDetails?: {
      deliveryOption: 'dine-in' | 'takeaway' | 'delivery';
      scheduledTime?: string;
      notes?: string;
    };
  };
  selectedSlot?: TimeSlot;
  selectedDates?: {
    checkIn: Date;
    checkOut: Date;
  };
  referralCode?: string;
}

export interface Accommodation {
  name: string;
  description: string;
  category: 'lux' | 'standard' | 'eco';
  imageUrl: string;
  price: string;
  pricePerNight: number;
  amenities: string[];
  concept: string;
  architecture: string;
  gallery: string[];
  isFullyBooked?: boolean;
}

export type Category = 'wellness' | 'education' | 'art' | 'creative';

export interface Location {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: 'education' | 'art' | 'wellness' | 'community' | 'nature' | 'coworking';
}

export const locations: Location[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Jungle Kids',
    description: 'Nature-based learning center for children',
    logo: 'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?auto=format&fit=crop&q=80',
    category: 'education'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Pro Ed',
    description: 'Professional education and training center',
    logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80',
    category: 'education'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Art Village',
    description: 'Creative hub for artists and art enthusiasts',
    logo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80',
    category: 'art'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Pasar Nusantara',
    description: 'Traditional market and cultural center',
    logo: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80',
    category: 'community'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    name: 'Nuanu Mall',
    description: 'Sustainable shopping and lifestyle center',
    logo: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&q=80',
    category: 'community'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174005',
    name: 'Aurora Media Park',
    description: 'Digital media and entertainment hub',
    logo: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80',
    category: 'art'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174006',
    name: 'Earth Sentinels',
    description: 'Environmental education and conservation center',
    logo: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80',
    category: 'nature'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174007',
    name: 'THK Tower',
    description: 'Modern coworking and office space',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
    category: 'coworking'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174008',
    name: 'Luna Beach Club',
    description: 'Beachfront wellness and leisure club',
    logo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
    category: 'wellness'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174009',
    name: 'Oshom',
    description: 'Holistic wellness and healing center',
    logo: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80',
    category: 'wellness'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174010',
    name: 'Ash',
    description: 'Contemporary art gallery and performance space',
    logo: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80',
    category: 'art'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174011',
    name: 'Odyssey Garden',
    description: 'Botanical garden and educational center',
    logo: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80',
    category: 'nature'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174012',
    name: 'Labyrinth Residence',
    description: 'Artist residency and creative space',
    logo: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&q=80',
    category: 'art'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174013',
    name: 'Sol Studio',
    description: 'Music and sound production studio',
    logo: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80',
    category: 'art'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174014',
    name: 'Long House',
    description: 'Traditional architecture and cultural center',
    logo: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80',
    category: 'community'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174015',
    name: 'Block 42',
    description: 'Urban farming and sustainability center',
    logo: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80',
    category: 'nature'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174016',
    name: 'Horizon Glassworks',
    description: 'Glass art studio and workshop space',
    logo: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80',
    category: 'art'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174017',
    name: 'Phoenix Lab',
    description: 'Innovation and technology hub',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
    category: 'education'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174018',
    name: 'Labyrinth Gallery',
    description: 'Contemporary art exhibition space',
    logo: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80',
    category: 'art'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174019',
    name: 'Labyrinth Dome',
    description: 'Immersive art and performance venue',
    logo: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80',
    category: 'art'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174020',
    name: 'Magic Garden',
    description: 'Children\'s nature play and learning space',
    logo: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80',
    category: 'nature'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174021',
    name: 'Pacha Alpaca',
    description: 'Animal therapy and education center',
    logo: 'https://images.unsplash.com/photo-1552474705-dd8183e00901?auto=format&fit=crop&q=80',
    category: 'nature'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174022',
    name: 'Red Tent',
    description: 'Women\'s wellness and community space',
    logo: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80',
    category: 'wellness'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174023',
    name: 'Lumeira',
    description: 'Meditation and mindfulness center',
    logo: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80',
    category: 'wellness'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174024',
    name: 'Connect',
    description: 'Community gathering and event space',
    logo: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80',
    category: 'community'
  }
];

export const experiences: Experience[] = [
  {
    id: '1',
    name: 'Palm Hat Workshop',
    category: 'art',
    isPaid: true,
    description: 'Learn the traditional art of palm hat weaving in this hands-on workshop. Create your own unique hat using sustainable materials.',
    imageUrl: 'https://images.unsplash.com/photo-1529111290557-82f6d5c6cf85?auto=format&fit=crop&q=80',
    price: 300000,
    teacher: {
      id: '101',
      name: 'Maria Garcia',
      bio: 'Master artisan specializing in traditional palm weaving techniques.',
      photoUrl: 'https://randomuser.me/api/portraits/women/52.jpg',
      specialties: ['Palm Weaving', 'Traditional Crafts', 'Sustainable Art'],
    },
    availableSlots: [
      { date: '2024-03-20', startTime: '10:00', endTime: '12:00', available: true },
      { date: '2024-03-22', startTime: '14:00', endTime: '16:00', available: true },
    ],
    locationId: '123e4567-e89b-12d3-a456-426614174002'
  },
  {
    id: '2',
    name: 'Glass Blowing Experience',
    category: 'art',
    isPaid: true,
    description: 'Discover the mesmerizing art of glass blowing. Create your own glass piece under expert guidance.',
    imageUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80',
    price: 450000,
    teacher: {
      id: '102',
      name: 'James Wilson',
      bio: 'Professional glass artist with 15 years of experience in glass blowing.',
      photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
      specialties: ['Glass Blowing', 'Sculpture', 'Contemporary Art'],
    },
    availableSlots: [
      { date: '2024-03-21', startTime: '09:00', endTime: '12:00', available: true },
      { date: '2024-03-23', startTime: '13:00', endTime: '16:00', available: true },
    ],
    locationId: '123e4567-e89b-12d3-a456-426614174016'
  }
];

export const accommodations: Accommodation[] = [
  {
    name: 'Oshom Beach Resort',
    description: 'Luxurious beachfront resort with stunning ocean views and private beach access.',
    category: 'lux',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
    price: 'From IDR 2,500,000/night',
    pricePerNight: 2500000,
    amenities: ['Private Beach', 'Infinity Pool', 'Spa', 'Fine Dining', '24/7 Concierge'],
    concept: 'Inspired by the natural beauty of coastal living, Oshom Beach Resort seamlessly blends modern luxury with traditional Indonesian architecture. Each villa is designed to maximize ocean views while providing ultimate privacy.',
    architecture: 'The resort features a collection of elevated pavilions connected by wooden walkways, allowing the natural landscape to flow underneath. The structures use sustainable materials including reclaimed teak, bamboo, and local stone.',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80'
    ],
    isFullyBooked: false
  },
  {
    name: 'Skyline Penthouse',
    description: 'Exclusive penthouse suite with panoramic views and premium amenities.',
    category: 'lux',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80',
    price: 'From IDR 3,000,000/night',
    pricePerNight: 3000000,
    amenities: ['Private Terrace', 'Personal Chef', 'Home Theater', 'Private Elevator', 'Butler Service'],
    concept: 'A sophisticated urban retreat that combines contemporary design with ultimate luxury, offering an unparalleled city living experience.',
    architecture: 'Modern minimalist design with floor-to-ceiling windows, featuring premium materials like marble, glass, and brushed metal throughout.',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1536858974309-9ef456cf7650?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80'
    ],
    isFullyBooked: false
  },
  {
    name: 'Urban Comfort Suite',
    description: 'Modern and comfortable suite in the heart of the city.',
    category: 'standard',
    imageUrl: 'https://images.unsplash.com/photo-1551105378-78e609e1d468?auto=format&fit=crop&q=80',
    price: 'From IDR 800,000/night',
    pricePerNight: 800000,
    amenities: ['City View', 'Workspace', 'Kitchenette', 'Gym Access', 'Daily Housekeeping'],
    concept: 'A perfect blend of comfort and convenience, designed for both business and leisure travelers.',
    architecture: 'Contemporary urban architecture with efficient space utilization and modern amenities.',
    gallery: [
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80'
    ],
    isFullyBooked: false
  },
  {
    name: 'Garden View Room',
    description: 'Peaceful room overlooking our beautiful gardens.',
    category: 'standard',
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80',
    price: 'From IDR 600,000/night',
    pricePerNight: 600000,
    amenities: ['Garden View', 'Balcony', 'Room Service', 'Wi-Fi', 'Mini Bar'],
    concept: 'A tranquil retreat that brings nature closer to your doorstep while maintaining modern comforts.',
    architecture: 'Traditional design elements combined with modern amenities, featuring large windows and private balconies.',
    gallery: [
      'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80'
    ],
    isFullyBooked: false
  },
  {
    name: 'Bamboo Eco Villa',
    description: 'Sustainable villa built entirely from bamboo and recycled materials.',
    category: 'eco',
    imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80',
    price: 'From IDR 1,200,000/night',
    pricePerNight: 1200000,
    amenities: ['Solar Power', 'Organic Garden', 'Natural Pool', 'Eco Tours', 'Composting'],
    concept: 'An eco-conscious retreat that demonstrates sustainable living without compromising on comfort.',
    architecture: 'Innovative bamboo architecture that showcases the versatility and beauty of sustainable building materials.',
    gallery: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595877244574-e90ce41ce089?auto=format&fit=crop&q=80'
    ],
    isFullyBooked: false
  },
  {
    name: 'TreeTop Hideaway',
    description: 'Elevated eco-lodge nestled in the treetops.',
    category: 'eco',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
    price: 'From IDR 1,500,000/night',
    pricePerNight: 1500000,
    amenities: ['Rainforest Views', 'Bird Watching', 'Eco Bathroom', 'Local Guides', 'Sustainable Materials'],
    concept: 'An immersive nature experience that puts you at eye level with the forest canopy.',
    architecture: 'Thoughtfully designed treehouse structures that blend seamlessly with the natural environment.',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80'
    ],
    isFullyBooked: false
  }
];