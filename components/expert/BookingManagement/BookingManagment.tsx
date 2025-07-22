import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, Filter, Download, RefreshCw, Calendar, CheckCircle, XCircle, 
  AlertCircle, User, Video, Phone, MessageSquare, Eye, Edit, Trash2, 
  ChevronLeft, ChevronRight, Clock, DollarSign, AlertTriangle, Save, Plus, X, PhoneOff
} from 'lucide-react';

// Types
interface Booking {
  uuid: string;
  created_by: string;
  payment_mode: string;
  start_time: string;
  end_time: string;
  payment_status: string;
  booking_status: string;
  room_id: string | null;
  expert_meeting_link: string | null;
  booking_charge: string;
  booking_type: string;
  customer: string;
  slot: string;
  expert: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning';
}

// Add new interface for Slot
interface Slot {
  uuid: string;
  expert: string;
  created_by: string | null;
  start_time: string;
  end_time: string;
  status: string;
  is_booked: boolean;
  reason_for_rejection: string | null;
}

// Add new interface for SlotResponse
interface SlotResponse {
  status: number;
  message: string;
  data: {
    current_page: number;
    total_pages: number;
    total_items: number;
    next: string | null;
    previous: string | null;
    data: Slot[];
  }
}

// Add new interface for BookingResponse
interface BookingResponse {
  status: number;
  message: string;
  data: Booking;
}

// Add new interface for CreateBookingPayload
interface CreateBookingPayload {
  uuid: string;
  created_by: string;
  payment_mode: string;
  start_time: string;
  end_time: string;
  payment_status: string;
  booking_status: string;
  room_id: string | null;
  customer_meeting_link: string | null;
  expert_meeting_link: string | null;
  booking_charge: string;
  booking_type: string;
  customer: string;
  slot: string;
  expert: string;
  doctor_gender_preference: string | null;
  session_type: string | null;
  patient_name: string | null;
  patient_address: string | null;
  patient_mobile: string | null;
  patient_email: string | null;
  clinic_service: string | null;
}

