import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Experience } from '../types';
import { DollarSign, Plus, ShoppingBag, X } from 'lucide-react';
import { useCart } from './CartContext';
import { TimeSlotSelector } from './TimeSlotSelector';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const navigate = useNavigate();
  const { items } = useCart();
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  
  const isInCart = items.some(item => 
    item.experience && item.experience.name === experience.name
  );
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
        <div className="h-48 overflow-hidden">
          <img
            src={experience.imageUrl}
            alt={experience.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-800">{experience.name}</h3>
            {!experience.isPaid && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Free
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4">{experience.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="px-3 py-1 bg-nuanu/10 text-nuanu rounded-full text-sm">
              {experience.category}
            </span>
            {experience.isPaid && experience.price && (
              <span className="text-lg font-semibold text-nuanu">
                {formatPrice(experience.price)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => navigate(`/experience/${experience.id}`)}
              className="px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light transition-colors text-center"
            >
              Learn More
            </button>
            <button 
              onClick={isInCart ? () => navigate('/cart') : () => setShowTimeSlots(true)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isInCart 
                  ? 'bg-nuanu text-white hover:bg-nuanu-light'
                  : 'bg-nuanu/10 text-nuanu hover:bg-nuanu/20'
              }`}
            >
              {isInCart ? (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  View in Cart
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add to Journey
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Time Slot Selection Modal */}
      {showTimeSlots && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Select a Time</h2>
                <button 
                  onClick={() => setShowTimeSlots(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <TimeSlotSelector 
                experience={experience}
                onClose={() => setShowTimeSlots(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}