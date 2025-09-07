
export interface CommonHeroSectionProps {
    title?: string;
    subTitle?: string;
    className?: string;
}

export interface Clinic {
  id: number;
  name: string;
  clinic_name?: string;
  clinic_uuid?: string;
  rating: number;
  avg_rating?: number;
  reviews: number;
  total_reviews?: number;
  address: string;
  distance: string;
  price: string;
  min_price?: string;
  image: string;
  description: string;
  services: string[];
  doctors: string[];
  femaleDoctors: boolean;
}

export const clinicData: Clinic[] = [
  {
    id: 1,
    name: "SkinCare Specialists",
    rating: 4.9,
    reviews: 124,
    address: "123 Health Street, Bangalore",
    distance: "1.2 km away",
    price: "₹ 800",
    image: "/admin.jpg",
    description: "Specialized in acne treatment and cosmetic dermatology.",
    services: ["Acne Treatment", "Skin Cancer Screening"],
    doctors: ["Dr. Smith (Dermatologist)"],
    femaleDoctors: true
  },
  {
    id: 3,
    name: "SkinCare Specialists",
    rating: 4.9,
    reviews: 124,
    address: "123 Health Street, Bangalore",
    distance: "1.2 km away",
    price: "₹ 800",
    image: "/admin.jpg",
    description: "Specialized in acne treatment and cosmetic dermatology.",
    services: ["Acne Treatment", "Skin Cancer Screening"],
    doctors: ["Dr. Smith (Dermatologist)"],
    femaleDoctors: true
  },
  {
    id: 2,
    name: "SkinCare Specialists",
    rating: 4.9,
    reviews: 124,
    address: "123 Health Street, Bangalore",
    distance: "1.2 km away",
    price: "₹ 800",
    image: "/admin.jpg",
    description: "Specialized in acne treatment and cosmetic dermatology.",
    services: ["Acne Treatment", "Skin Cancer Screening"],
    doctors: ["Dr. Smith (Dermatologist)"],
    femaleDoctors: true
  },
  {
    id: 4,
    name: "SkinCare Specialists",
    rating: 4.9,
    reviews: 124,
    address: "123 Health Street, Bangalore",
    distance: "1.2 km away",
    price: "₹ 800",
    image: "/admin.jpg",
    description: "Specialized in acne treatment and cosmetic dermatology.",
    services: ["Acne Treatment", "Skin Cancer Screening"],
    doctors: ["Dr. Smith (Dermatologist)"],
    femaleDoctors: true
  },
  {
    id: 5,
    name: "SkinCare Specialists",
    rating: 4.9,
    reviews: 124,
    address: "123 Health Street, Bangalore",
    distance: "1.2 km away",
    price: "₹ 800",
    image: "/admin.jpg",
    description: "Specialized in acne treatment and cosmetic dermatology.",
    services: ["Acne Treatment", "Skin Cancer Screening"],
    doctors: ["Dr. Smith (Dermatologist)"],
    femaleDoctors: true
  },
  {
    id: 6,
    name: "SkinCare Specialists",
    rating: 4.9,
    reviews: 124,
    address: "123 Health Street, Bangalore",
    distance: "1.2 km away",
    price: "₹ 800",
    image: "/admin.jpg",
    description: "Specialized in acne treatment and cosmetic dermatology.",
    services: ["Acne Treatment", "Skin Cancer Screening"],
    doctors: ["Dr. Smith (Dermatologist)"],
    femaleDoctors: true
  },
];

export interface Slot {
  uuid: string;
  clinic: string;
  clinic_service: string;
  slot_type: string;
  start_time: string;
  end_time: string;
  created_by: string;
  max_bookings: number;
  available_slots: number;
  status: string;
  reason_for_rejection: string | null;
  is_video_call: boolean;
  is_home_visit: boolean;
  is_physical_visit: boolean;
  female_doctor_count: number;
  clinic_name: string;
}

export interface FilterState {
  fromDate: Date | null;
  toDate: Date | null;
  status: string;
  clinicService: string;
  timeRange: string;
  capacity: string;
  availability: string;
}

export interface ClinicService {
  id: string;
  name: string;
}