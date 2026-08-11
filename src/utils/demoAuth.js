// CENTRALIZED DEVELOPMENT/DEMO AUTHENTICATION UTILITY
// This file simulates user credentials and validation rules for the frontend.

export const DEMO_CREDENTIALS = {
  customer: {
    email: 'customer@cravehouse.demo',
    password: 'password123',
    name: 'Jane Customer',
    role: 'customer'
  },
  admin: {
    email: 'admin@cravehouse.demo',
    password: 'password123',
    name: 'Alex Admin',
    role: 'admin'
  },
  owner: {
    email: 'owner@cravehouse.demo',
    password: 'password123',
    name: 'Robert Owner',
    role: 'owner'
  }
};

/**
 * Simulates user login verification.
 * @param {string} email 
 * @param {string} password 
 * @param {string} [expectedRole] Optional role filter for Staff Login
 * @returns {object} { success: boolean, user?: object, error?: string }
 */
export const authenticateUser = (email, password, expectedRole) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = password || '';

  // Find demo account
  const matchingUser = Object.values(DEMO_CREDENTIALS).find(
    user => user.email.toLowerCase() === cleanEmail && user.password === cleanPassword
  );

  if (!matchingUser) {
    return { success: false, error: 'Invalid email or password.' };
  }

  // Verify role matches if expectedRole is passed
  if (expectedRole && matchingUser.role !== expectedRole) {
    return { 
      success: false, 
      error: `Access denied. This account does not have access as ${expectedRole === 'owner' ? 'Restaurant Owner' : 'Admin'}.` 
    };
  }

  return {
    success: true,
    user: {
      name: matchingUser.name,
      email: matchingUser.email,
      role: matchingUser.role
    }
  };
};
