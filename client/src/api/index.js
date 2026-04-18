/**
 * Centralized API exports
 * Provides clean imports: import { loginUser } from '@/api'
 */

// Auth APIs
export { sendOTP, verifyOTPSignup, loginUser, verifyOTPReset, resetPassword, getUserProfile, updateUserProfile, logoutUser } from './auth';

// Tax APIs
export { calculateTax, getTaxHistory, getTaxCalculation, generateITR1JSON, parseForm16, saveTaxDraft, getTaxDraft } from './tax';

// Chat APIs
export { sendChatMessage, checkChatbotHealth } from './chat';

// Axios instance
export { default as apiClient } from './client';
