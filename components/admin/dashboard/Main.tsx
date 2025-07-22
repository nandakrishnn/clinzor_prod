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
  totalClinics: number;
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
    clinics: number;
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

// Sample data - in real app, this would come from your API
const generateMockData = (dateRange: DateRange): DashboardData => {
  // Helper function to check if a date string is within range
  const isDateInRange = (dateStr: string) => {
    const date = new Date(dateStr);
    return date >= dateRange.startDate && date <= dateRange.endDate;
  };

  // Helper function to filter data by date
  const filterByDate = <T extends { date: string }>(items: T[]): T[] => {
    return items.filter(item => isDateInRange(item.date));
  };

  // Helper function to filter clinic dues by last payment date
  const filterClinicDues = (items: DashboardData['clinicDues']): DashboardData['clinicDues'] => {
    return items.filter(item => isDateInRange(item.lastPayment));
  };

  // Helper function to calculate totals for filtered data
  const calculateTotal = <T extends Record<string, any>>(items: T[], key: keyof T): number => {
    return items.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
  };

  // Base data with all items
  const allData: DashboardData = {
    totalUsers: 12450,
    totalExperts: 285,
    totalClinics: 48,
    totalBookings: 3420,
    totalRevenue: 245000,
    pendingDues: 45000,
    mostBookedAreas: [
      { area: 'Kozhikode', bookings: 890, growth: 12.5, coordinates: [75.7704, 11.2588] },
      { area: 'Kalpetta', bookings: 756, growth: 8.3, coordinates: [76.0833, 11.6083] },
      { area: 'Malappuram', bookings: 645, growth: -2.1, coordinates: [76.0833, 11.0833] },
      { area: 'Thrissur', bookings: 534, growth: 15.2, coordinates: [76.2144, 10.5276] },
      { area: 'Palakkad', bookings: 423, growth: 6.7, coordinates: [76.6547, 10.7867] }
    ],
    topServices: [
      { service: 'General Consultation', bookings: 1245, revenue: 62250, growth: 18.5 },
      { service: 'Cardiology', bookings: 856, revenue: 171200, growth: 12.3 },
      { service: 'Dermatology', bookings: 734, revenue: 73400, growth: -3.2 },
      { service: 'Pediatrics', bookings: 623, revenue: 31150, growth: 22.1 },
      { service: 'Orthopedics', bookings: 445, revenue: 89000, growth: 9.8 }
    ],
    expertSlots: [
      { expert: 'Dr. Rajesh Kumar', specialty: 'Cardiology', totalSlots: 120, bookedSlots: 96, rating: 4.8, clinic: 'Heart Care Center' },
      { expert: 'Dr. Priya Nair', specialty: 'Dermatology', totalSlots: 100, bookedSlots: 78, rating: 4.9, clinic: 'Skin Clinic' },
      { expert: 'Dr. Arjun Menon', specialty: 'Orthopedics', totalSlots: 80, bookedSlots: 72, rating: 4.7, clinic: 'Bone & Joint Center' },
      { expert: 'Dr. Meera Joseph', specialty: 'Pediatrics', totalSlots: 90, bookedSlots: 81, rating: 4.8, clinic: 'Child Care Hospital' },
      { expert: 'Dr. Suresh Pillai', specialty: 'General Medicine', totalSlots: 150, bookedSlots: 98, rating: 4.6, clinic: 'City Hospital' }
    ],
    clinicDues: [
      { clinic: 'Apollo Hospital', pending: 15000, overdue: 5000, lastPayment: '2025-06-05', status: 'pending' },
      { clinic: 'KIMS Hospital', pending: 12000, overdue: 0, lastPayment: '2025-06-08', status: 'good' },
      { clinic: 'Medical Trust', pending: 8500, overdue: 2000, lastPayment: '2025-05-28', status: 'overdue' },
      { clinic: 'Sunrise Hospital', pending: 6000, overdue: 0, lastPayment: '2025-06-10', status: 'good' },
      { clinic: 'City Care Center', pending: 3500, overdue: 1500, lastPayment: '2025-05-20', status: 'overdue' }
    ],
    recentTransactions: [
      { id: 'TXN001', user: 'Ravi Kumar', amount: 1500, service: 'Cardiology Consultation', date: '2025-06-11', status: 'completed' },
      { id: 'TXN002', user: 'Anita Sharma', amount: 800, service: 'General Checkup', date: '2025-06-11', status: 'completed' },
      { id: 'TXN003', user: 'Mohammed Ali', amount: 2200, service: 'Orthopedic Surgery', date: '2025-06-10', status: 'pending' },
      { id: 'TXN004', user: 'Lakshmi Nair', amount: 600, service: 'Dermatology', date: '2025-06-10', status: 'completed' },
      { id: 'TXN005', user: 'Arjun Pillai', amount: 1200, service: 'Pediatric Care', date: '2025-06-09', status: 'completed' },
      { id: 'TXN006', user: 'Sonia Mathew', amount: 950, service: 'ENT Consultation', date: '2025-06-12', status: 'completed' },
      { id: 'TXN007', user: 'Vishnu Menon', amount: 1750, service: 'Cardiology Consultation', date: '2025-06-12', status: 'pending' },
      { id: 'TXN008', user: 'Priya Das', amount: 1100, service: 'General Checkup', date: '2025-06-12', status: 'completed' },
      { id: 'TXN009', user: 'Rahul R', amount: 2100, service: 'Orthopedic Surgery', date: '2025-06-11', status: 'completed' },
      { id: 'TXN010', user: 'Meera S', amount: 700, service: 'Dermatology', date: '2025-06-11', status: 'completed' },
      { id: 'TXN011', user: 'Anoop K', amount: 1300, service: 'Pediatric Care', date: '2025-06-10', status: 'pending' },
      { id: 'TXN012', user: 'Jithin Jose', amount: 1600, service: 'ENT Consultation', date: '2025-06-09', status: 'completed' },
      { id: 'TXN013', user: 'Divya S', amount: 900, service: 'General Checkup', date: '2025-06-08', status: 'completed' },
      { id: 'TXN014', user: 'Suresh Kumar', amount: 2500, service: 'Cardiology Consultation', date: '2025-06-08', status: 'completed' },
      { id: 'TXN015', user: 'Neha Thomas', amount: 1050, service: 'Dermatology', date: '2025-06-07', status: 'completed' },
    ],
    campRegistrations: [
      { camp: 'Diabetes Awareness Camp', registrations: 45, date: '2025-06-15', location: 'Kozhikode', status: 'upcoming' },
      { camp: 'Heart Health Checkup', registrations: 38, date: '2025-06-18', location: 'Kalpetta', status: 'upcoming' },
      { camp: 'Cancer Screening', registrations: 52, date: '2025-06-12', location: 'Thrissur', status: 'completed' },
      { camp: 'Blood Donation Drive', registrations: 89, date: '2025-06-20', location: 'Malappuram', status: 'upcoming' },
      { camp: 'Child Vaccination', registrations: 67, date: '2025-06-08', location: 'Palakkad', status: 'completed' }
    ],
    userGrowthData: [
      { month: 'Jan', users: 8500, experts: 180, clinics: 35 },
      { month: 'Feb', users: 9200, experts: 195, clinics: 38 },
      { month: 'Mar', users: 9800, experts: 210, clinics: 42 },
      { month: 'Apr', users: 10500, experts: 235, clinics: 45 },
      { month: 'May', users: 11200, experts: 260, clinics: 47 },
      { month: 'Jun', users: 12450, experts: 285, clinics: 48 }
    ],
    bookingTrends: [
      { day: 'Mon', bookings: 45, revenue: 8500 },
      { day: 'Tue', bookings: 52, revenue: 9800 },
      { day: 'Wed', bookings: 48, revenue: 9200 },
      { day: 'Thu', bookings: 58, revenue: 11200 },
      { day: 'Fri', bookings: 62, revenue: 12500 },
      { day: 'Sat', bookings: 35, revenue: 6800 },
      { day: 'Sun', bookings: 28, revenue: 5200 }
    ]
  };

  // Filter data based on date range
  const filteredTransactions = filterByDate(allData.recentTransactions);
  const filteredCampRegistrations = filterByDate(allData.campRegistrations);
  const filteredClinicDues = filterClinicDues(allData.clinicDues);

  // Calculate totals for filtered data
  const totalRevenue = calculateTotal(filteredTransactions, 'amount');
  const totalBookings = calculateTotal(filteredTransactions, 'amount');
  const totalCampRegistrations = calculateTotal(filteredCampRegistrations, 'registrations');
  const totalPendingDues = calculateTotal(filteredClinicDues, 'pending');

  // Return filtered and calculated data
  return {
    ...allData,
    totalRevenue,
    totalBookings,
    pendingDues: totalPendingDues,
    recentTransactions: filteredTransactions,
    campRegistrations: filteredCampRegistrations,
    clinicDues: filteredClinicDues,
    // Adjust other metrics based on the date range
    totalUsers: Math.round(allData.totalUsers * (filteredTransactions.length / allData.recentTransactions.length)),
    totalExperts: Math.round(allData.totalExperts * (filteredTransactions.length / allData.recentTransactions.length)),
    totalClinics: Math.round(allData.totalClinics * (filteredTransactions.length / allData.recentTransactions.length))
  };
};

