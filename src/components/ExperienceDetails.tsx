import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Clock, Star, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from './CartContext';
import { supabase } from '../lib/supabase';
import type { Experience, TimeSlot } from '../types';

export function ExperienceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [experience, setExperience] = useState<Experience | null>(null);
  const { addToCart, items, hasTimeConflict } = useCart();

  useEffect(() => {
    async function fetchExperience() {
      try {
        const { data: experienceData, error: experienceError } = await supabase
          .from('experiences')
          .select(`
            *,
            experience_dates (
              id,
              date,
              start_time,
              end_time,
              is_recurring,
              recurrence_type,
              weekdays,
              weekly_start,
              weekly_end,
              is_paid,
              price
            )
          `)
          .eq('id', id)
          .single();

        if (experienceError) throw experienceError;
        if (!experienceData) throw new Error('Experience not found');

        // Map the data to match our Experience type
        const mappedExperience: Experience = {
          id: experienceData.id,
          name: experienceData.name,
          description: experienceData.description,
          category: experienceData.category,
          isPaid: experienceData.experience_dates.some((date: any) => date.is_paid),
          price: experienceData.experience_dates.find((date: any) => date.is_paid)?.price || null,
          imageUrl: experienceData.image_url || '',
          isVisible: experienceData.is_visible,
          createdBy: experienceData.created_by,
          locationId: experienceData.location_id,
          isFullyBooked: experienceData.is_fully_booked || false,
          availableSlots: experienceData.experience_dates.map((date: any) => ({
            date: date.date || '',
            startTime: date.start_time,
            endTime: date.end_time,
            available: true
          }))
        };

        setExperience(mappedExperience);
      } catch (err) {
        console.error('Error fetching experience:', err);
        setError('Failed to load experience');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchExperience();
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nuanu"></div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Experience not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Experiences
        </button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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

      setError(null);
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

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Experiences
      </button>

      <div className="bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="h-96 overflow-hidden">
          <img
            src={experience.imageUrl}
            alt={experience.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{experience.name}</h1>
            {experience.price && (
              <span className="text-2xl font-bold text-nuanu">
                {formatPrice(experience.price)}
              </span>
            )}
          </div>

          <span className="inline-block px-4 py-2 bg-nuanu/10 text-nuanu rounded-full text-sm mb-6">
            {experience.category}
          </span>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-600 text-lg leading-relaxed">
              {experience.description}
            </p>
          </div>

          {experience.teacher && (
            <div className="mb-8 p-6 bg-nuanu/5 rounded-xl">
              <h2 className="text-2xl font-semibold mb-4">Meet Your Guide</h2>
              <div className="flex gap-6">
                <img
                  src={experience.teacher.photoUrl}
                  alt={experience.teacher.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{experience.teacher.name}</h3>
                  <p className="text-gray-600 mb-4">{experience.teacher.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {experience.teacher.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-nuanu/10 text-nuanu rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {experience.availableSlots && experience.availableSlots.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Sessions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          )}

          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className={`flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg font-medium ${
                selectedSlot
                  ? 'bg-nuanu text-white hover:bg-nuanu-light'
                  : 'bg-nuanu/10 text-nuanu cursor-not-allowed'
              }`}
              disabled={!selectedSlot}
            >
              <Plus className="w-6 h-6" />
              Add to Journey
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
            >
              View Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}