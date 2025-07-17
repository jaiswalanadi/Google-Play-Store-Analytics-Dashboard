import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { ChartSkeleton } from '../UI/LoadingSpinner';
import { ErrorDisplay } from '../UI/ErrorBoundary';
import { CHART_COLORS } from '../../utils/constants';

/**
 * Reusable Line Chart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data
 * @param {Array} props.lines - Array of line configurations {dataKey, color, name}
 * @param {string} props.xAxisKey - Key for x-axis values
 * @param {string} props.title - Chart title
 * @param {number} props.height - Chart height
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {boolean} props.showGrid - Whether to show grid
 * @param {boolean} props.showLegend - Whether to show legend
 * @param {Function} props.formatTooltip - Custom tooltip formatter
 * @param {boolean} props.curved - Whether lines should be curved
 * @param {Object} props.margin - Chart margins
 */
const LineChart = ({
  data = [],
  lines = [{ dataKey: 'value', color: '#3b82f6', name: 'Value' }],
  xAxisKey = 'name',
  title,
  height = 300,
  isLoading = false,
  error = null,
  showGrid = true,
  showLegend = true,
  formatTooltip,
  curved = true,
  margin = { top: 20, right: 30, left: 20, bottom: 5 }
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <ChartSkeleton height={`h-[${height}px]`} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <ErrorDisplay error={error} title="Chart Error" />
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <div className={`h-[${height}px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300`}>
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Custom tooltip
  const customTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    if (formatTooltip) {
      return formatTooltip({ payload, label });
    }

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Format numbers for axis
  const formatNumber = (value) => {
    if (typeof value !== 'number') return value;
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data} margin={margin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />}
            
            <XAxis 
              dataKey={xAxisKey}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
              tickFormatter={formatNumber}
            />
            
            <Tooltip content={customTooltip} />
            
            {showLegend && <Legend />}
            
            {lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type={curved ? 'monotone' : 'linear'}
                dataKey={line.dataKey}
                stroke={line.color || CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ fill: line.color || CHART_COLORS[index % CHART_COLORS.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name={line.name || line.dataKey}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/**
 * Area Chart variant
 */
export const AreaChartComponent = ({
  data = [],
  areas = [{ dataKey: 'value', color: '#3b82f6', name: 'Value' }],
  xAxisKey = 'name',
  title,
  height = 300,
  isLoading = false,
  error = null,
  stacked = false
}) => {
  if (isLoading) {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <ChartSkeleton height={`h-[${height}px]`} />
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        {error ? (
          <ErrorDisplay error={error} title="Chart Error" />
        ) : (
          <div className={`h-[${height}px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300`}>
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            
            <XAxis 
              dataKey={xAxisKey}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            <Legend />
            
            {areas.map((area, index) => (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                stackId={stacked ? "stack" : undefined}
                stroke={area.color || CHART_COLORS[index % CHART_COLORS.length]}
                fill={area.color || CHART_COLORS[index % CHART_COLORS.length]}
                fillOpacity={0.3}
                name={area.name || area.dataKey}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/**
 * Multi-line chart for comparisons
 */
export const MultiLineChart = ({
  data = [],
  title,
  height = 300,
  isLoading = false,
  error = null
}) => {
  // Assume data format: [{ month: 1, category1: value, category2: value, ... }]
  if (isLoading || error || !data || data.length === 0) {
    return (
      <LineChart
        data={data}
        lines={[]}
        title={title}
        height={height}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  // Extract line configurations from data keys
  const sampleData = data[0] || {};
  const excludeKeys = ['month', 'date', 'time', 'name', 'period'];
  const lineKeys = Object.keys(sampleData).filter(key => !excludeKeys.includes(key));
  
  const lines = lineKeys.map((key, index) => ({
    dataKey: key,
    color: CHART_COLORS[index % CHART_COLORS.length],
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
  }));

  return (
    <LineChart
      data={data}
      lines={lines}
      xAxisKey="month"
      title={title}
      height={height}
      showLegend={true}
      curved={true}
    />
  );
};

/**
 * Simple trend line for small spaces
 */
export const TrendLine = ({
  data = [],
  dataKey = 'value',
  color = '#3b82f6',
  height = 60,
  showTooltip = false
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`h-[${height}px] flex items-center justify-center bg-gray-100 rounded`}>
        <span className="text-gray-500 text-xs">No trend data</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
        {showTooltip && (
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              fontSize: '12px',
              padding: '4px 8px'
            }}
          />
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