const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899'];

// Custom components
const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color, subtitle }) => (
  <motion.div 
    className={`bg-transparent border-none shadow-2xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 ${color}`}
    whileHover={{ y: -4, scale: 1.03 }}
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
    className="bg-transparent border-none shadow-2xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
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
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  useEffect(() => {
    setData(generateMockData(dateRange));
  }, [dateRange]);
  
  if (!data) return <div>Loading...</div>;
  
  // Helper to get today's date in YYYY-MM-DD
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  // Calculate today's bookings from recentTransactions
  const todaysBookings = data.recentTransactions.filter(txn => txn.date === todayStr).length;

  // Sort top services by bookings (descending)
  const topBookedServices = [...data.topServices].sort((a, b) => b.bookings - a.bookings).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </motion.div>
        
        {/* Animated Gradient Bar */}
        <div className="w-full h-2 mb-8 rounded-xl animate-gradient-x bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-[1px] opacity-80" />
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={data.totalUsers.toLocaleString()}
            change={12.5}
            icon={<Users size={24} className="text-white" />}
            color="bg-blue-500"
            subtitle="Active users"
          />
          <StatCard
            title="Total Experts"
            value={data.totalExperts.toLocaleString()}
            change={8.3}
            icon={<UserCheck size={24} className="text-white" />}
            color="bg-purple-500"
            subtitle="Verified doctors"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${(data.totalRevenue / 1000).toFixed(0)}K`}
            change={15.2}
            icon={<DollarSign size={24} className="text-white" />}
            color="bg-green-500"
            subtitle="This month"
          />
          <StatCard
            title="Pending Dues"
            value={`₹${(data.pendingDues / 1000).toFixed(0)}K`}
            change={-5.8}
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
                    <span className="text-black">Revenue: <span className="font-bold">₹{service.revenue.toLocaleString()}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
        
        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
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
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
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
          
          {/* Booking Trends */}
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
        </div>
        
        {/* Most Booked Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
          
          {/* Top Services Pie Chart */}
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
        </div>
        
        {/* Expert Slots & Clinic Dues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expert Slots */}
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
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{expert.rating}</span>
                    </div>
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
          
          {/* Clinic Dues */}
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      clinic.status === 'good' ? 'bg-green-100 text-green-700' :
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
        </div>
        
        {/* Recent Transactions & Camp Registrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Transactions */}
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
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>
          
          {/* Camp Registrations */}
          <ChartCard 
            title="Camp Registrations"
            action={
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View All
              </button>
            }
          >
            <div className="space-y-3">
              {data.campRegistrations.map((camp, index) => (
                <motion.div 
                  key={camp.camp}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Activity size={16} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{camp.camp}</h4>
                      <p className="text-sm text-gray-600">{camp.location} • {camp.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{camp.registrations}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      camp.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {camp.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}