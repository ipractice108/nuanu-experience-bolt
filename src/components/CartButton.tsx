import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';

export function CartButton() {
  const navigate = useNavigate();
  const { items } = useCart();

  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed bottom-20 right-8 bg-nuanu text-white p-4 rounded-full shadow-lg hover:bg-nuanu-light transition-colors flex items-center gap-2"
    >
      <ShoppingBag className="w-6 h-6" />
      {items.length > 0 && (
        <span className="bg-white text-nuanu rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {items.length}
        </span>
      )}
    </button>
  );
}