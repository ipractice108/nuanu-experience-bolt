import React, { useState } from 'react';
import { Building2, Star, Leaf, ChevronRight, Calendar, Check, Home } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import type { Accommodation } from '../types';

const categoryInfo = {
  lux: {
    title: 'Luxury Stays',
    description: 'Premium accommodations with exceptional amenities and service',
    icon: Star,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80'
  },
  standard: {
    title: 'Standard Stays',
    description: 'Comfortable and well-appointed accommodations for a pleasant stay',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80'
  },
  eco: {
    title: 'Eco Stays',
    description: 'Sustainable and environmentally conscious accommodation options',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80'
  }
};

const accommodations: Accommodation[] = [
  // Luxury Stays
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
    ]
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
    ]
  },
  // Standard Stays
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
    ]
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
    ]
  },
  // Eco Stays
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
    ]
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
    ]
  }
];

interface BookingDate {
  date: Date;
  available: boolean;
}

function generateAvailableDates(): BookingDate[] {
  const dates: BookingDate[] = [];
  const startDate = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push({
      date,
      available: Math.random() > 0.3 // 70% chance of being available
    });
  }
  return dates;
}

export function StayPage() {
  const [selectedCategory, setSelectedCategory] = useState<'lux' | 'standard' | 'eco' | null>(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [availableDates] = useState<BookingDate[]>(generateAvailableDates());
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleDateClick = (date: Date) => {
    if (selectedDates.length === 2) {
      setSelectedDates([date]);
    } else if (selectedDates.length === 0) {
      setSelectedDates([date]);
    } else {
      const [start] = selectedDates;
      if (date > start) {
        setSelectedDates([start, date]);
      } else {
        setSelectedDates([date, start]);
      }
    }
  };

  const handleBookNow = () => {
    if (selectedAccommodation && selectedDates.length === 2) {
      addToCart({
        accommodation: selectedAccommodation,
        selectedDates: {
          checkIn: selectedDates[0],
          checkOut: selectedDates[1]
        }
      });
      navigate('/cart');
    }
  };

  const isDateInRange = (date: Date) => {
    if (selectedDates.length !== 2) return false;
    return date >= selectedDates[0] && date <= selectedDates[1];
  };

  if (selectedAccommodation) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedAccommodation(null)}
          className="mb-8 flex items-center text-nuanu hover:text-nuanu-light font-medium"
        >
          <ChevronRight className="w-5 h-5 rotate-180 mr-1" />
          Back to {categoryInfo[selectedCategory!].title}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-6">
            <div className="h-96 overflow-hidden rounded-lg">
              <img
                src={selectedAccommodation.imageUrl}
                alt={selectedAccommodation.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {selectedAccommodation.gallery.map((image, index) => (
                <div key={index} className="h-32 overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt={`${selectedAccommodation.name} gallery ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedAccommodation.name}</h1>
              <p className="text-xl text-nuanu font-semibold">{selectedAccommodation.price}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Concept</h2>
              <p className="text-gray-600 leading-relaxed">{selectedAccommodation.concept}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Architecture</h2>
              <p className="text-gray-600 leading-relaxed">{selectedAccommodation.architecture}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {selectedAccommodation.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Calendar */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Check Availability</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {availableDates.map((bookingDate, index) => {
                    const isAvailable = bookingDate.available;
                    const isSelected = selectedDates.some(date => 
                      date.toDateString() === bookingDate.date.toDateString()
                    );
                    const isInRange = isDateInRange(bookingDate.date);

                    return (
                      <button
                        key={index}
                        onClick={() => isAvailable && handleDateClick(bookingDate.date)}
                        disabled={!isAvailable}
                        className={`
                          p-2 rounded-lg text-center transition-colors
                          ${isSelected ? 'bg-nuanu text-white' : ''}
                          ${isInRange ? 'bg-nuanu/10 text-nuanu' : ''}
                          ${!isAvailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-nuanu/10'}
                        `}
                      >
                        {bookingDate.date.getDate()}
                      </button>
                    );
                  })}
                </div>

                {selectedDates.length === 2 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {selectedDates[0].toLocaleDateString()} - {selectedDates[1].toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-nuanu">
                        {((selectedDates[1].getTime() - selectedDates[0].getTime()) / (1000 * 60 * 60 * 24) + 1)} nights
                      </span>
                    </div>
                    <button 
                      onClick={handleBookNow}
                      className="w-full py-3 bg-nuanu text-white rounded-lg hover:bg-nuanu-light transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const filteredAccommodations = accommodations.filter(acc => acc.category === selectedCategory);
    const CategoryIcon = categoryInfo[selectedCategory].icon;

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className="mb-8 flex items-center text-nuanu hover:text-nuanu-light font-medium"
        >
          <ChevronRight className="w-5 h-5 rotate-180 mr-1" />
          Back to Categories
        </button>

        <div className="flex items-center gap-2 mb-8">
          <CategoryIcon className="w-8 h-8 text-nuanu" />
          <h1 className="text-3xl font-bold text-gray-900">{categoryInfo[selectedCategory].title}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccommodations.map(accommodation => (
            <button
              key={accommodation.name}
              onClick={() => setSelectedAccommodation(accommodation)}
              className="text-left bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={accommodation.imageUrl}
                  alt={accommodation.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{accommodation.name}</h3>
                <p className="text-gray-600 mb-4">{accommodation.description}</p>
                <p className="text-nuanu font-semibold mb-4">{accommodation.price}</p>
                <div className="flex flex-wrap gap-2">
                  {accommodation.amenities.map(amenity => (
                    <span key={amenity} className="px-3 py-1 bg-nuanu/10 text-nuanu rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Choose Your Stay</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(categoryInfo) as Array<keyof typeof categoryInfo>).map((category) => {
          const { title, description, icon: Icon, image } = categoryInfo[category];
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-6 h-6 text-nuanu" />
                  <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                </div>
                <p className="text-gray-600">{description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <a 
          href="https://realestate.nuanu.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-12 py-6 bg-nuanu text-white text-xl font-semibold rounded-lg hover:bg-nuanu-light transition-colors gap-4"
        >
          <Home className="w-8 h-8" />
          Nuanu Real Estate
        </a>
      </div>
    </div>
  );
}