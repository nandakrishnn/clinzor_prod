export interface DuesSummary {
  total_dues: number;
  total_paid: number;
  remaining_dues: number;
}

export interface PaymentOrder {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: any[];
  offer_id: string | null;
  receipt: string | null;
  status: string;
}

export interface Transaction {
  uuid: string;
  clinic_id: string;
  clinic_name: string;
  amount?: any;
  status: string;
  created_at: string;
  updated_at: string;
  payment_order?: PaymentOrder;
  description: string;
  transaction_type: 'PAYMENT' | 'DUE' | 'REFUND' | 'PAID';
  service_name?: string;
  patient_name?: string;
  created_by?: string | null;
  discount_amount?: string;
  final_amount?: string;
  booking?: string;
  clinic?: string;
  clinic_service_name?: string;
}

export interface Clinic {
  id: string;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  current_dues: number;
  contact_number: string;
  total_paid: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface Booking {
  id: string;
  clinic_id: string;
  clinic_name: string;
  patient_name: string;
  date: string;
  amount_due: number;
  total_cost: number;
  service_details: string;
  mode_of_consultation: 'Online' | 'In-Clinic';
  status: 'NEW' | 'COMPLETED' | 'CANCELLED';
  is_past_due?: boolean;
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

export interface StatusConfig {
  color: string;
  dot: string;
  icon: React.ComponentType<any>;
}

export interface FiltersState {
  searchTerm: string;
  statusFilter: string;
  dateRange: {
    fromDate: string;
    toDate: string;
  };
  transactionType: string;
}