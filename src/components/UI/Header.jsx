import React from 'react';
import { BarChart3, RefreshCw, Download, Settings } from 'lucide-react';
import { APP_CONFIG } from '../../utils/constants';

/**
 * Header component with navigation and actions
 * @param {Object} props - Component props
 * @param {Function} props.onRefresh - Refresh data callback
 * @param {Function} props.onExport - Export data callback
 * @param {boolean} props.isLoading - Loading state
 * @param {Object} props.stats - Basic statistics
 */
const Header = ({ onRefresh, onExport, isLoading = false, stats = {} }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {APP_CONFIG.name}
            </h1>
            <p className="text-sm text-gray-500">
              {APP_CONFIG.description}
            </p>
          </div>
        </div>

        {/* Statistics */}
        {stats.totalApps && (
          <div className="hidden md:flex items-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {stats.totalApps?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-gray-500">Total Apps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">
                {stats.totalCategories || 0}
              </div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                {stats.avgRating?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-500">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {((stats.totalInstalls || 0) / 1000000000).toFixed(1)}B
              </div>
              <div className="text-sm text-gray-500">Total Installs</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 
              text-sm font-medium transition-colors
              ${isLoading 
                ? '
