import React, { useState, useCallback, useMemo } from 'react';
import { Menu, X } from 'lucide-react';
import Header from './components/UI/Header';
import Sidebar from './components/UI/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import { useDataLoader } from './hooks/useDataLoader';
import { useAnalytics } from './hooks/useAnalytics';
import { DASHBOARD_SECTIONS } from './utils/constants';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { ErrorDisplay } from './components/UI/ErrorBoundary';
import './App.css';

/**
 * Main Application Component
 * Orchestrates the entire Google Play Store Analytics dashboard
 */
function App() {
  // State management
  const [activeSection, setActiveSection] = useState(DASHBOARD_SECTIONS.OVERVIEW);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({});

  // Data loading hook
  const {
    apps,
    reviews,
    isLoading: dataLoading,
    error: dataError,
    loadingMessage,
    dataQuality,
    isReady: dataReady,
    reloadData
  } = useDataLoader();

  // Analytics hook
  const {
    analytics,
    chartData,
    isGenerating: analyticsGenerating,
    error: analyticsError,
    isReady: analyticsReady,
    updateFilters,
    resetFilters,
    filteredApps
  } = useAnalytics(apps, reviews);

  // Computed state
  const isLoading = dataLoading || analyticsGenerating;
  const hasError = dataError || analyticsError;
  const isAppReady = dataReady && analyticsReady && !isLoading;

  // Get unique categories for filters
  const categories = useMemo(() => {
    return [...new Set(apps.map(app => app.category))].sort();
  }, [apps]);

  // Statistics for header
  const headerStats = useMemo(() => {
    if (!analytics?.overview) return {};
    
    return {
      totalApps: analytics.overview.totalApps,
      totalCategories: analytics.categories?.totalCategories || 0,
      avgRating: analytics.overview.avgRating,
      totalInstalls: analytics.overview.totalInstalls
    };
  }, [analytics]);

  // Event handlers
  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    setIsMobileSidebarOpen(false);
  }, []);

  const handleMobileSidebarToggle = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  const handleMobileSidebarClose = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    updateFilters(newFilters);
  }, [updateFilters]);

  const handleRefresh = useCallback(async () => {
    try {
      await reloadData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }, [reloadData]);

  const handleExport = useCallback(() => {
    // Generate and download report
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: analytics?.insights || {},
      stats: headerStats,
      filteredAppsCount: filteredApps.length
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `google-play-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [analytics, headerStats, filteredApps]);

  // Early error state
  if (hasError && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorDisplay 
            error={dataError || analyticsError} 
            title="Application Error"
            onRetry={handleRefresh}
          />
        </div>
      </div>
    );
  }

  // Initial loading state
  if (!dataReady && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner 
          message={loadingMessage || "Loading Google Play Store data..."}
          fullScreen={true}
          type="chart"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          onRefresh={handleRefresh}
          onExport={handleExport}
          isLoading={isLoading}
          stats={headerStats}
        />

        {/* Mobile Menu Button */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <button
            onClick={handleMobileSidebarToggle}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            {isMobileSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {isMobileSidebarOpen ? 'Close' : 'Menu'}
            </span>
          </button>
        </div>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto">
          {isAppReady ? (
            <Dashboard
              activeSection={activeSection}
              analytics={analytics}
              chartData={chartData}
              apps={filteredApps}
              reviews={reviews}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSectionChange={handleSectionChange}
            />
          ) : (
            <div className="p-6">
              <LoadingSpinner 
                message="Preparing analytics dashboard..."
                type="pulse"
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Google Play Store Analytics v1.0.0</span>
              {dataQuality && (
                <span>
                  {dataQuality.apps?.totalRows?.toLocaleString()} apps • {dataQuality.reviews?.totalRows?.toLocaleString()} reviews
                </span>
              )}
            </div>
            <div className="mt-2 sm:mt-0 flex items-center space-x-4">
              {analytics?.generatedAt && (
                <span>
                  Last updated: {new Date(analytics.generatedAt).toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={() => window.open('https://github.com', '_blank')}
                className="text-primary-600 hover:text-primary-800"
              >
                View Source
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Loading Overlay */}
      {isLoading && isAppReady && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <LoadingSpinner 
              message={loadingMessage || "Processing..."}
              size="md"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
