
export interface ClinicData {
  // Basic Information
  uuid?: string;
  name: string;
  email: string;
  phone: string;
  contact_number: string;
  country_code: string;

  // Location Information
  address: string;
  city: string;
  pincode: number;
  landmark?: string;
  map_link: string;
  coordinates: string;
  location: { lat: number; lng: number };

  // Clinic Details
  about: string;
  about_clinic: string;
  gstNo?: string;
  gst_no: string;
  founded_on?: string | null;
  status?: string;
  is_active: boolean;

  // Additional
  languages: string[] ;
  images?: any;

  // Certificates
  registration_certificate: string | null;
  reason_for_rejection: string | null;
}
export interface OperatingHour {
  open: string;
  close: string;
  closed: boolean;
  uuid: undefined | string
}

export interface OperatingHours {
  monday: OperatingHour;
  tuesday: OperatingHour;
  wednesday: OperatingHour;
  thursday: OperatingHour;
  friday: OperatingHour;
  saturday: OperatingHour;
  sunday: OperatingHour;
}

export interface BackendClinic {
  name: string;
  email: string;
  contact_number: string;
  address: string;
  city: string;
  pincode: number; // Change from string to number
  about_clinic: string;
  coordinates?: string;
  uuid?: string;
  images?: string[];
  status?: string;
  gst_no?: string;
  country_code?: string;
  map_link?: string;
  landmark?: string;
  is_active?: boolean;
  registration_certificate?: string;
  reason_for_rejection?: string;
  languages?: string[];
  founded_on?: string | null;
}

export interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  postcode?: string;
}

export interface NominatimResult {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
}

export interface NominatimReverseResult {
  display_name?: string;
  address?: NominatimAddress;
}

export interface TimingItem {
  day: string;
  opening_time: string;
  closing_time: string;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';