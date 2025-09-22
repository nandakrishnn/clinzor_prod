import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  TrendingUp,
  Users,
  Stethoscope,
  Building2,
  CreditCard,
  UserCheck,
  Activity,
  DollarSign,
  ChevronDown,
  Filter,
  Download,
  Eye,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Search
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  TooltipProps
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  GetAllUsertabAnalytics,
  GetAllExperttabAnalytics,
  GetAllBookingtabAnalytics,
  GetAllDueRecievedtabAnalytics,
  GetAllDuetabAnalytics,
  GetAllTopBooked,
  GetAllMostBookedAreas,
  GetUserGrowthTrend,
  GetBookingWeeklyTrend,
  GetExpertSlotUtilization
} from '@/service/admin/dashboardService';

// Type definitions
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

interface CustomTooltipProps extends TooltipProps<any, any> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

interface DashboardData {
  totalUsers: number;
  totalExperts: number;
  totalBookings: number;
  totalRevenue: number;
  pendingDues: number;
  mostBookedAreas: Array<{
    area: string;
    bookings: number;
    growth: number;
    coordinates: [number, number];
  }>;
  topServices: Array<{
    service: string;
    bookings: number;
    revenue: number;
    growth: number;
  }>;
  expertSlots: Array<{
    expert: string;
    specialty: string;
    totalSlots: number;
    bookedSlots: number;
    rating: number;
    clinic: string;
  }>;
  clinicDues: Array<{
    clinic: string;
    pending: number;
    overdue: number;
    lastPayment: string;
    status: 'good' | 'pending' | 'overdue';
  }>;
  recentTransactions: Array<{
    id: string;
    user: string;
    amount: number;
    service: string;
    date: string;
    status: 'completed' | 'pending';
  }>;
  campRegistrations: Array<{
    camp: string;
    registrations: number;
    date: string;
    location: string;
    status: 'upcoming' | 'completed';
  }>;
  userGrowthData: Array<{
    month: string;
    users: number;
    experts: number;
  }>;
  bookingTrends: Array<{
    day: string;
    bookings: number;
    revenue: number;
  }>;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899'];

// Custom components
const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color, subtitle }) => (
  <motion.div
    className={`bg-transparent border border-gray-100 shadow rounded-lg p-6 hover:shadow-xl transition-all duration-300 ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-semibold text-black tracking-wide">{title}</p>
        <p className="text-3xl font-extrabold text-black mt-1 drop-shadow-sm">{value}</p>
        {subtitle && <p className="text-xs text-black mt-1 font-medium">{subtitle}</p>}
        {change !== undefined && (
          <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span className="ml-1">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl shadow-lg bg-transparent text-black flex items-center justify-center`}>{icon}</div>
    </div>
  </motion.div>
);

