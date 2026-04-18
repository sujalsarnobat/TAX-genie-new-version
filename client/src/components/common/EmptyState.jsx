import React from 'react';
import './EmptyState.css';

/**
 * Empty State Component - Shows when no data is available
 * 
 * Usage:
 * <EmptyState
 *   icon="📊"
 *   title="No Tax Records Found"
 *   message="Start by calculating your taxes"
 *   actionText="Calculate Now"
 *   onAction={() => navigate('/calculate')}
 * />
 */
export const EmptyState = ({ icon = '📭', title, message, actionText, onAction }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-message">{message}</p>
      {actionText && onAction && (
        <button className="empty-state-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

/**
 * No Data Found - Shows when search/filter returns no results
 */
export const NoDataFound = ({ message = 'No data found', actionText, onAction }) => (
  <EmptyState icon="🔍" title="No Results" message={message} actionText={actionText} onAction={onAction} />
);

/**
 * Error State - Shows when data loading fails
 */
export const ErrorState = ({ message = 'Failed to load data', actionText = 'Try Again', onAction }) => (
  <EmptyState
    icon="⚠️"
    title="Something Went Wrong"
    message={message}
    actionText={actionText}
    onAction={onAction}
  />
);

/**
 * No Tax History - Specific empty state for tax history
 */
export const NoTaxHistory = ({ onAction }) => (
  <EmptyState
    icon="📊"
    title="No Tax Records Yet"
    message="You haven't calculated or filed any taxes yet. Start your first tax calculation."
    actionText="Calculate Your Tax"
    onAction={onAction}
  />
);

/**
 * No Chat History - Specific empty state for chatbot
 */
export const NoChatHistory = () => (
  <EmptyState
    icon="💬"
    title="Start a Conversation"
    message="Ask me anything about Indian taxes, deductions, or filing. I'm here to help!"
  />
);

/**
 * Network Error - Shows when network connection is lost
 */
export const NetworkError = ({ onRetry }) => (
  <EmptyState
    icon="🌐"
    title="Network Error"
    message="Please check your internet connection and try again."
    actionText="Retry"
    onAction={onRetry}
  />
);

export default EmptyState;
