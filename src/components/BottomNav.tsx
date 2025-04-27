import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Building2, Map, User, Car, Users, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/workers';
      case 'manager':
        return '/manager/dashboard';
      case 'guide':
        return '/guide/dashboard';
      case 'member':
        return '/member/dashboard';
      default:
        return '/login';
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/stay', label: 'Stay', icon: Building2 },
    { path: '/transport', label: 'Transport', icon: Car },
    { path: '/food', label: 'Food', icon: UtensilsCrossed },
    { path: '/map', label: 'Map', icon: Map },
    { 
      path: getDashboardPath(), 
      label: user ? (user.role === 'admin' ? 'Workers' : 'Dashboard') : 'Login', 
      icon: user?.role === 'admin' ? Users : User 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center p-2 ${
                  isActive ? 'text-nuanu' : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}