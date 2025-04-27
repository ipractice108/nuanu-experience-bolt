import React, { createContext, useContext, useState } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user data exists in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Ensure user has a valid UUID
      if (!parsedUser.id || parsedUser.id === '123') {
        parsedUser.id = generateUUID();
      }
      return parsedUser;
    }
    return null;
  });

  const login = (userData: User) => {
    // Ensure user has a valid UUID
    const userWithUUID = {
      ...userData,
      id: userData.id === '123' ? generateUUID() : userData.id
    };
    setUser(userWithUUID);
    localStorage.setItem('user', JSON.stringify(userWithUUID));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);