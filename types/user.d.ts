 export interface User {
  uuid: string;
  email: string;
  full_name: string;
  phone_number: string;
  country_code: string;
  role: 'CUSTOMER' | 'EXPERT' | 'CLINIC_ADMIN' | 'SUPER_ADMIN';
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_blocked: boolean;
  last_login: string | null;
  created_by: string | null;
  created_at: string;
  profile_image: string;
}
 export interface Booking  {
  uuid: string;
  created_by: string;
  booking_type: 'VIDEO_CALL' | 'PHYSICAL_VISIT';
  booking_status: 'PENDING' | 'SCHEDULED' | 'COMPLETED';
  start_time: string;
  end_time: string;
  payment_status: 'PENDING' | 'COMPLETED';
  session_type: string;
  patient_name: string;
  patient_mobile: string;
  patient_email: string;
  booking_charge: string;
  clinic_name: string;
  clinic_id: string;
  service_type: string;
};


interface NotificationProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: () => void;
}
