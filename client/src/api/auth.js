/**
 * Authentication API endpoints
 * Handles: Login, Signup, OTP verification, Password reset
 */

import apiClient from './client';

/**
 * Send OTP for authentication (signup or password reset)
 */
export const sendOTP = (email, purpose = 'signup') => {
  return apiClient.post('/auth/send-otp', { email, purpose });
};

/**
 * Verify OTP and complete signup
 */
export const verifyOTPSignup = (email, otp, userData) => {
  return apiClient.post('/auth/verify-otp-signup', {
    email,
    otp,
    ...userData,
  });
};

/**
 * User login
 */
export const loginUser = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

/**
 * Verify OTP for password reset
 */
export const verifyOTPReset = (email, otp) => {
  return apiClient.post('/auth/verify-otp-reset', { email, otp });
};

/**
 * Reset password (after OTP verification)
 */
export const resetPassword = (email, newPassword) => {
  return apiClient.post('/auth/reset-password', { email, newPassword });
};

/**
 * Get current user profile
 */
export const getUserProfile = () => {
  return apiClient.get('/user/profile');
};

/**
 * Update user profile
 */
export const updateUserProfile = (userData) => {
  return apiClient.put('/user/profile', userData);
};

/**
 * Logout (client-side only - clear localStorage)
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};
