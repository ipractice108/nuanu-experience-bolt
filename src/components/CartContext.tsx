import React, { createContext, useContext, useState } from 'react';
import { CartItem, TimeSlot } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => { success: boolean; message?: string };
  removeFromCart: (itemId: string) => void;
  getTotal: () => number;
  hasTimeConflict: (newSlot: TimeSlot) => { hasConflict: boolean; conflictingExperience?: string };
}

export const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => ({ success: false }),
  removeFromCart: () => {},
  getTotal: () => 0,
  hasTimeConflict: () => ({ hasConflict: false }),
});

const checkTimeOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  if (slot1.date !== slot2.date) return false;

  const [start1H, start1M] = slot1.startTime.split(':').map(Number);
  const [end1H, end1M] = slot1.endTime.split(':').map(Number);
  const [start2H, start2M] = slot2.startTime.split(':').map(Number);
  const [end2H, end2M] = slot2.endTime.split(':').map(Number);

  const start1 = start1H * 60 + start1M;
  const end1 = end1H * 60 + end1M;
  const start2 = start2H * 60 + start2M;
  const end2 = end2H * 60 + end2M;

  return (start1 < end2 && end1 > start2);
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const hasTimeConflict = (newSlot: TimeSlot) => {
    for (const item of items) {
      if (item.experience && item.selectedSlot) {
        if (checkTimeOverlap(newSlot, item.selectedSlot)) {
          return {
            hasConflict: true,
            conflictingExperience: item.experience.name
          };
        }
      }
    }
    return { hasConflict: false };
  };

  const addToCart = (item: CartItem) => {
    if (item.experience && item.selectedSlot) {
      const conflict = hasTimeConflict(item.selectedSlot);
      if (conflict.hasConflict) {
        return {
          success: false,
          message: `This time slot conflicts with "${conflict.conflictingExperience}" in your journey`
        };
      }
    }

    setItems((currentItems) => {
      // For accommodations, replace any existing booking
      if (item.accommodation) {
        const filteredItems = currentItems.filter(
          (i) => !i.accommodation || i.accommodation.name !== item.accommodation!.name
        );
        return [...filteredItems, item];
      }
      
      // For experiences, allow multiple but prevent duplicates
      if (item.experience) {
        const hasExactSameBooking = currentItems.some(
          (i) => 
            i.experience?.name === item.experience?.name &&
            i.selectedSlot?.date === item.selectedSlot?.date &&
            i.selectedSlot?.startTime === item.selectedSlot?.startTime
        );

        if (hasExactSameBooking) {
          return currentItems;
        }
      }

      return [...currentItems, item];
    });

    return { success: true };
  };

  const removeFromCart = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => 
        (item.experience?.name !== itemId) && 
        (item.accommodation?.name !== itemId)
      )
    );
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      if (item.experience) {
        return total + (item.experience.price || 0);
      }
      if (item.accommodation && item.selectedDates) {
        const nights = Math.ceil(
          (item.selectedDates.checkOut.getTime() - item.selectedDates.checkIn.getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        return total + (item.accommodation.pricePerNight * nights);
      }
      return total;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, getTotal, hasTimeConflict }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);