/**
 * Tax Calculation and Filing API endpoints
 * Handles: Tax calculations, ITR downloads, tax history
 */

import apiClient from './client';

/**
 * Calculate tax for user
 */
export const calculateTax = (taxData) => {
  return apiClient.post('/tax/calculate', taxData);
};

/**
 * Get user's tax calculation history
 */
export const getTaxHistory = (userId) => {
  return apiClient.get(`/tax/history?userId=${userId}`);
};

/**
 * Get specific tax calculation by ID
 */
export const getTaxCalculation = (taxId) => {
  return apiClient.get(`/tax/${taxId}`);
};

/**
 * Generate ITR-1 JSON form
 * @param {string} Token - Tax calculation token/ID
 */
export const generateITR1JSON = (Token) => {
  return apiClient.post('/tax/generate-itr1', { Token });
};

/**
 * Parse Form 16 document
 */
export const parseForm16 = (formData) => {
  return apiClient.post('/tax/parse-form16', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Save tax calculation draft
 */
export const saveTaxDraft = (taxData) => {
  return apiClient.post('/tax/save-draft', taxData);
};

/**
 * Get saved tax draft
 */
export const getTaxDraft = () => {
  return apiClient.get('/tax/draft');
};
