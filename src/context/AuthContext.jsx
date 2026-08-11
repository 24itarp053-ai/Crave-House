import React, { createContext, useContext, useState } from 'react';
import { authenticateUser } from '../utils/demoAuth';

const AuthContext = createContext();

// Helper to validate and clean user object retrieved from localStorage
const validateUser = (userObj) => {
  if (!userObj || typeof userObj !== 'object') return null;
  if (
    typeof userObj.name === 'string' &&
    typeof userObj.email === 'string' &&
    (userObj.role === 'customer' || userObj.role === 'admin' || userObj.role === 'owner')
  ) {
    return {
      name: userObj.name,
      email: userObj.email,
      role: userObj.role
    };
  }
  return null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('craveHouseUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        return validateUser(parsed);
      }
    } catch (error) {
      console.error('Error loading craveHouseUser from localStorage:', error);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  /**
   * Logs in a user by matching credentials.
   * @param {string} email 
   * @param {string} password 
   * @param {string} [expectedRole] Optional role filter for Staff Login page.
   * @returns {object} Auth response from utility.
   */
  const login = (email, password, expectedRole) => {
    setLoading(true);
    const result = authenticateUser(email, password, expectedRole);

    if (result.success) {
      setUser(result.user);
      try {
        localStorage.setItem('craveHouseUser', JSON.stringify(result.user));
      } catch (error) {
        console.error('Error setting craveHouseUser in localStorage:', error);
      }
    }
    setLoading(false);
    return result;
  };

  /**
   * Logs out the current user session and cleans localStorage.
   */
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('craveHouseUser');
    } catch (error) {
      console.error('Error clearing craveHouseUser from localStorage:', error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