// Add missing type definitions
interface ChatMessage {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

// Update sample data with more realistic bookings
const sampleBookings: Booking[] = [
  {
    uuid: "BK0001",
    created_by: "expert@clinzor.com",
    payment_mode: "ONLINE",
    start_time: "2024-03-20T10:00:00Z",
    end_time: "2024-03-20T10:30:00Z",
    payment_status: "COMPLETED",
    booking_status: "COMPLETED",
    room_id: "room_123",
    expert_meeting_link: "https://app.100ms.live/meeting/room_123?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    booking_charge: "150.00",
    booking_type: "VIDEO_CALL",
    customer: "patient_001",
    slot: "slot_001",
    expert: "expert_001"
  },
  {
    uuid: "BK0002",
    created_by: "expert@clinzor.com",
    payment_mode: "ONLINE",
    start_time: "2024-03-20T11:00:00Z",
    end_time: "2024-03-20T11:30:00Z",
    payment_status: "COMPLETED",
    booking_status: "CONFIRMED",
    room_id: "room_124",
    expert_meeting_link: "https://app.100ms.live/meeting/room_124?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    booking_charge: "150.00",
    booking_type: "VIDEO_CALL",
    customer: "patient_002",
    slot: "slot_002",
    expert: "expert_001"
  },
  {
    uuid: "BK0003",
    created_by: "expert@clinzor.com",
    payment_mode: "ONLINE",
    start_time: "2024-03-20T14:00:00Z",
    end_time: "2024-03-20T14:30:00Z",
    payment_status: "PENDING",
    booking_status: "PENDING",
    room_id: null,
    expert_meeting_link: null,
    booking_charge: "150.00",
    booking_type: "VIDEO_CALL",
    customer: "patient_003",
    slot: "slot_003",
    expert: "expert_001"
  },
  {
    uuid: "BK0004",
    created_by: "expert@clinzor.com",
    payment_mode: "ONLINE",
    start_time: "2024-03-20T15:00:00Z",
    end_time: "2024-03-20T15:30:00Z",
    payment_status: "COMPLETED",
    booking_status: "CANCELED",
    room_id: null,
    expert_meeting_link: null,
    booking_charge: "150.00",
    booking_type: "VIDEO_CALL",
    customer: "patient_004",
    slot: "slot_004",
    expert: "expert_001"
  },
  {
    uuid: "BK0005",
    created_by: "expert@clinzor.com",
    payment_mode: "ONLINE",
    start_time: "2024-03-21T09:00:00Z",
    end_time: "2024-03-21T09:30:00Z",
    payment_status: "COMPLETED",
    booking_status: "CONFIRMED",
    room_id: "room_125",
    expert_meeting_link: "https://app.100ms.live/meeting/room_125?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    booking_charge: "150.00",
    booking_type: "VIDEO_CALL",
    customer: "patient_005",
    slot: "slot_005",
    expert: "expert_001"
  },
  {
    uuid: "BK0006",
    created_by: "expert@clinzor.com",
    payment_mode: "ONLINE",
    start_time: "2024-03-21T10:00:00Z",
    end_time: "2024-03-21T10:30:00Z",
    payment_status: "PENDING",
    booking_status: "PENDING",
    room_id: null,
    expert_meeting_link: null,
    booking_charge: "150.00",
    booking_type: "VIDEO_CALL",
    customer: "patient_006",
    slot: "slot_006",
    expert: "expert_001"
  },
  {
    uuid: "BK0007",
    created_by: "expert@clinzor.com",
    payment_mode: "ONLINE",
    start_time: "2024-03-21T11:00:00Z",
    end_time: "2024-03-21T11:30:00Z",
    payment_status: "COMPLETED",
    booking_status: "COMPLETED",
    room_id: "room_126",
    expert_meeting_link: "https://app.100ms.live/meeting/room_126?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    booking_charge: "150.00",
    booking_type: "VIDEO_CALL",
    customer: "patient_007",
    slot: "slot_007",
    expert: "expert_001"
  },
  {
    uuid: "BK0008",
    created_by: "expert@clinzor.com",
    payment_mode: "ONLINE",
    start_time: "2024-03-21T14:00:00Z",
    end_time: "2024-03-21T14:30:00Z",
    payment_status: "COMPLETED",
    booking_status: "CONFIRMED",
    room_id: "room_127",
    expert_meeting_link: "https://app.100ms.live/meeting/room_127?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    booking_charge: "150.00",
    booking_type: "VIDEO_CALL",
    customer: "patient_008",
    slot: "slot_008",
    expert: "expert_001"
  },
  {
    uuid: "BK0009",
    created_by: "expert@clinzor.com",
    payment_mode: "ONLINE",
    start_time: "2024-03-21T15:00:00Z",
    end_time: "2024-03-21T15:30:00Z",
    payment_status: "PENDING",
    booking_status: "PENDING",
    room_id: null,
    expert_meeting_link: null,
    booking_charge: "150.00",
    booking_type: "VIDEO_CALL",
    customer: "patient_009",
    slot: "slot_009",
    expert: "expert_001"
  },
  {
    uuid: "BK0010",
    created_by: "expert@clinzor.com",
    payment_mode: "ONLINE",
    start_time: "2024-03-22T09:00:00Z",
    end_time: "2024-03-22T09:30:00Z",
    payment_status: "COMPLETED",
    booking_status: "COMPLETED",
    room_id: "room_128",
    expert_meeting_link: "https://app.100ms.live/meeting/room_128?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    booking_charge: "150.00",
    booking_type: "VIDEO_CALL",
    customer: "patient_010",
    slot: "slot_010",
    expert: "expert_001"
  }
];

// Modal Component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Add type definitions for status configs
type StatusConfig = {
  color: string;
  icon: string;
};

type StatusConfigs = {
  [key: string]: StatusConfig;
};

// Add new interface for VideoCallModal
interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  bookingId: string;
}

