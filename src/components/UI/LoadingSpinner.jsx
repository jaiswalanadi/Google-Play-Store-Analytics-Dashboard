import React from 'react';
import { Loader2, BarChart3 } from 'lucide-react';

/**
 * Loading spinner component with optional message
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {boolean} props.fullScreen - Whether to show as full screen overlay
 * @param {string} props.type - Spinner type ('default', 'pulse', 'chart')
 */
const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'md', 
  fullScreen = false,
  type = 'default' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  const SpinnerIcon = () => {
    switch (type) {
      case 'pulse':
        return (
          <div className="flex space-x-1">
            <div className={`${sizeClasses[size]} bg-primary-500 rounded-full animate-pulse`}></div>
            <div className={`${sizeClasses[size]} bg-primary-400 rounded-full animate-pulse`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`${sizeClasses[size]} bg-primary-300 rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      case 'chart':
        return <BarChart3 className={`${sizeClasses[size]} text-primary-500 animate-pulse`} />;
      default:
        return <Loader2 className={`${sizeClasses[size]} text-primary-500 animate-spin`} />;
    }
  };

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <SpinnerIcon />
        </div>
        {message && (
          <p className="text-gray-600 text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Inline loading spinner for small spaces
 */
export const InlineSpinner = ({ size = 'sm', className = '' }) => (
  <Loader2 className={`${sizeClasses[size]} text-gray-400 animate-spin ${className}`} />
);

/**
 * Loading state for cards
 */
export const CardSkeleton = ({ rows = 3 }) => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="h-3 bg-gray-200 rounded mb-2"></div>
    ))}
  </div>
);

/**
 * Loading state for charts
 */
export const ChartSkeleton = ({ height = 'h-64' }) => (
  <div className={`${height} bg-gray-100 rounded-lg animate-pulse flex items-center justify-center`}>
    <div className="text-center">
      <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
      <p className="text-gray-400 text-sm">Loading chart...</p>
    </div>
  </div>
);

/**
 * Loading overlay for existing content
 */
export const LoadingOverlay = ({ isVisible, message = 'Processing...' }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-2" />
        <p className="text-gray-600 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
