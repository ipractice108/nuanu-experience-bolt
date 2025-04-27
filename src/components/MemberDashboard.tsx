import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { 
  LogOut, QrCode, Calendar, Trophy, BarChart3, 
  BookOpen, Palette, Heart, Sparkles, Clock, Star 
} from 'lucide-react';
import { Experience, Category } from '../types';
import { experiences } from '../types';

interface CategoryProgress {
  category: Category;
  completed: number;
  total: number;
  level: number;
  icon: React.ReactNode;
}

export function MemberDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role !== 'member') {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data - replace with actual data from your backend
  const mockMemberData = {
    name: "Sarah Johnson",
    qrCode: "MEMBER123",
    completedExperiences: [
      {
        ...experiences[0],
        completedDate: '2024-02-15',
        rating: 5,
        feedback: "Amazing workshop! Learned so much about palm hat weaving."
      },
      {
        ...experiences[3],
        completedDate: '2024-02-20',
        rating: 4,
        feedback: "Great introduction to music production."
      }
    ],
    upcomingBookings: experiences
      .slice(4, 6)
      .map(exp => ({
        ...exp,
        bookingDate: '2024-03-25',
        bookingTime: '14:00 - 16:00'
      }))
  };

  const categoryIcons = {
    art: <Palette className="w-6 h-6" />,
    education: <BookOpen className="w-6 h-6" />,
    wellness: <Heart className="w-6 h-6" />,
    creative: <Sparkles className="w-6 h-6" />
  };

  // Calculate progress for each category
  const calculateCategoryProgress = (): CategoryProgress[] => {
    const categories = ['art', 'education', 'wellness', 'creative'] as Category[];
    
    return categories.map(category => {
      const totalInCategory = experiences.filter(exp => exp.category === category).length;
      const completedInCategory = mockMemberData.completedExperiences.filter(
        exp => exp.category === category
      ).length;
      
      // Calculate level based on completion percentage
      const percentage = (completedInCategory / totalInCategory) * 100;
      const level = Math.floor(percentage / 20) + 1; // Level 1-5 based on 20% increments

      return {
        category,
        completed: completedInCategory,
        total: totalInCategory,
        level,
        icon: categoryIcons[category]
      };
    });
  };

  const categoryProgress = calculateCategoryProgress();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Dashboard</h1>
          <p className="text-gray-600">Welcome back, {mockMemberData.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-red-600 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - QR Code and Stats */}
        <div className="space-y-8">
          {/* QR Code */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Member QR Code</h2>
            <div className="flex flex-col items-center">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <QrCode className="w-48 h-48 text-nuanu" />
              </div>
              <p className="text-sm text-gray-600">
                Show this QR code to get member benefits
              </p>
              <p className="text-lg font-semibold text-nuanu mt-2">
                {mockMemberData.qrCode}
              </p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
            <div className="space-y-4">
              {categoryProgress.map((progress) => (
                <div key={progress.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {progress.icon}
                      <span className="capitalize">{progress.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium">Level {progress.level}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-nuanu rounded-full transition-all"
                      style={{ 
                        width: `${(progress.completed / progress.total) * 100}%` 
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {progress.completed} of {progress.total} experiences completed
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - History and Upcoming */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Experiences</h2>
            <div className="space-y-4">
              {mockMemberData.upcomingBookings.map((booking, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={booking.imageUrl}
                    alt={booking.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{booking.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{booking.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(booking.bookingDate)}
                      </span>
                      <span className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {booking.bookingTime}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-nuanu font-medium">
                      {formatPrice(booking.price || 0)}
                    </span>
                  </div>
                </div>
              ))}

              {mockMemberData.upcomingBookings.length === 0 && (
                <p className="text-center text-gray-600 py-4">
                  No upcoming bookings
                </p>
              )}
            </div>
          </div>

          {/* Completed Experiences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Experiences</h2>
            <div className="space-y-6">
              {mockMemberData.completedExperiences.map((experience, index) => (
                <div 
                  key={index}
                  className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={experience.imageUrl}
                      alt={experience.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{experience.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Completed on {formatDate(experience.completedDate)}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < experience.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 italic">"{experience.feedback}"</p>
                    </div>
                  </div>
                </div>
              ))}

              {mockMemberData.completedExperiences.length === 0 && (
                <p className="text-center text-gray-600 py-4">
                  No completed experiences yet
                </p>
              )}
            </div>
          </div>

          {/* Growth Analytics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Growth</h2>
              <div className="flex items-center gap-2 text-nuanu">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Progress Analytics</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryProgress.map((progress) => (
                <div
                  key={progress.category}
                  className="bg-gray-50 rounded-lg p-4 text-center"
                >
                  <div className="flex justify-center mb-2">
                    {progress.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 capitalize mb-1">
                    {progress.category}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Level {progress.level}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {Math.round((progress.completed / progress.total) * 100)}% Complete
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}