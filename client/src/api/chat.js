/**
 * Chatbot API endpoints
 * Handles: AI chat messages
 */

import apiClient from './client';

/**
 * Send chat message to AI chatbot
 * @param {string} message - User's message
 * @param {array} history - Previous chat history
 */
export const sendChatMessage = (message, history = []) => {
  return apiClient.post('/chat', {
    message,
    history,
  });
};

/**
 * Check if chatbot API is available
 */
export const checkChatbotHealth = () => {
  return apiClient.get('/chat/health');
};
