import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { 
  LogOut, Calendar, DollarSign, BarChart3, QrCode,
  Users, Share2, Clock
} from 'lucide-react';

export function GuideDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showQRCode, setShowQRCode] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role !== 'guide') {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data - replace with actual data from your backend
  const mockGuideData = {
    name: "John Doe",
    totalEarnings: 15000000,
    referralCode: "GUIDE123",
    referralCount: 25,
    upcomingBookings: [
      {
        experienceName: "Cultural Tour",
        date: "2025-03-20",
        time: "09:00 - 11:00",
        guestCount: 4,
        commission: 200000
      }
    ]
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guide Dashboard</h1>
          <p className="text-gray-600">Welcome back, {mockGuideData.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-red-600 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700">Total Earnings</h3>
            <DollarSign className="w-5 h-5 text-nuanu" />
          </div>
          <p className="text-2xl font-bold text-nuanu">
            {formatPrice(mockGuideData.totalEarnings)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700">Referral Count</h3>
            <Users className="w-5 h-5 text-nuanu" />
          </div>
          <p className="text-2xl font-bold text-nuanu">
            {mockGuideData.referralCount} guests
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700">Commission Rate</h3>
            <BarChart3 className="w-5 h-5 text-nuanu" />
          </div>
          <p className="text-2xl font-bold text-nuanu">10%</p>
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Referral Program</h2>
          <button
            onClick={() => setShowQRCode(!showQRCode)}
            className="flex items-center px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light"
          >
            <QrCode className="w-5 h-5 mr-2" />
            {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 mb-4">
              Share your unique referral code with guests to earn 10% commission on their bookings.
              Guests will receive a 5% discount on their first booking.
            </p>
            
            <div className="bg-nuanu/5 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Referral Code</p>
                <p className="text-xl font-bold text-nuanu">{mockGuideData.referralCode}</p>
              </div>
              <button className="flex items-center text-nuanu hover:text-nuanu-light">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showQRCode && (
            <div className="flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Bookings</h2>
        
        <div className="space-y-6">
          {mockGuideData.upcomingBookings.map((booking, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{booking.experienceName}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(booking.date)}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {booking.time}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {booking.guestCount} guests
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Commission</p>
                  <p className="text-lg font-semibold text-nuanu">
                    {formatPrice(booking.commission)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {mockGuideData.upcomingBookings.length === 0 && (
            <p className="text-center text-gray-600 py-8">
              No upcoming bookings
            </p>
          )}
        </div>
      </div>
    </div>
  );
}