// Video Call Modal Component
const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, roomId, bookingId }) => {
  const [videoCallUrl, setVideoCallUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && roomId) {
      // If roomId is a full URL, use it directly
      if (roomId.startsWith('http')) {
        setVideoCallUrl(roomId);
        setIsLoading(false);
      } else {
        // If it's just a room ID, fetch the URL from API (fallback)
        const fetchVideoCallUrl = async () => {
          try {
            setIsLoading(true);
            setError('');
            
            const response = await fetch(`/api/expert/videocall/url?roomId=${roomId}&userName=Expert`);
            
            if (!response.ok) {
              throw new Error('Failed to get video call URL');
            }
            
            const data = await response.json();
            setVideoCallUrl(data.videoCallUrl);
          } catch (err) {
            console.error('Error fetching video call URL:', err);
            setError('Failed to load video call. Please try again.');
          } finally {
            setIsLoading(false);
          }
        };

        fetchVideoCallUrl();
      }
    }
  }, [isOpen, roomId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Video Call</h2>
            <p className="text-sm text-gray-500">Booking: {bookingId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>
        
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading video call...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="bg-red-600 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <PhoneOff className="text-white" size={24} />
                </div>
                <h3 className="text-red-600 text-xl font-semibold mb-2">Connection Failed</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <iframe
              src={videoCallUrl}
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen; speaker; display-capture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ExpertBookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalType, setModalType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [editData, setEditData] = useState<Partial<Booking>>({});
  const [createBookingData, setCreateBookingData] = useState<CreateBookingPayload>({
    uuid: '',
    created_by: 'fake@exampl.com',
    payment_mode: 'ONLINE',
    start_time: '',
    end_time: '',
    payment_status: 'PENDING',
    booking_status: 'PENDING',
    room_id: null,
    customer_meeting_link: null,
    expert_meeting_link: null,
    booking_charge: '0.00',
    booking_type: 'VIDEO_CALL',
    customer: 'e10a9c6f-0166-4c54-a468-e25cc17b07f8',
    slot: '',
    expert: '',
    doctor_gender_preference: null,
    session_type: null,
    patient_name: null,
    patient_address: null,
    patient_mobile: null,
    patient_email: null,
    clinic_service: null
  });

  // Filter states
  const [filters, setFilters] = useState({
    booking_status: 'ALL',
    payment_status: 'ALL',
    booking_type: 'ALL',
    from_date: '',
    to_date: '',
    payment_mode: 'ALL',
    sort_by: 'date_desc',
    quick_date: 'ALL'
  });

  const bookingStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'];
  const paymentStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
  const bookingTypes = ['VIDEO_CALL', 'PHONE_CALL', 'PHYSICAL_VISIT'];
  const paymentModes = ['ONLINE', 'CASH', 'CARD'];

  // Add new state for slots
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Add a counter for booking numbers
  const [bookingCounter, setBookingCounter] = useState(1);

  // Add quick date options
  const quickDateOptions = [
    { value: 'ALL', label: 'All Time' },
    { value: 'TODAY', label: 'Today' },
    { value: 'TOMORROW', label: 'Tomorrow' },
    { value: 'THIS_WEEK', label: 'This Week' },
    { value: 'NEXT_WEEK', label: 'Next Week' },
    { value: 'THIS_MONTH', label: 'This Month' }
  ];

  // Add sorting options
  const sortOptions = [
    { value: 'date_desc', label: 'Date (Newest First)' },
    { value: 'date_asc', label: 'Date (Oldest First)' },
    { value: 'status_asc', label: 'Status (A-Z)' },
    { value: 'status_desc', label: 'Status (Z-A)' }
  ];

  // Update the filteredBookings logic to include sorting
  const filteredBookings = useMemo(() => {
    let filtered = bookings.filter(booking => {
      const searchMatch = !searchTerm || 
        booking.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.created_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.expert.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = filters.booking_status === 'ALL' || booking.booking_status === filters.booking_status;
      const paymentMatch = filters.payment_status === 'ALL' || booking.payment_status === filters.payment_status;
      const typeMatch = filters.booking_type === 'ALL' || booking.booking_type === filters.booking_type;
      const modeMatch = filters.payment_mode === 'ALL' || booking.payment_mode === filters.payment_mode;

      // Handle quick date filters
      let dateMatch = true;
      const bookingDate = new Date(booking.start_time);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      
      const nextWeekStart = new Date(thisWeekStart);
      nextWeekStart.setDate(thisWeekStart.getDate() + 7);
      
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      switch (filters.quick_date) {
        case 'TODAY':
          dateMatch = bookingDate.toDateString() === today.toDateString();
          break;
        case 'TOMORROW':
          dateMatch = bookingDate.toDateString() === tomorrow.toDateString();
          break;
        case 'THIS_WEEK':
          dateMatch = bookingDate >= thisWeekStart && bookingDate < nextWeekStart;
          break;
        case 'NEXT_WEEK':
          const nextWeekEnd = new Date(nextWeekStart);
          nextWeekEnd.setDate(nextWeekStart.getDate() + 7);
          dateMatch = bookingDate >= nextWeekStart && bookingDate < nextWeekEnd;
          break;
        case 'THIS_MONTH':
          const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          dateMatch = bookingDate >= thisMonthStart && bookingDate <= thisMonthEnd;
          break;
        default:
          if (filters.from_date || filters.to_date) {
            const fromDate = filters.from_date ? new Date(filters.from_date) : null;
            const toDate = filters.to_date ? new Date(filters.to_date) : null;

            if (fromDate && toDate) {
              dateMatch = bookingDate >= fromDate && bookingDate <= toDate;
            } else if (fromDate) {
              dateMatch = bookingDate >= fromDate;
            } else if (toDate) {
              dateMatch = bookingDate <= toDate;
            }
          }
      }

      return searchMatch && statusMatch && paymentMatch && typeMatch && modeMatch && dateMatch;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sort_by) {
        case 'date_desc':
          return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
        case 'date_asc':
          return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        case 'status_asc':
          return a.booking_status.localeCompare(b.booking_status);
        case 'status_desc':
          return b.booking_status.localeCompare(a.booking_status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [bookings, searchTerm, filters]);

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalItems = filteredBookings.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return {
      totalItems,
      totalPages,
      paginatedBookings,
      startIndex: (currentPage - 1) * itemsPerPage + 1,
      endIndex: Math.min(currentPage * itemsPerPage, totalItems)
    };
  }, [filteredBookings, currentPage, itemsPerPage]);

  // Memoize statistics calculations
  const stats = useMemo(() => {
    const total = filteredBookings.length;
    const pending = filteredBookings.filter(b => b.booking_status === 'PENDING').length;
    const confirmed = filteredBookings.filter(b => b.booking_status === 'CONFIRMED').length;
    const completed = filteredBookings.filter(b => b.booking_status === 'COMPLETED').length;
    const canceled = filteredBookings.filter(b => b.booking_status === 'CANCELED').length;

    return { total, pending, confirmed, completed, canceled };
  }, [filteredBookings]);

  // Update the status configs with proper typing
  const statusConfigs = useMemo(() => ({
    booking: {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'CONFIRMED': { color: 'bg-blue-100 text-blue-800', icon: '✅' },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'CANCELED': { color: 'bg-red-100 text-red-800', icon: '❌' }
    } as StatusConfigs,
    payment: {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'FAILED': { color: 'bg-red-100 text-red-800', icon: '❌' },
      'REFUNDED': { color: 'bg-orange-100 text-orange-800', icon: '↩️' }
    } as StatusConfigs
  }), []);

  // Update the utility functions with proper typing
  const getStatusConfig = useCallback((status: string): StatusConfig => {
    return statusConfigs.booking[status] || { color: 'bg-gray-100 text-gray-800', icon: '❓' };
  }, [statusConfigs]);

  const getPaymentStatusConfig = useCallback((status: string): StatusConfig => {
    return statusConfigs.payment[status] || { color: 'bg-gray-100 text-gray-800', icon: '❓' };
  }, [statusConfigs]);

  const formatDateTime = useCallback((startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const date = start.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    const time = `${start.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })} - ${end.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
    
    return { date, time };
  }, []);

  // Event handlers
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const clearFilters = () => {
    setFilters({
      booking_status: 'ALL',
      payment_status: 'ALL',
      booking_type: 'ALL',
      from_date: '',
      to_date: '',
      payment_mode: 'ALL',
      sort_by: 'date_desc',
      quick_date: 'ALL'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const exportFilteredBookings = () => {
    const exportData = filteredBookings.map(booking => ({
      uuid: booking.uuid,
      start_time: booking.start_time,
      end_time: booking.end_time,
      booking_status: booking.booking_status,
      booking_type: booking.booking_type,
      payment_status: booking.payment_status,
      payment_mode: booking.payment_mode,
      booking_charge: booking.booking_charge.toString(),
      created_by: booking.created_by
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `expert-bookings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Bookings exported successfully!');
  };

  const handleView = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('view');
  }, []);

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditData(booking);
    setModalType('edit');
  };

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('delete');
  };

  const handleComplete = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('complete');
  }, []);

  const handleCancel = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('cancel');
  }, []);

  // Add new handler for video call
  const handleVideoCall = useCallback((booking: Booking) => {
    // If we have a room ID, use the new video call structure
    if (booking.room_id) {
      window.open(`/expert/videocall/${booking.room_id}`, '_blank');
    } else if (booking.expert_meeting_link) {
      // If we have a direct meeting link, use the portal
      const params = new URLSearchParams({
        roomId: booking.room_id || '',
        userName: 'Expert',
        bookingId: booking.uuid,
        userType: 'expert',
        videoCallUrl: booking.expert_meeting_link
      });
      
      window.open(`/expert/videocall/portal?${params.toString()}`, '_blank');
    } else {
      // Fallback to portal with default values
      const params = new URLSearchParams({
        roomId: 'default',
        userName: 'Expert',
        bookingId: booking.uuid,
        userType: 'expert'
      });
      
      window.open(`/expert/videocall/portal?${params.toString()}`, '_blank');
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalType('');
    setSelectedBooking(null);
    setEditData({});
  }, []);

  const handleCancelConfirm = () => {
    if (!selectedBooking) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBookings(prev => prev.map(b => 
        b.uuid === selectedBooking.uuid 
          ? { ...b, booking_status: 'CANCELED' }
          : b
      ));
      setIsLoading(false);
      closeModal();
      showNotification('Booking canceled successfully!');
    }, 1000);
  };

  // Add function to fetch slots
  const fetchSlots = async () => {
    setIsLoadingSlots(true);
    try {
      // Simulate API call
      const response: SlotResponse = {
        status: 200,
        message: "Expert slot's found",
        data: {
          current_page: 1,
          total_pages: 1,
          total_items: 6,
          next: null,
          previous: null,
          data: [
            {
              uuid: "3b125d50-309e-4870-a8fd-29c121ac1d43",
              expert: "7a6143b6-fca5-477f-82e0-ec11aa223b13",
              created_by: "expert2@gmail.com",
              start_time: "2025-05-24T21:00:00Z",
              end_time: "2025-05-24T21:15:00Z",
              status: "DRAFT",
              is_booked: false,
              reason_for_rejection: null
            },
            // ... other slots from your data
          ]
        }
      };
      setSlots(response.data.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      showNotification('Failed to fetch slots', 'error');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Add a utility function to format the booking ID
  const formatBookingId = (uuid: string) => {
    // Take first 6 characters and last 4 characters
    return `${uuid.slice(0, 6)}...${uuid.slice(-4)}`;
  };

  // Update the chatMessages state with proper typing
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Update the newMessage state with proper typing
  const [newMessage, setNewMessage] = useState('');

  // Update the showChat state with proper typing
  const [showChat, setShowChat] = useState(false);

  // Update the isCallActive state with proper typing
  const [isCallActive, setIsCallActive] = useState(false);

  // Event handler for sending a message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Simulate sending a message
    const message: ChatMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'expert',
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out ${
          notification?.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
          notification?.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-amber-50 text-amber-800 border border-amber-200'
        }`}>
          <div className="flex items-center space-x-2">
            {notification?.type === 'success' ? <CheckCircle size={20} className="text-emerald-600" /> :
             notification?.type === 'error' ? <XCircle size={20} className="text-red-600" /> :
             <AlertCircle size={20} className="text-amber-600" />}
            <span className="font-medium">{notification?.message}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 sm:py-10">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Expert Bookings</h1>
            <p className="text-base sm:text-lg text-gray-600">Manage and track all expert bookings with advanced filtering</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <RefreshCw size={18} className="animate-spin-slow" />
              <span className="text-sm sm:text-base font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.confirmed}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Canceled</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.canceled}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col space-y-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by booking ID, customer, expert, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition-all duration-200 ${
                  showFilters ? 'bg-blue-100 text-blue-700 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter size={18} />
                <span className="text-base font-medium">Advanced Filters</span>
              </button>
              
              {(Object.values(filters).some(f => f !== 'ALL' && f !== '') || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-5 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-base font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Quick Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Date Filter</label>
                  <select
                    value={filters.quick_date}
                    onChange={(e) => setFilters({...filters, quick_date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  >
                    {quickDateOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sort_by}
                    onChange={(e) => setFilters({...filters, sort_by: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Existing filters with improved styling */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                  <select
                    value={filters.booking_status}
                    onChange={(e) => setFilters({...filters, booking_status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  >
                    <option value="ALL">All Status</option>
                    {bookingStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={filters.payment_status}
                    onChange={(e) => setFilters({...filters, payment_status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  >
                    <option value="ALL">All Payments</option>
                    {paymentStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.from_date}
                    onChange={(e) => setFilters({...filters, from_date: e.target.value, quick_date: 'ALL'})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={filters.to_date}
                    onChange={(e) => setFilters({...filters, to_date: e.target.value, quick_date: 'ALL'})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{paginationData.startIndex}</span> to <span className="font-medium text-gray-900">{paginationData.endIndex}</span> of <span className="font-medium text-gray-900">{paginationData.totalItems}</span> bookings
              {(Object.values(filters).some(f => f !== 'ALL' && f !== '') || searchTerm) && (
                <span className="ml-2 text-blue-600">
                  (filtered)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Page {currentPage} of {paginationData.totalPages}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages))}
                  disabled={currentPage === paginationData.totalPages}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table (Desktop) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table: hidden on mobile */}
          <div className="overflow-x-auto w-full hidden sm:block">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginationData.paginatedBookings.map((booking, index) => {
                  const { date, time } = formatDateTime(booking.start_time, booking.end_time);
                  const statusConfig = getStatusConfig(booking.booking_status);
                  return (
                    <tr key={booking.uuid} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {paginationData.startIndex + index} 
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{date}</div>
                        <div className="text-sm text-gray-500">{time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.icon} {booking.booking_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleView(booking)}
                            className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            title="View Booking Details"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </button>
                          {booking.booking_status === 'PENDING' && (
                            <button
                              onClick={() => handleComplete(booking)}
                              className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200"
                              title="Mark Booking as Complete"
                            >
                              <CheckCircle size={16} />
                              <span>Complete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card/List View: only on mobile */}
          <div className="sm:hidden p-2 space-y-4">
            {paginationData.paginatedBookings.map((booking, index) => {
              const { date, time } = formatDateTime(booking.start_time, booking.end_time);
              const statusConfig = getStatusConfig(booking.booking_status);
              return (
                <div key={booking.uuid} className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">#{paginationData.startIndex + index}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>{statusConfig.icon} {booking.booking_status}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{date}</div>
                    <div className="text-xs text-gray-500">{time}</div>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleView(booking)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 text-xs"
                      title="View Booking Details"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                    {booking.booking_status === 'PENDING' && (
                      <button
                        onClick={() => handleComplete(booking)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 text-xs"
                        title="Mark Booking as Complete"
                      >
                        <CheckCircle size={14} />
                        <span>Complete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalType === 'view'}
        onClose={closeModal}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Booking Number</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking?.uuid}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDateTime(selectedBooking?.start_time || '', selectedBooking?.end_time || '').date}
                  <br />
                  {formatDateTime(selectedBooking?.start_time || '', selectedBooking?.end_time || '').time}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking?.booking_status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking?.payment_status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Payment Mode</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking?.payment_mode}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'edit'}
        onClose={closeModal}
        title="Edit Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Booking Status</label>
              <select
                value={editData.booking_status || selectedBooking.booking_status}
                onChange={(e) => setEditData({...editData, booking_status: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {bookingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <select
                value={editData.payment_status || selectedBooking.payment_status}
                onChange={(e) => setEditData({...editData, payment_status: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {paymentStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setBookings(prev => prev.map(b => 
                      b.uuid === selectedBooking.uuid ? { ...b, ...editData } : b
                    ));
                    setIsLoading(false);
                    closeModal();
                    showNotification('Booking updated successfully!');
                  }, 1000);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'delete'}
        onClose={closeModal}
        title="Delete Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setBookings(prev => prev.filter(b => b.uuid !== selectedBooking.uuid));
                    setIsLoading(false);
                    closeModal();
                    showNotification('Booking deleted successfully!');
                  }, 1000);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'complete'}
        onClose={closeModal}
        title="Complete Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to mark this booking as complete?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setBookings(prev => prev.map(b => 
                      b.uuid === selectedBooking.uuid ? { ...b, booking_status: 'COMPLETED' } : b
                    ));
                    setIsLoading(false);
                    closeModal();
                    showNotification('Booking marked as completed!');
                  }, 1000);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? 'Completing...' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'cancel'}
        onClose={closeModal}
        title="Cancel Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Canceling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Chat Panel */}
      {showChat && isCallActive && (
        <div className="fixed right-4 top-4 bottom-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.length === 0 ? (
              <p className="text-gray-500 text-center text-sm">No messages yet</p>
            ) : (
              chatMessages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">{message.sender}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
                    {message.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add chat input form */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExpertBookingManager;