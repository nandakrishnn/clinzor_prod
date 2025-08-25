import type React from "react"
export interface User {
  id: string
  name: string
  title: string
  profileImage: string
  email: string
  phone: string
  location: string
  bio: string
}

export interface Booking {
  id: number
  title: string
  date: string
  time: string
  location: string
  status: "Confirmed" | "Pending" | "Cancelled"
  customer: {
    name: string
    phone: string
    email: string
  }
  payment: {
    amount: number
    currency: string
  }
  notes?: string
}

export interface NavigationItem {
  id: string
  label: string
  icon: string
  badge?: number
}

export interface UserProfileProps {
  user: User
  isActive: boolean
  onClick: () => void
}

export interface ProfileDetailsProps {
  user: User
}

export interface MyBookingsProps {
  bookings: Booking[]
}

export interface NavigationItemProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
  showBadge?: boolean
  badge?: number
}
