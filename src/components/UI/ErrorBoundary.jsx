import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error Boundary component to catch JavaScript errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              {this.props.fallbackMessage || 
               'An unexpected error occurred while loading this component. Please try refreshing the page.'}
            </p>

            {/* Error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <p className="text-sm font-medium text-gray-900 mb-2">Error Details:</p>
                <pre className="text-xs text-red-600 whitespace-pre-wrap overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 
                         text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 
                         text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional error display component
 */
export const ErrorDisplay = ({ 
  error, 
  onRetry, 
  title = 'Error', 
  className = '' 
}) => (
  <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
    <div className="flex items-start space-x-3">
      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-red-800">{title}</h3>
        <p className="text-sm text-red-700 mt-1">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 text-sm text-red-600 hover:text-red-500 font-medium"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  </div>
);

/**
 * Simple error message component
 */
export const ErrorMessage = ({ message, className = '' }) => (
  <div className={`flex items-center space-x-2 text-red-600 ${className}`}>
    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
    <span className="text-sm">{message}</span>
  </div>
);

/**
 * Network error component
 */
export const NetworkError = ({ onRetry }) => (
  <div className="text-center p-8">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertTriangle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Error</h3>
    <p className="text-gray-600 mb-4">
      Unable to load data. Please check your internet connection and try again.
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 
                 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Retry</span>
      </button>
    )}
  </div>
);

export default ErrorBoundary;
