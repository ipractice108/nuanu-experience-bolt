import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Experience, TimeSlot } from '../types';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useCart } from './CartContext';

interface TimeSlotSelectorProps {
  experience: Experience;
  onClose: () => void;
}

export function TimeSlotSelector({ experience, onClose }: TimeSlotSelectorProps) {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, items, hasTimeConflict } = useCart();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddToCart = () => {
    if (selectedSlot) {
      const result = addToCart({
        experience,
        selectedSlot,
      });

      if (!result.success) {
        setError(result.message || 'Could not add to journey');
        return;
      }

      onClose();
      navigate('/cart');
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    const conflict = hasTimeConflict(slot);
    if (conflict.hasConflict) {
      setError(`This time slot conflicts with "${conflict.conflictingExperience}" in your journey`);
      setSelectedSlot(null);
    } else {
      setError(null);
      setSelectedSlot(slot);
    }
  };

  const isSlotBooked = (slot: TimeSlot) => {
    return items.some(
      item => 
        item.experience?.name === experience.name &&
        item.selectedSlot?.date === slot.date &&
        item.selectedSlot?.startTime === slot.startTime
    );
  };

  if (!experience.availableSlots || experience.availableSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No available time slots</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {experience.availableSlots.map((slot, index) => {
          const isBooked = isSlotBooked(slot);
          const hasConflict = hasTimeConflict(slot).hasConflict;

          return (
            <button
              key={index}
              onClick={() => !isBooked && !hasConflict && handleSlotSelect(slot)}
              disabled={isBooked || hasConflict}
              className={`p-4 rounded-lg border-2 transition-all ${
                isBooked
                  ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                  : hasConflict
                  ? 'bg-red-50 border-red-200 cursor-not-allowed'
                  : selectedSlot === slot
                  ? 'border-nuanu bg-nuanu/5'
                  : 'border-gray-200 hover:border-nuanu/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-nuanu" />
                <span className="font-medium">{formatDate(slot.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>{slot.startTime} - {slot.endTime}</span>
              </div>
              {isBooked && (
                <span className="mt-2 text-sm text-gray-500">Already booked</span>
              )}
              {hasConflict && (
                <span className="mt-2 text-sm text-red-500">Time conflict</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          className={`flex-1 px-6 py-3 rounded-lg transition-colors text-lg font-medium ${
            selectedSlot
              ? 'bg-nuanu text-white hover:bg-nuanu-light'
              : 'bg-nuanu/10 text-nuanu cursor-not-allowed'
          }`}
          disabled={!selectedSlot}
        >
          Add to Journey
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}