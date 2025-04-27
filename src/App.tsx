import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ExperienceList } from './components/ExperienceList';
import { ExperienceDetails } from './components/ExperienceDetails';
import { CartPage } from './components/CartPage';
import { CartButton } from './components/CartButton';
import { CartProvider } from './components/CartContext';
import { BottomNav } from './components/BottomNav';
import { LoginPage } from './components/LoginPage';
import { ManagerDashboard } from './components/ManagerDashboard';
import { GuideDashboard } from './components/GuideDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import { StayPage } from './components/StayPage';
import { EventsPage } from './components/EventsPage';
import { TransportPage } from './components/TransportPage';
import { MapDashboard } from './components/MapDashboard';
import { WorkerCredentials } from './components/WorkerCredentials';
import { FoodPage } from './components/FoodPage';
import { AuthProvider, useAuth } from './auth/AuthContext';

// Protected Route component
function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();
  const isLoginPage = window.location.pathname === '/login';

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 pb-20">
        {!isLoginPage && (
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center">
                <h1 className="text-3xl font-bold text-nuanu">
                  Nuanu Experience
                </h1>
              </div>
            </div>
          </header>
        )}

        <main className={`max-w-7xl mx-auto px-4 ${!isLoginPage ? 'py-8' : ''} sm:px-6 lg:px-8`}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ExperienceList />} />
            <Route path="/experience/:id" element={<ExperienceDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/stay" element={<StayPage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/map" element={<MapDashboard />} />
            <Route path="/food" element={<FoodPage />} />
            <Route 
              path="/manager/dashboard" 
              element={
                <ProtectedRoute roles={['manager', 'admin']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/guide/dashboard" 
              element={
                <ProtectedRoute roles={['guide']}>
                  <GuideDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/member/dashboard" 
              element={
                <ProtectedRoute roles={['member']}>
                  <MemberDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/workers" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <WorkerCredentials />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        {!isLoginPage && (
          <>
            <CartButton />
            <BottomNav />
          </>
        )}
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;