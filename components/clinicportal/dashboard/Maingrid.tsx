import React, { useEffect, useState } from 'react';
import { Calendar, Search, Users, DollarSign, Star, Activity, ArrowUpRight, ArrowDownRight, Eye, Edit, Trash2, IndianRupee } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { getDashboardBookingTrendService, getDashboardDataService, getDashboardRevenueTrendService, getDashboardServiceTrendService } from '@/components/service/clinic/AdminDashh';
import useClinicByUser from '@/hooks/cilincHook/useClinicByUser';

type EnhancedMetricCardProps = {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down';
  subtitle?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple';
};

type FilterButtonProps = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  count?: number;
};

type TabButtonProps = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ElementType;
};

type StatusBadgeProps = {
  status: string;
  priority?: string;
};

type AvatarProps = {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

// Type for API response
type DashboardData = {
  bookings: {
    today: number | null;
    week: number | null;
    month: number | null;
    quarter: number | null;
  };
  revenue: {
    today: number | null;
    week: number | null;
    month: number | null;
    quarter: number | null;
  };
  doctors: {
    count: number | null;
  };
  reviews: {
    avg_today: number | null;
    avg_week: number | null;
    avg_month: number | null;
    avg_quarter: number | null;
  };
};

// Types for chart data
type BookingTrendData = {
  week: string;
  total: number;
};

type RevenueTrendData = {
  week: string;
  total_revenue: number;
};

type ServiceUsageData = {
  service_name: string;
  count: number;
};

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [selectedService, setSelectedService] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [bookingTrendData, setBookingTrendData] = useState<BookingTrendData[]>([]);
  const [revenueTrendData, setRevenueTrendData] = useState<RevenueTrendData[]>([]);
  const [serviceUsageData, setServiceUsageData] = useState<ServiceUsageData[]>([]);

  const { clinic } = useClinicByUser() as { clinic: any };

  console.log(clinic, 'clinic data')

  const getInitialData = async () => {
    setIsLoading(true);
    try {
      const [getDashboardData, getBookingTrend, getRevenueTrend, getServiceUsage] = await Promise.allSettled([
        getDashboardDataService(), 
        getDashboardBookingTrendService(), 
        getDashboardRevenueTrendService(), 
        getDashboardServiceTrendService()
      ]);

      console.log("✅ Dashboard:", getDashboardData);
      console.log("✅ Booking Trend:", getBookingTrend);
      console.log("✅ Revenue Trend:", getRevenueTrend);
      console.log("✅ Service Usage:", getServiceUsage);

      if (getDashboardData?.status === "fulfilled") {
        setDashboardData(getDashboardData?.value?.data);
      }

      if (getBookingTrend?.status === "fulfilled") {
        setBookingTrendData(getBookingTrend?.value?.data || []);
      }

      if (getRevenueTrend?.status === "fulfilled") {
        setRevenueTrendData(getRevenueTrend?.value?.data || []);
      }

      if (getServiceUsage?.status === "fulfilled") {
        setServiceUsageData(getServiceUsage?.value?.data || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch initial data:", error?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  // Helper function to handle null values
  const safeNumber = (value: number | null): number => {
    return value === null ? 0 : value;
  };

  // Helper function to format currency
  const formatCurrency = (value: number | null): string => {
    const numValue = safeNumber(value);
    return `₹${numValue.toLocaleString()}`;
  };

  // Helper function to format rating
  const formatRating = (value: number | null): string => {
    const numValue = safeNumber(value);
    return numValue.toFixed(1);
  };

  // Get metrics based on selected date range
  const getMetrics = () => {
    if (!dashboardData) return null;

    const rangeMap = {
      '24h': 'today',
      '7d': 'week',
      '30d': 'month',
      '90d': 'quarter'
    } as const;

    const currentRange = rangeMap[dateRange];

    return {
      bookings: safeNumber(dashboardData.bookings[currentRange]),
      revenue: safeNumber(dashboardData.revenue[currentRange]),
      doctors: safeNumber(dashboardData.doctors.count),
      rating: safeNumber(dashboardData.reviews[`avg_${currentRange}` as keyof typeof dashboardData.reviews])
    };
  };

  const metrics = getMetrics();

  // Get filter counts for buttons
  const getFilterCounts = () => {
    if (!dashboardData) return { '24h': 0, '7d': 0, '30d': 0, '90d': 0 };

    return {
      '24h': safeNumber(dashboardData.bookings.today),
      '7d': safeNumber(dashboardData.bookings.week),
      '30d': safeNumber(dashboardData.bookings.month),
      '90d': safeNumber(dashboardData.bookings.quarter)
    };
  };

  const filterCounts = getFilterCounts()

  // For demo purposes - you might want to get actual trend data from API
  const getTrendData = () => {
    // This is mock data - replace with actual trend calculation from your API
    // For now, we'll show positive trends for non-zero values, zero otherwise
    if (!metrics) return { bookings: 0, revenue: 0, doctors: 0, rating: 0 };

    return {
      bookings: metrics.bookings > 0 ? 12.5 : 0,
      revenue: metrics.revenue > 0 ? 8.2 : 0,
      doctors: metrics.doctors > 0 ? 4.1 : 0,
      rating: metrics.rating > 0 ? 2.3 : 0
    };
  };

  const trends = getTrendData();

  // Determine trend direction based on value
  const getTrendDirection = (value: number): 'up' | 'down' => {
    return value > 0 ? 'up' : 'down';
  };

  // Format booking trend data for chart
  const getFormattedBookingTrendData = () => {
    return bookingTrendData.map(item => ({
      date: item.week,
      bookings: item.total,
      // For demo purposes, adding mock data for other fields
      revenue: item.total * 100, // Mock revenue calculation
      patients: item.total // Mock patients count
    }));
  };

  // Format revenue trend data for chart
  const getFormattedRevenueTrendData = () => {
    return revenueTrendData.map(item => ({
      date: item.week,
      revenue: item.total_revenue,
      // For demo purposes, adding mock data for other fields
      bookings: Math.floor(item.total_revenue / 100), // Mock bookings calculation
      patients: Math.floor(item.total_revenue / 100) // Mock patients count
    }));
  };

  // Format service usage data for pie chart
  const getFormattedServiceData = () => {
    const colors = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF3B30', '#5856D6', '#FF2D55'];
    
    return serviceUsageData.map((service, index) => ({
      name: service.service_name,
      value: service.count,
      color: colors[index % colors.length],
      count: service.count
    }));
  };

  const EnhancedMetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend,
    subtitle,
    color = 'blue',
  }: EnhancedMetricCardProps) => {
    const colorClasses: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      green: 'bg-green-50 text-green-600 border-green-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
    };

    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-2xl border ${colorClasses[color]} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${trend === 'up'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : change === '0.0'
              ? 'bg-gray-50 text-gray-700 border border-gray-200'
              : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : trend === 'down' ? (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            ) : (
              <span className="w-4 h-4 mr-1">-</span>
            )}
            {change}%
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    );
  };

  const FilterButton = ({
    active,
    children,
    onClick,
    count,
  }: FilterButtonProps) => (
    <button
      onClick={onClick}
      className={`relative px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${active
        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105'
        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
        }`}
    >
      {children}
      {count !== undefined && (
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
          }`}>
          {count}
        </span>
      )}
    </button>
  );

  // Handle date range change
  const handleDateRangeChange = (range: '24h' | '7d' | '30d' | '90d') => {
    setDateRange(range);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
          <button
            onClick={getInitialData}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-2  py-3 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-2xl font-bold text-gray-900 tracking-tight">{clinic?.name} Dashboard</h1>
                <p className="text-gray-500 mt-1 text-xs sm:text-base">Streamline your healthcare operations</p>
              </div>
            </div>
            {/* <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients, doctors, appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-2 sm:py-3 bg-gray-50 border-0 rounded-lg transition-all  duration-200 w-full text-xs sm:text-sm"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 py-4">
        {/* Enhanced Date Range Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
            <div className="flex flex-wrap gap-1 sm:space-x-3">
              {[
                { key: '24h' as const, label: 'Today' },
                { key: '7d' as const, label: 'Week' },
                { key: '30d' as const, label: 'Month' },
                { key: '90d' as const, label: 'Quarter' }
              ].map(range => (
                <FilterButton
                  key={range.key}
                  active={dateRange === range.key}
                  onClick={() => handleDateRangeChange(range.key)}
                  count={filterCounts[range.key]}
                >
                  {range.label}
                </FilterButton>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Metrics Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <EnhancedMetricCard
            title="Total Bookings"
            value={metrics.bookings.toString()}
            subtitle={`vs previous period`}
            change={trends.bookings.toFixed(1)}
            trend={getTrendDirection(trends.bookings)}
            icon={Calendar}
            color="blue"
          />
          <EnhancedMetricCard
            title="Revenue"
            value={formatCurrency(metrics.revenue)}
            subtitle={`vs previous period`}
            change={trends.revenue.toFixed(1)}
            trend={getTrendDirection(trends.revenue)}
            icon={IndianRupee}
            color="green"
          />
          <EnhancedMetricCard
            title="Active Doctors"
            value={metrics.doctors.toString()}
            subtitle={`vs previous period`}
            change={trends.doctors.toFixed(1)}
            trend={getTrendDirection(trends.doctors)}
            icon={Users}
            color="orange"
          />
          <EnhancedMetricCard
            title="Avg Rating"
            value={formatRating(metrics.rating)}
            subtitle={`vs previous period`}
            change={trends.rating.toFixed(1)}
            trend={getTrendDirection(trends.rating)}
            icon={Star}
            color="purple"
          />
        </div>

        {/* Rest of your tab content remains exactly the same */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-8">
            {/* Enhanced Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              {/* Bookings Chart */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-3 sm:p-8 shadow-sm border border-gray-100 ">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 gap-2 sm:gap-0">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Bookings Analytics</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">Track your appointment trends</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={getFormattedBookingTrendData()}>
                    <defs>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca3af"
                      fontSize={10}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#9ca3af" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="bookings"
                      stroke="#007AFF"
                      strokeWidth={3}
                      fill="url(#colorBookings)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Service Distribution */}
              <div className="bg-white rounded-3xl p-3 sm:p-8 shadow-sm border border-gray-100">
                <div className="mb-3 sm:mb-6">
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Services</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">Distribution overview</p>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={getFormattedServiceData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {getFormattedServiceData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-6">
                  {getFormattedServiceData().map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }}></div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{service.count}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {serviceUsageData.length > 0 
                            ? `${Math.round((service.count / serviceUsageData.reduce((sum, item) => sum + item.count, 0)) * 100)}%`
                            : '0%'
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Revenue Chart */}
            <div className="bg-white rounded-3xl p-3 sm:p-8 shadow-sm border border-gray-100">
              <div className="mb-3 sm:mb-6">
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Revenue Trends</h3>
                <p className="text-gray-500 text-xs sm:text-sm">Weekly revenue performance</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getFormattedRevenueTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    fontSize={10}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#9ca3af" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#34C759" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;