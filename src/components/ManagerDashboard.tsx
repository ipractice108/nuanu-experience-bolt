import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { StayManager } from './StayManager';
import { ExperienceManager } from './ExperienceManager';
import { DeliciousManager } from './DeliciousManager';
import { WorkerCredentials } from './WorkerCredentials';

export function ManagerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role === 'admin') {
    return (
      <div className="space-y-8">
        <WorkerCredentials />
        <ExperienceManager />
      </div>
    );
  }

  if (user.role !== 'manager') {
    navigate('/');
    return null;
  }

  switch (user.managerType) {
    case 'stay':
      return <StayManager />;
    case 'delicious':
      return <DeliciousManager />;
    case 'experience':
    default:
      return <ExperienceManager />;
  }
}