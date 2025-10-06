export interface ClinicData {
  uuid?: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  about: string;
  insuranceNetworks: string[];
  specialties: string[];
  location: {
    lat: number;
    lng: number;
  };
  landmark?: string;
  gstNo?: string;
  foundedOn?: string | null;
  images?: string[];
  status?: string;
}

export interface OperatingHour {
  open: string;
  close: string;
  closed: boolean;
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
  pincode: string;
  about_clinic: string;
  coordinates?: string;
  uuid?: string;
  images?: string[];
  status?: string;
  gst_no?: string;
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