import React, { Suspense, lazy } from 'react';
import { DASHBOARD_SECTIONS } from '../../utils/constants';
import LoadingSpinner from '../UI/LoadingSpinner';
import { ErrorDisplay } from '../UI/ErrorBoundary';

// Lazy load dashboard sections for better performance
const OverviewSection = lazy(() => import('./OverviewSection'));
const CategoryAnalysis = lazy(() => import('../Analytics/CategoryAnalysis'));
const RatingAnalysis = lazy(() => import('../Analytics/RatingAnalysis'));
const SentimentAnalysis = lazy(() => import('../Analytics/SentimentAnalysis'));
const TrendAnalysis = lazy(() => import('../Analytics/TrendAnalysis'));
const ReportsSection = lazy(() => import('./ReportsSection'));

/**
 * Main Dashboard Component
 * Routes between different analytics sections
 * @param {Object} props - Component props
 * @param {string} props.activeSection - Currently active section
 * @param {Object} props.analytics - Analytics data
 * @param {Object} props.chartData - Chart data
 * @param {Array} props.apps - Apps data
 * @param {Array} props.reviews - Reviews data
 * @param {Object} props.filters - Current filters
 * @param {Function} props.onFiltersChange - Filters change callback
 * @param {Function} props.onSectionChange - Section change callback
 */
const Dashboard = ({
  activeSection,
  analytics,
  chartData,
  apps,
  reviews,
  filters,
  onFiltersChange,
  onSectionChange
}) => {
  // Error boundary for dashboard sections
  const SectionErrorBoundary = ({ children, sectionName }) => {
    try {
      return children;
    } catch (error) {
      return (
        <ErrorDisplay 
          error={`Failed to load ${sectionName} section`}
          title="Section Error"
        />
      );
    }
  };

  // Loading fallback component
  const SectionLoader = ({ message }) => (
    <div className="flex items-center justify-center p-12">
      <LoadingSpinner message={message} type="chart" />
    </div>
  );

  // Render active section
  const renderActiveSection = () => {
    const commonProps = {
      analytics,
      chartData,
      apps,
      reviews,
      filters,
      onFiltersChange
    };

    switch (activeSection) {
      case DASHBOARD_SECTIONS.OVERVIEW:
        return (
          <SectionErrorBoundary sectionName="Overview">
            <Suspense fallback={<SectionLoader message="Loading overview..." />}>
              <OverviewSection {...commonProps} onSectionChange={onSectionChange} />
            </Suspense>
          </SectionErrorBoundary>
        );

      case DASHBOARD_SECTIONS.CATEGORIES:
        return (
          <SectionErrorBoundary sectionName="Categories">
            <Suspense fallback={<SectionLoader message="Loading category analysis..." />}>
              <CategoryAnalysis {...commonProps} />
            </Suspense>
          </SectionErrorBoundary>
        );

      case DASHBOARD_SECTIONS.RATINGS:
        return (
          <SectionErrorBoundary sectionName="Ratings">
            <Suspense fallback={<SectionLoader message="Loading rating analysis..." />}>
              <RatingAnalysis {...commonProps} />
            </Suspense>
          </SectionErrorBoundary>
        );

      case DASHBOARD_SECTIONS.SENTIMENT:
        return (
          <SectionErrorBoundary sectionName="Sentiment">
            <Suspense fallback={<SectionLoader message="Loading sentiment analysis..." />}>
              <SentimentAnalysis {...commonProps} />
            </Suspense>
          </SectionErrorBoundary>
        );

      case DASHBOARD_SECTIONS.TRENDS:
        return (
          <SectionErrorBoundary sectionName="Trends">
            <Suspense fallback={<SectionLoader message="Loading trend analysis..." />}>
              <TrendAnalysis {...commonProps} />
            </Suspense>
          </SectionErrorBoundary>
        );

      case DASHBOARD_SECTIONS.REPORTS:
        return (
          <SectionErrorBoundary sectionName="Reports">
            <Suspense fallback={<SectionLoader message="Loading reports..." />}>
              <ReportsSection {...commonProps} />
            </Suspense>
          </SectionErrorBoundary>
        );

      default:
        return (
          <div className="p-6">
            <ErrorDisplay 
              error={`Unknown section: ${activeSection}`}
              title="Navigation Error"
            />
          </div>
        );
    }
  };

  return (
    <div className="dashboard-section">
      {renderActiveSection()}
    </div>
  );
};

export default Dashboard;