const ChartCard: React.FC<ChartCardProps> = ({ title, children, action }) => (
  <motion.div
    className="bg-transparent border border-gray-100 shadow rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-black tracking-wide drop-shadow-sm">{title}</h3>
      {action}
    </div>
    {children}
  </motion.div>
);

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: startOfDay(subDays(new Date(), 7)),
    endDate: endOfDay(new Date())
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        userAnalytics,
        expertAnalytics,
        bookingAnalytics,
        dueReceivedAnalytics,
        dueAnalytics,
        topBookedServices,
        mostBookedAreas,
        userGrowthTrend,
        bookingWeeklyTrend,
        expertSlotUtilization
      ] = await Promise.all([
        GetAllUsertabAnalytics(),
        GetAllExperttabAnalytics(),
        GetAllBookingtabAnalytics(),
        GetAllDueRecievedtabAnalytics(),
        GetAllDuetabAnalytics(),
        GetAllTopBooked(),
        GetAllMostBookedAreas(),
        GetUserGrowthTrend(),
        GetBookingWeeklyTrend(),
        GetExpertSlotUtilization()
      ]);
      // ✅ Log all raw API responses
      console.log("📊 Raw API Data:", {
        userAnalytics,
        expertAnalytics,
        bookingAnalytics,
        dueReceivedAnalytics,
        dueAnalytics,
        topBookedServices,
        mostBookedAreas,
        userGrowthTrend,
        bookingWeeklyTrend,
        expertSlotUtilization
      });


      // Transform API data to match our DashboardData interface
      const transformedData: DashboardData = {
        totalUsers: userAnalytics?.total_user || 0,
        totalExperts: expertAnalytics?.total_expert_user || 0,
        totalBookings: bookingAnalytics?.total_bookings || 0,
        totalRevenue: dueReceivedAnalytics?.recived_amount || 0,
        pendingDues: dueAnalytics?.outstanding_amount || 0,
        mostBookedAreas: mostBookedAreas?.map((area: any) => ({
          area: `Pincode: ${area.pincode}`,
          bookings: area.booking_count,
          growth: 0, // Not provided in API
          coordinates: [0, 0] // Not provided in API
        })) || [],
        topServices: topBookedServices?.map((service: any) => ({
          service: service.service_name,
          bookings: service.booking_count,
          revenue: 0, // Not provided in API
          growth: 0 // Not provided in API
        })) || [],
        expertSlots: expertSlotUtilization?.map((expert: any) => ({
          expert: expert.expert_name,
          specialty: "Specialty not provided", // Not provided in API
          totalSlots: expert.total_slots,
          bookedSlots: expert.booked_slots,
          rating: 0, // Not provided in API
          clinic: "Clinic not provided" // Not provided in API
        })) || [],
        clinicDues: [], // Not provided in API
        recentTransactions: [], // Not provided in API
        campRegistrations: [], // Not provided in API
        userGrowthData: userGrowthTrend?.map((month: any) => ({
          month: month.joined_month,
          users: month.user_count,
          experts: 0 // Not provided in API
        })) || [],
        bookingTrends: [] // Not provided in API
      };

      setData(transformedData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">No data available</div>;

  // Calculate today's bookings from recentTransactions
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysBookings = data.recentTransactions.filter(txn => txn.date === todayStr).length;

  // Sort top services by bookings (descending)
  const topBookedServices = [...data.topServices].sort((a, b) => b.bookings - a.bookings).slice(0, 5);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor and manage your healthcare platform</p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <DatePicker
                selected={dateRange.startDate}
                onChange={(date: Date | null) => {
                  if (date) {
                    setDateRange(prev => ({ ...prev, startDate: date }));
                  }
                }}
                selectsStart
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                maxDate={dateRange.endDate}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="MMM d, yyyy"
              />
              <span className="text-gray-500">to</span>
              <DatePicker
                selected={dateRange.endDate}
                onChange={(date: Date | null) => {
                  if (date) {
                    setDateRange(prev => ({ ...prev, endDate: date }));
                  }
                }}
                selectsEnd
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                minDate={dateRange.startDate}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="MMM d, yyyy"
              />
            </div>

            <button
              className="flex items-center gap-2 bg-primaryColor text-white px-4 py-2 rounded-lg hover:primaryColor transition-colors"
              onClick={fetchDashboardData}
            >
              <Download size={16} />
              Refresh Data
            </button>
          </div>
        </motion.div>

        {/* Animated Gradient Bar */}
        {/* <div className="w-full h-1 mb-8 rounded-xl animate-gradient-x bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-[1px] opacity-80" /> */}
        <hr />
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 my-8">
          <StatCard
            title="Total Users"
            value={data.totalUsers.toLocaleString()}
            change={data.userGrowthData.length > 0 ?
              ((data.userGrowthData[data.userGrowthData.length - 1].users -
                (data.userGrowthData.length > 1 ? data.userGrowthData[data.userGrowthData.length - 2].users : 0)) /
                (data.userGrowthData.length > 1 ? data.userGrowthData[data.userGrowthData.length - 2].users : 1)) * 100 : 0
            }
            icon={<Users size={24} className="text-white" />}
            color="bg-blue-500"
            subtitle="Active users"
          />
          <StatCard
            title="Total Experts"
            value={data.totalExperts.toLocaleString()}
            change={0} // Not provided in API
            icon={<UserCheck size={24} className="text-white" />}
            color="bg-purple-500"
            subtitle="Verified doctors"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${data.totalRevenue.toLocaleString()}`}
            change={0} // Not provided in API
            icon={<DollarSign size={24} className="text-white" />}
            color="bg-green-500"
            subtitle="This month"
          />
          <StatCard
            title="Pending Dues"
            value={`₹${data.pendingDues.toLocaleString()}`}
            change={0} // Not provided in API
            icon={<CreditCard size={24} className="text-white" />}
            color="bg-red-500"
            subtitle="To be collected"
          />
          <StatCard
            title="Today's Bookings"
            value={todaysBookings}
            icon={<CalendarDays size={24} className="text-white" />}
            color="bg-yellow-500"
            subtitle="Bookings today"
          />
        </div>

        {/* Top Booked Services Section */}
        {data.topServices.length > 0 && (
          <div className="mb-8">
            <ChartCard title="Top Booked Services">
              <div className="divide-y divide-gray-200">
                {topBookedServices.map((service, idx) => (
                  <div key={service.service} className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <span className="font-bold text-xl text-black mr-2">{idx + 1}.</span>
                      <span className="text-black font-semibold">{service.service}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-black">Bookings: <span className="font-bold">{service.bookings}</span></span>
                      {service.revenue > 0 && (
                        <span className="text-black">Revenue: <span className="font-bold">₹{service.revenue.toLocaleString()}</span></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          {data.userGrowthData.length > 0 && (
            <ChartCard
              title="User Growth Trends"
              action={
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View Details
                </button>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* Booking Trends - Empty since not provided in API */}
          {data.bookingTrends.length > 0 ? (
            <ChartCard
              title="Daily Booking Trends"
              action={
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View Details
                </button>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.bookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="bookings" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          ) : (
            <ChartCard title="Daily Booking Trends">
              <div className="h-64 flex items-center justify-center text-gray-500">
                No booking trend data available
              </div>
            </ChartCard>
          )}
        </div>

        {/* Most Booked Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {data.mostBookedAreas.length > 0 && (
            <div className="lg:col-span-2">
              <ChartCard
                title="Most Booked Areas"
                action={
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    View All
                  </button>
                }
              >
                <div className="space-y-4">
                  {data.mostBookedAreas.map((area, index) => (
                    <motion.div
                      key={area.area}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <MapPin size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{area.area}</h4>
                          <p className="text-sm text-gray-600">{area.bookings} bookings</p>
                        </div>
                      </div>
                      <div className={`flex items-center text-sm ${area.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {area.growth >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span className="ml-1">{Math.abs(area.growth)}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ChartCard>
            </div>
          )}

          {/* Top Services Pie Chart */}
          {data.topServices.length > 0 && (
            <ChartCard
              title="Top Services"
              action={
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </button>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.topServices}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="bookings"
                    nameKey="service"
                  >
                    {data.topServices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {data.topServices.slice(0, 3).map((service, index) => (
                  <div key={service.service} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: colors[index] }}></div>
                      <span className="text-gray-700">{service.service}</span>
                    </div>
                    <span className="font-medium">{service.bookings}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}
        </div>

        {/* Expert Slots & Clinic Dues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expert Slots */}
          {data.expertSlots.length > 0 && (
            <ChartCard
              title="Expert Slot Utilization"
              action={
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </button>
              }
            >
              <div className="space-y-4">
                {data.expertSlots.map((expert, index) => (
                  <motion.div
                    key={expert.expert}
                    className="p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{expert.expert}</h4>
                        <p className="text-sm text-gray-600">{expert.specialty} • {expert.clinic}</p>
                      </div>
                      {expert.rating > 0 && (
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{expert.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {expert.bookedSlots}/{expert.totalSlots} slots booked
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {Math.round((expert.bookedSlots / expert.totalSlots) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(expert.bookedSlots / expert.totalSlots) * 100}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ChartCard>
          )}

          {/* Clinic Dues - Empty since not provided in API */}
          {data.clinicDues.length > 0 ? (
            <ChartCard
              title="Clinic Dues Overview"
              action={
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </button>
              }
            >
              <div className="space-y-4">
                {data.clinicDues.map((clinic, index) => (
                  <motion.div
                    key={clinic.clinic}
                    className="p-4 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{clinic.clinic}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${clinic.status === 'good' ? 'bg-green-100 text-green-700' :
                          clinic.status === 'overdue' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                        {clinic.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-600">Pending: <span className="font-medium">₹{clinic.pending.toLocaleString()}</span></p>
                        {clinic.overdue > 0 && (
                          <p className="text-red-600">Overdue: <span className="font-medium">₹{clinic.overdue.toLocaleString()}</span></p>
                        )}
                      </div>
                      <p className="text-gray-500">Last payment: {clinic.lastPayment}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ChartCard>
          ) : (
            <ChartCard title="Clinic Dues Overview">
              <div className="h-64 flex items-center justify-center text-gray-500">
                No clinic dues data available
              </div>
            </ChartCard>
          )}
        </div>

        {/* Recent Transactions - Empty since not provided in API */}
        {data.recentTransactions.length > 0 ? (
          <ChartCard
            title="Recent Transactions"
            action={
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View All
              </button>
            }
          >
            <div className="space-y-3">
              {data.recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CreditCard size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.user}</h4>
                      <p className="text-sm text-gray-600">{transaction.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{transaction.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {transaction.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>
        ) : (
          <ChartCard title="Recent Transactions">
            <div className="h-64 flex items-center justify-center text-gray-500">
              No recent transactions data available
            </div>
          </ChartCard>
        )}
      </div>
    </div>
  );
}