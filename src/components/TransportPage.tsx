import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bike, Car, Bus, MapPin, Clock, Calendar } from 'lucide-react';

interface VehicleDetails {
  id: string;
  name: string;
  description: string;
  icon: any;
  price: string | { [key: string]: string };
  image?: string;
}

export function TransportPage() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(null);
  const [selectedTaxiType, setSelectedTaxiType] = useState<'standard' | 'premium' | null>(null);

  const transportOptions: VehicleDetails[] = [
    {
      id: 'scooter',
      name: 'Nuanu Scooter',
      description: 'Eco-friendly electric scooters perfect for exploring the city. Our scooters are equipped with safety features and are regularly maintained for optimal performance.',
      icon: Bike,
      price: '50,000 IDR/hour',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80'
    },
    {
      id: 'buggy',
      name: 'Nuanu Buggy',
      description: 'All-terrain electric buggies for adventure seekers. Perfect for exploring off-road trails and beach areas.',
      icon: Car,
      price: {
        day: '500,000 IDR/day',
        week: '2,800,000 IDR/week',
        month: '9,000,000 IDR/month'
      },
      image: 'https://images.unsplash.com/photo-1533591380348-14193f1de18f?auto=format&fit=crop&q=80'
    },
    {
      id: 'taxi',
      name: 'Nuanu Electro Taxi',
      description: 'Zero-emission taxi service with professional drivers. Choose between standard and premium vehicles.',
      icon: Car,
      price: {
        standard: '100,000 IDR/ride',
        premium: '150,000 IDR/ride'
      },
      image: 'https://images.unsplash.com/photo-1614026480418-bd11fdb9fa06?auto=format&fit=crop&q=80'
    },
    {
      id: 'bus',
      name: 'Nuanu Bus GPS',
      description: 'GPS-tracked shuttle service for group transportation. Track your bus in real-time through our app.',
      icon: Bus,
      price: '75,000 IDR/person',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80'
    }
  ];

  const handleBooking = (transportId: string) => {
    const vehicle = transportOptions.find(option => option.id === transportId);
    if (!vehicle) return;

    if (transportId === 'taxi') {
      setSelectedVehicle(vehicle);
      setSelectedTaxiType(null);
    } else {
      setSelectedVehicle(vehicle);
    }
  };

  const handleTaxiTypeSelect = (type: 'standard' | 'premium') => {
    setSelectedTaxiType(type);
    // Here you would typically navigate to the booking form
    alert(`Booking ${type} taxi - This feature is coming soon!`);
  };

  const renderVehicleDetails = () => {
    if (!selectedVehicle) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative h-64">
            <img
              src={selectedVehicle.image}
              alt={selectedVehicle.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => {
                setSelectedVehicle(null);
                setSelectedTaxiType(null);
              }}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedVehicle.name}</h2>
            <p className="text-gray-600 mb-6">{selectedVehicle.description}</p>

            {selectedVehicle.id === 'taxi' ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Vehicle Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTaxiTypeSelect('standard')}
                    className="p-4 border-2 rounded-lg hover:border-nuanu transition-colors"
                  >
                    <h4 className="font-medium mb-2">Standard</h4>
                    <p className="text-gray-600 text-sm mb-2">Comfortable sedan for daily rides</p>
                    <p className="text-nuanu font-semibold">100,000 IDR/ride</p>
                  </button>
                  <button
                    onClick={() => handleTaxiTypeSelect('premium')}
                    className="p-4 border-2 rounded-lg hover:border-nuanu transition-colors"
                  >
                    <h4 className="font-medium mb-2">Premium</h4>
                    <p className="text-gray-600 text-sm mb-2">Luxury vehicle for special occasions</p>
                    <p className="text-nuanu font-semibold">150,000 IDR/ride</p>
                  </button>
                </div>
              </div>
            ) : selectedVehicle.id === 'buggy' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Daily Rate</p>
                    <p className="text-lg font-semibold text-nuanu">500,000 IDR</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Weekly Rate</p>
                    <p className="text-lg font-semibold text-nuanu">2.8M IDR</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Monthly Rate</p>
                    <p className="text-lg font-semibold text-nuanu">9M IDR</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Buggy booking - Coming soon!')}
                  className="w-full py-3 bg-nuanu text-white rounded-lg hover:bg-nuanu-light"
                >
                  Book Now
                </button>
              </div>
            ) : selectedVehicle.id === 'scooter' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="text-lg font-semibold text-nuanu">50,000 IDR</p>
                  </div>
                  <Clock className="w-6 h-6 text-gray-400" />
                </div>
                <button
                  onClick={() => alert('Scooter booking - Coming soon!')}
                  className="w-full py-3 bg-nuanu text-white rounded-lg hover:bg-nuanu-light"
                >
                  Book Now
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Live GPS Tracking</h3>
                    <p className="text-sm text-gray-600">Track your bus in real-time</p>
                  </div>
                  <MapPin className="w-6 h-6 text-nuanu" />
                </div>
                <button
                  onClick={() => alert('Opening GPS tracking...')}
                  className="w-full py-3 bg-nuanu text-white rounded-lg hover:bg-nuanu-light"
                >
                  Track Bus Location
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center text-nuanu hover:text-nuanu-light font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Home
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Transportation</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {transportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-nuanu/10 rounded-lg">
                    <Icon className="w-8 h-8 text-nuanu" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{option.name}</h3>
                    <p className="text-nuanu font-medium">
                      {typeof option.price === 'string' ? option.price : 'Starting from ' + Object.values(option.price)[0]}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{option.description}</p>
                <button
                  onClick={() => handleBooking(option.id)}
                  className="w-full py-3 bg-nuanu text-white rounded-lg hover:bg-nuanu-light transition-colors"
                >
                  {option.id === 'bus' ? 'Track Location' : 'Book Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedVehicle && renderVehicleDetails()}
    </div>
  );
}