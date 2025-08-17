
export interface CommonHeroSectionProps {
    title?: string;
    subTitle?: string;
    className?: string;
}

export interface Clinic {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  address: string;
  distance: string;
  price: string;
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