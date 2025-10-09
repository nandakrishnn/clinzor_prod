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

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [selectedService, setSelectedService] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const { clinic } = useClinicByUser() as { clinic: any };

  console.log(clinic, 'clinic data')

  const getInitialData = async () => {
    setIsLoading(true);
    try {
      const [getDashboardData, getBookingTrend, getRevenueTrend, getServiceUsage] = await Promise.allSettled([
        getDashboardDataService(), getDashboardBookingTrendService(), getDashboardRevenueTrendService(), getDashboardServiceTrendService()
      ]);

      console.log("✅ Dashboard:", getDashboardData);

      if (getDashboardData?.status === "fulfilled") {
        setDashboardData(getDashboardData?.value?.data);
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

  // Enhanced sample data (you might want to fetch this based on date range too)
  const bookingsData = [
    { date: '2025-06-20', bookings: 45, revenue: 3200, patients: 38 },
    { date: '2025-06-21', bookings: 52, revenue: 3800, patients: 44 },
    { date: '2025-06-22', bookings: 38, revenue: 2900, patients: 32 },
    { date: '2025-06-23', bookings: 61, revenue: 4200, patients: 55 },
    { date: '2025-06-24', bookings: 55, revenue: 3900, patients: 47 },
    { date: '2025-06-25', bookings: 48, revenue: 3400, patients: 41 },
    { date: '2025-06-26', bookings: 67, revenue: 4800, patients: 58 },
    { date: '2025-06-27', bookings: 42, revenue: 3100, patients: 36 }
  ];

  const serviceData = [
    { name: 'Consultation', value: 35, color: '#007AFF', count: 245 },
    { name: 'Surgery', value: 25, color: '#34C759', count: 175 },
    { name: 'Diagnostics', value: 20, color: '#FF9500', count: 140 },
    { name: 'Therapy', value: 15, color: '#AF52DE', count: 105 },
    { name: 'Emergency', value: 5, color: '#FF3B30', count: 35 }
  ];

  const todayBookings = [
    { id: 1, time: '9:00 AM', patient: 'John Smith', doctor: 'Dr. Sarah Chen', service: 'Consultation', status: 'completed', avatar: 'JS', priority: 'normal' },
    { id: 2, time: '10:30 AM', patient: 'Emma Wilson', doctor: 'Dr. Michael Brown', service: 'Surgery', status: 'in-progress', avatar: 'EW', priority: 'high' },
    { id: 3, time: '2:00 PM', patient: 'Alex Johnson', doctor: 'Dr. Emily Davis', service: 'Diagnostics', status: 'scheduled', avatar: 'AJ', priority: 'normal' },
    { id: 4, time: '3:30 PM', patient: 'Sarah Miller', doctor: 'Dr. James Wilson', service: 'Therapy', status: 'scheduled', avatar: 'SM', priority: 'low' },
    { id: 5, time: '5:00 PM', patient: 'Tom Anderson', doctor: 'Dr. Sarah Chen', service: 'Emergency', status: 'scheduled', avatar: 'TA', priority: 'urgent' }
  ];

  const transactions = [
    { id: 1, patient: 'John Smith', service: 'Consultation', amount: 150, date: '2025-06-27', status: 'completed', method: 'Card', invoice: '#INV-001' },
    { id: 2, patient: 'Sarah Johnson', service: 'Surgery', amount: 2500, date: '2025-06-27', status: 'pending', method: 'Insurance', invoice: '#INV-002' },
    { id: 3, patient: 'Mike Davis', service: 'Diagnostics', amount: 300, date: '2025-06-26', status: 'completed', method: 'Cash', invoice: '#INV-003' },
    { id: 4, patient: 'Lisa Wilson', service: 'Therapy', amount: 200, date: '2025-06-26', status: 'completed', method: 'Card', invoice: '#INV-004' },
    { id: 5, patient: 'Tom Brown', service: 'Emergency', amount: 800, date: '2025-06-25', status: 'overdue', method: 'Insurance', invoice: '#INV-005' }
  ];

  const reviews = [
    { id: 1, patient: 'Alice Cooper', rating: 5, comment: 'Exceptional care and professionalism. The staff was incredibly attentive and the facility is top-notch.', date: '2025-06-27', service: 'Surgery', verified: true },
    { id: 2, patient: 'Bob Wilson', rating: 4, comment: 'Good overall experience, though the waiting time was longer than expected. The treatment was effective.', date: '2025-06-26', service: 'Consultation', verified: true },
    { id: 3, patient: 'Carol Martinez', rating: 5, comment: 'Outstanding service from start to finish. I felt comfortable and well-informed throughout my visit.', date: '2025-06-25', service: 'Diagnostics', verified: false }
  ];

  const doctors = [
    { id: 1, name: 'Dr. James Wilson', specialty: 'Cardiology', patients: 45, rating: 4.8, available: true, experience: '15 years', location: 'Building A, Floor 2', phone: '+1 (555) 123-4567' },
    { id: 2, name: 'Dr. Sarah Chen', specialty: 'Pediatrics', patients: 38, rating: 4.9, available: false, experience: '12 years', location: 'Building B, Floor 1', phone: '+1 (555) 234-5678' },
    { id: 3, name: 'Dr. Michael Brown', specialty: 'Orthopedics', patients: 52, rating: 4.7, available: true, experience: '18 years', location: 'Building A, Floor 3', phone: '+1 (555) 345-6789' },
    { id: 4, name: 'Dr. Emily Davis', specialty: 'Dermatology', patients: 33, rating: 4.6, available: true, experience: '10 years', location: 'Building C, Floor 1', phone: '+1 (555) 456-7890' }
  ];

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

  const TabButton = ({
    active,
    children,
    onClick,
    icon: Icon,
  }: TabButtonProps) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${active
        ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/10 border border-blue-100'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );

  const StatusBadge = ({
    status,
    priority,
  }: StatusBadgeProps) => {
    const getStatusStyle = () => {
      switch (status) {
        case 'completed':
          return 'bg-green-50 text-green-700 border-green-200';
        case 'in-progress':
          return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'scheduled':
          return 'bg-gray-50 text-gray-700 border-gray-200';
        case 'pending':
          return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'overdue':
          return 'bg-red-50 text-red-700 border-red-200';
        default:
          return 'bg-gray-50 text-gray-700 border-gray-200';
      }
    };

    const getPriorityDot = () => {
      switch (priority) {
        case 'urgent':
          return 'bg-red-500';
        case 'high':
          return 'bg-orange-500';
        case 'normal':
          return 'bg-blue-500';
        case 'low':
          return 'bg-gray-500';
        default:
          return 'bg-gray-500';
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </span>
        {priority && (
          <div className={`w-2 h-2 rounded-full ${getPriorityDot()}`} title={`${priority} priority`}></div>
        )}
      </div>
    );
  };

  const Avatar = ({
    name,
    size = 'md',
  }: AvatarProps) => {
    const sizeClasses: Record<string, string> = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
    };

    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}>
        {name}
      </div>
    );
  };

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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
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
            </div>
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

        {/* Enhanced Tab Navigation */}
        {/* <div className="bg-gray-50 p-1 sm:p-2 rounded-3xl mb-4 sm:mb-8 flex flex-wrap gap-1 w-full">
          {[
            { key: 'overview', label: 'Overview', icon: Activity },
            { key: 'bookings', label: 'Bookings', icon: Calendar },
            { key: 'transactions', label: 'Transactions', icon: IndianRupee },
            { key: 'reviews', label: 'Reviews', icon: Star },
            { key: 'doctors', label: 'Doctors', icon: Users }
          ].map(tab => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              icon={tab.icon}
            >
              {tab.label}
            </TabButton>
          ))}
        </div> */}

        {/* Rest of your tab content remains exactly the same */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-8">
            {/* Enhanced Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              {/* Bookings Chart */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-3 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 gap-2 sm:gap-0">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Bookings Analytics</h3>
                    <p className="text-gray-500 text-xs sm:text-sm">Track your appointment trends</p>
                  </div>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="bg-gray-50 border-0 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Services</option>
                    <option value="consultation">Consultation</option>
                    <option value="surgery">Surgery</option>
                    <option value="diagnostics">Diagnostics</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={bookingsData}>
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
                      data={serviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {serviceData.map((entry, index) => (
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
                  {serviceData.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }}></div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{service.count}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">{service.value}%</p>
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
                <p className="text-gray-500 text-xs sm:text-sm">Daily revenue performance</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={bookingsData}>
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
                  />
                  <Bar dataKey="revenue" fill="#34C759" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
            <div className="p-3 sm:p-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Today's Appointments</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">Manage your daily schedule</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                  <span className="text-xs sm:text-sm text-gray-500">5 appointments</span>
                  <button className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl hover:bg-blue-600 transition-colors text-xs sm:text-sm">
                    Add New
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Time & Patient</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {todayBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-8 py-4">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <Avatar name={booking.avatar} size="lg" />
                          <div>
                            <p className="font-semibold text-gray-900 text-xs sm:text-sm">{booking.patient}</p>
                            <p className="text-xs sm:text-sm text-gray-500">{booking.time}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-4">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="font-semibold text-gray-900 text-xs sm:text-sm">{booking.doctor}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-4">
                        <span className="text-gray-700 font-medium text-xs sm:text-sm">{booking.service}</span>
                      </td>
                      <td className="px-4 sm:px-8 py-4">
                        <StatusBadge status={booking.status} priority={booking.priority} />
                      </td>
                      <td className="px-4 sm:px-8 py-4">
                        <div className="flex items-center space-x-1 sm:space-x-3">
                          <button className="p-1 sm:p-2 rounded-full hover:bg-blue-50 transition-colors">
                            <Eye className="w-4 h-4 text-blue-500" />
                          </button>
                          <button className="p-1 sm:p-2 rounded-full hover:bg-green-50 transition-colors">
                            <Edit className="w-4 h-4 text-green-500" />
                          </button>
                          <button className="p-1 sm:p-2 rounded-full hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
            <div className="p-3 sm:p-8 border-b border-gray-100">
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Patient Reviews</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Recent feedback from your patients</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Comment</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-8 py-4 font-semibold text-gray-900">{review.patient}</td>
                      <td className="px-4 sm:px-8 py-4">{review.service}</td>
                      <td className="px-4 sm:px-8 py-4">
                        <span className="font-semibold text-yellow-500">{'★'.repeat(review.rating)}</span>
                      </td>
                      <td className="px-4 sm:px-8 py-4 max-w-xs truncate" title={review.comment}>{review.comment}</td>
                      <td className="px-4 sm:px-8 py-4">{review.date}</td>
                      <td className="px-4 sm:px-8 py-4">
                        {review.verified ? (
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">Yes</span>
                        ) : (
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-500 border border-gray-200">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
            <div className="p-3 sm:p-8 border-b border-gray-100">
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Recent Transactions</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Track your clinic's financial activity</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-8 py-4 font-semibold text-gray-900">{txn.patient}</td>
                      <td className="px-4 sm:px-8 py-4">{txn.service}</td>
                      <td className="px-4 sm:px-8 py-4 font-semibold text-green-600">${txn.amount}</td>
                      <td className="px-4 sm:px-8 py-4">{txn.date}</td>
                      <td className="px-4 sm:px-8 py-4">
                        <StatusBadge status={txn.status} />
                      </td>
                      <td className="px-4 sm:px-8 py-4">{txn.method}</td>
                      <td className="px-4 sm:px-8 py-4">{txn.invoice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
            <div className="p-3 sm:p-8 border-b border-gray-100">
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Doctors</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Meet your clinic's medical professionals</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Specialty</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Patients</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Available</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 sm:px-8 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-8 py-4 font-semibold text-gray-900">{doc.name}</td>
                      <td className="px-4 sm:px-8 py-4">{doc.specialty}</td>
                      <td className="px-4 sm:px-8 py-4">{doc.patients}</td>
                      <td className="px-4 sm:px-8 py-4 font-semibold text-yellow-500">{doc.rating} ★</td>
                      <td className="px-4 sm:px-8 py-4">
                        {doc.available ? (
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">Yes</span>
                        ) : (
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-500 border border-gray-200">No</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-8 py-4">{doc.experience}</td>
                      <td className="px-4 sm:px-8 py-4">{doc.location}</td>
                      <td className="px-4 sm:px-8 py-4">{doc.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;