// src/types/user.ts
export interface User {
  id: string;
  name: string;
  title: string;
  profileImage: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
}

export interface Booking {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

export interface UserProfileProps {
  user: User;
  isActive: boolean;
  onClick: () => void;
}

export interface NavigationItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  showBadge?: boolean;
}

export interface ProfileDetailsProps {
  user: User;
}

export interface MyBookingsProps {
  bookings: Booking[];
}