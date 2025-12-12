// auth.js – SAFE BYPASS MODE (for development only)

import dotenv from 'dotenv';
dotenv.config();

/**
 * TEMPORARY AUTH BYPASS
 * This will allow every request to pass as an authenticated user.
 * Useful for testing when cookies or login are not working.
 */

export const isAuthenticated = (req, res, next) => {
  // Fake logged-in user
  req.user = {
    _id: "dummyUser123",
    role: "Auctioner",  // change to "Super Admin" for admin access
  };

  next();
};

/**
 * TEMPORARY AUTHORIZATION BYPASS
 * This allows all roles to access all routes.
 */

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    // No role check – skip authorization
    next();
  };
};
