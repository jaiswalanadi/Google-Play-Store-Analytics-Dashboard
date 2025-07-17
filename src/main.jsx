import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/UI/ErrorBoundary.jsx'
import './styles/globals.css'

// Remove initial loader when React app is ready
const removeInitialLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    document.body.classList.add('app-loaded');
    setTimeout(() => loader.remove(), 500);
  }
};

// Performance monitoring
const measurePerformance = () => {
  if (typeof window !== 'undefined' && window.performance) {
    window.addEventListener('load', () => {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
    });
  }
};

// Initialize performance monitoring
measurePerformance();

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Create root and render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary fallbackMessage="The application encountered an unexpected error. Please refresh the page to try again.">
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

// Remove loader after React renders
setTimeout(removeInitialLoader, 100);
