import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Trash2, Clock, MapPin, Truck } from 'lucide-react';
import { useCart } from './CartContext';

export function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, removeFromCart, getTotal } = useCart();

  const handleBack = () => {
    // Go back to previous page
    navigate(-1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDeliveryIcon = (option: 'dine-in' | 'takeaway' | 'delivery') => {
    switch (option) {
      case 'dine-in':
        return <Clock className="w-5 h-5" />;
      case 'takeaway':
        return <MapPin className="w-5 h-5" />;
      case 'delivery':
        return <Truck className="w-5 h-5" />;
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="mb-6 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Journey is Empty</h2>
          <p className="text-gray-600 mb-8">Start exploring experiences to add to your journey!</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-nuanu text-white rounded-lg hover:bg-nuanu-light transition-colors"
          >
            Browse Experiences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={handleBack}
        className="mb-6 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Journey</h1>

      <div className="space-y-6 mb-8">
        {items.map((item, index) => {
          if (item.experience) {
            // Experience booking
            return (
              <div
                key={`${item.experience.name}-${index}`}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <img
                      src={item.experience.imageUrl}
                      alt={item.experience.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {item.experience.name}
                          </h3>
                          <p className="text-gray-600 mb-4">{item.experience.description}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.experience.name)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Date:</span>{' '}
                            {formatDate(item.selectedSlot!.date)}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Time:</span>{' '}
                            {item.selectedSlot!.startTime} - {item.selectedSlot!.endTime}
                          </p>
                        </div>
                        {item.experience.price && (
                          <span className="text-lg font-semibold text-nuanu">
                            {formatPrice(item.experience.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else if (item.accommodation) {
            // Accommodation booking
            return (
              <div
                key={`${item.accommodation.name}-${index}`}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    <img
                      src={item.accommodation.imageUrl}
                      alt={item.accommodation.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {item.accommodation.name}
                          </h3>
                          <p className="text-gray-600 mb-4">{item.accommodation.description}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.accommodation.name)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-gray-700 mb-1">
                            <span className="font-medium">Check-in:</span>{' '}
                            {formatDate(item.selectedDates!.checkIn)}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Check-out:</span>{' '}
                            {formatDate(item.selectedDates!.checkOut)}
                          </p>
                        </div>
                        <span className="text-lg font-semibold text-nuanu">
                          {formatPrice(
                            item.accommodation.pricePerNight *
                              Math.ceil(
                                (item.selectedDates!.checkOut.getTime() -
                                  item.selectedDates!.checkIn.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else if (item.food) {
            // Food order
            return (
              <div
                key={`${item.food.name}-${index}`}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {item.food.image && (
                      <img
                        src={item.food.image}
                        alt={item.food.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {item.food.name}
                            </h3>
                            <span className="text-gray-500">from {item.food.venue}</span>
                          </div>
                          {item.food.description && (
                            <p className="text-gray-600 mb-4">{item.food.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.food.name)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {getDeliveryIcon(item.food.orderDetails?.deliveryOption || 'dine-in')}
                          <span className="font-medium capitalize">
                            {item.food.orderDetails?.deliveryOption || 'Dine-in'}
                          </span>
                        </div>
                        {item.food.orderDetails?.scheduledTime && (
                          <p className="text-gray-600 mb-2">
                            <span className="font-medium">Scheduled for:</span>{' '}
                            {new Date(item.food.orderDetails.scheduledTime).toLocaleString()}
                          </p>
                        )}
                        {item.food.orderDetails?.notes && (
                          <p className="text-gray-600">
                            <span className="font-medium">Notes:</span>{' '}
                            {item.food.orderDetails.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end mt-4">
                        <span className="text-lg font-semibold text-nuanu">
                          {formatPrice(item.food.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-nuanu">
            {formatPrice(getTotal())}
          </span>
        </div>
        <button className="w-full py-3 bg-nuanu text-white rounded-lg hover:bg-nuanu-light transition-colors font-medium">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}