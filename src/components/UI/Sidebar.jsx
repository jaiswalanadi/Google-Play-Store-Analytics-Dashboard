import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Star, 
  MessageSquare, 
  FileText,
  Filter,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { DASHBOARD_SECTIONS } from '../../utils/constants';

/**
 * Sidebar navigation component
 * @param {Object} props - Component props
 * @param {string} props.activeSection - Currently active section
 * @param {Function} props.onSectionChange - Section change callback
 * @param {Object} props.filters - Current filters
 * @param {Function} props.onFiltersChange - Filters change callback
 * @param {Array} props.categories - Available categories
 * @param {boolean} props.isMobileOpen - Mobile sidebar open state
 * @param {Function} props.onMobileClose - Mobile close callback
 */
const Sidebar = ({ 
  activeSection = DASHBOARD_SECTIONS.OVERVIEW,
  onSectionChange,
  filters = {},
  onFiltersChange,
  categories = [],
  isMobileOpen = false,
  onMobileClose
}) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

  const navigationItems = [
    { 
      id: DASHBOARD_SECTIONS.OVERVIEW, 
      label: 'Overview', 
      icon: BarChart3,
      description: 'General statistics and insights'
    },
    { 
      id: DASHBOARD_SECTIONS.CATEGORIES, 
      label: 'Categories', 
      icon: PieChart,
      description: 'Category performance analysis'
    },
    { 
      id: DASHBOARD_SECTIONS.RATINGS, 
      label: 'Ratings', 
      icon: Star,
      description: 'Rating distribution and trends'
    },
    { 
      id: DASHBOARD_SECTIONS.SENTIMENT, 
      label: 'Sentiment', 
      icon: MessageSquare,
      description: 'User review sentiment analysis'
    },
    { 
      id: DASHBOARD_SECTIONS.TRENDS, 
      label: 'Trends', 
      icon: TrendingUp,
      description: 'Market trends and patterns'
    },
    { 
      id: DASHBOARD_SECTIONS.REPORTS, 
      label: 'Reports', 
      icon: FileText,
      description: 'Detailed analysis reports'
    }
  ];

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === null) {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }
    
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const sidebarClasses = `
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200
    transition-transform duration-300 ease-in-out flex flex-col
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Dashboard
            </h3>
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    onMobileClose?.();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  title={item.description}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Filters Section */}
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="w-full flex items-center justify-between text-xs font-semibold 
                       text-gray-500 uppercase tracking-wider mb-3 hover:text-gray-700"
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full text-xs">
                    {Object.keys(filters).length}
                  </span>
                )}
              </div>
              {isFiltersExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {isFiltersExpanded && (
              <div className="space-y-3">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating || ''}
                    onChange={(e) => handleFilterChange('minRating', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App Type
                  </label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                {/* Content Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Rating
                  </label>
                  <select
                    value={filters.contentRating || ''}
                    onChange={(e) => handleFilterChange('contentRating', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Ratings</option>
                    <option value="Everyone">Everyone</option>
                    <option value="Teen">Teen</option>
                    <option value="Mature 17+">Mature 17+</option>
                    <option value="Adults only 18+">Adults only 18+</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 
                             border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Google Play Store Analytics v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
