// lib/clinics.ts

export interface Clinic {
    id: string;
    name: string;
    imageUrl: string;
    rating: number;
    location: string;
    specialty: string;
    distance: string;    // in miles, as string
    openHours: string;
    isOpen: boolean;
    phone?: string; 
  }
  
  export const MOCK_CLINICS: Clinic[] = [
    {
      id: "1",
      name: "GreenLife Medical Center",
      imageUrl: "/image.jpg",
      rating: 4.8,
      location: "Downtown, 2.1 miles away",
      specialty: "General Practice",
      distance: "2.1",
      openHours: "8:00 AM - 7:00 PM",
      isOpen: true,
      phone: "123-456-7890",
    },
    {
      id: "2",
      name: "Advanced Dental Care",
      imageUrl: "/image.jpg",
      rating: 4.6,
      location: "West End, 3.5 miles away",
      specialty: "Dentistry",
      distance: "3.5",
      openHours: "9:00 AM - 5:00 PM",
      isOpen: true,
      phone: "987-654-3210",
    },
    {
      id: "3",
      name: "Central Pediatrics",
      imageUrl: "/image.jpg",
      rating: 4.9,
      location: "Northside, 1.8 miles away",
      specialty: "Pediatrics",
      distance: "1.8",
      openHours: "8:30 AM - 6:00 PM",
      isOpen: false,
    phone: "555-123-4567",
    },
    {
      id: "4",
      name: "City Heart Specialists",
      imageUrl: "/image.jpg",
      rating: 4.7,
      location: "Eastside, 4.2 miles away",
      specialty: "Cardiology",
      distance: "4.2",
      openHours: "7:30 AM - 6:30 PM",
      isOpen: true,
        phone: "444-555-6666",
    },
    {
      id: "5",
      name: "Family Health Partners",
      imageUrl: "/image.jpg",
      rating: 4.5,
      location: "Southend, 2.7 miles away",
      specialty: "Family Medicine",
      distance: "2.7",
      openHours: "8:00 AM - 8:00 PM",
      isOpen: true,
      phone: "333-222-1111",
    },
  ];
  