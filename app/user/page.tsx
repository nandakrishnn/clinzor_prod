"use client"

import Navbar from "@/components/shared/NavBar"
import ChangePassword from "@/components/user/ChangePassword"
import MyBookings from "@/components/user/MyBookings"
import NavigationItem from "@/components/user/NavigationItem"
import ProfileDetails from "@/components/user/ProfileDetails"
import UserProfile from "@/components/user/UserProfile"
import type { User, Booking, NavigationItem as NavItemType } from "@/types/user"
import { useState } from "react"
import { UserIcon, Calendar, Lock, LogOut } from "lucide-react"

export default function UserDash() {
  const [activeSection, setActiveSection] = useState<string>("profile")

  // Sample user data
  const user: User = {
    id: "1",
    name: "Anshuman Singh",
    title: "RusTech Land, Facebook Messenger",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    email: "anshuman@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Software engineer with expertise in distributed systems and real-time messaging platforms. Currently working on scalable solutions at RusTech Land.",
  }

  // Sample bookings data
  const bookings: Booking[] = [
    {
      id: 1,
      title: "Master Kafka & ZooKeeper — Live Masterclass!",
      date: "Aug 25, 2025",
      time: "7:30 - 10:30 PM",
      location: "Online",
      status: "Confirmed",
      customer: {
        name: "Anshuman Singh",
        phone: "+1 (555) 123-4567",
        email: "anshuman@example.com",
      },
      payment: {
        amount: 150.0,
        currency: "$",
      },
      notes: "Please join the session 15 minutes early. All materials will be provided digitally.",
    },
    {
      id: 2,
      title: "AI Engineering Program Orientation",
      date: "Sep 1, 2025",
      time: "6:00 - 8:00 PM",
      location: "IIT Roorkee Campus",
      status: "Pending",
      customer: {
        name: "Anshuman Singh",
        phone: "+1 (555) 123-4567",
        email: "anshuman@example.com",
      },
      payment: {
        amount: 0.0,
        currency: "$",
      },
      notes: "Bring a valid ID and laptop. Parking is available on campus.",
    },
    {
      id: 3,
      title: "Scaler Interview Preparation Workshop",
      date: "Sep 5, 2025",
      time: "5:00 - 7:00 PM",
      location: "Online",
      status: "Confirmed",
      customer: {
        name: "Anshuman Singh",
        phone: "+1 (555) 123-4567",
        email: "anshuman@example.com",
      },
      payment: {
        amount: 75.0,
        currency: "$",
      },
      notes: "Mock interviews will be conducted. Resume review included in the session.",
    },
    {
      id: 4,
      title: "React Advanced Patterns Workshop",
      date: "Jul 20, 2025",
      time: "2:00 - 5:00 PM",
      location: "Online",
      status: "Confirmed",
      customer: {
        name: "Anshuman Singh",
        phone: "+1 (555) 123-4567",
        email: "anshuman@example.com",
      },
      payment: {
        amount: 120.0,
        currency: "$",
      },
      notes: "Workshop completed successfully. Certificate has been issued.",
    },
  ]

  const navItems: NavItemType[] = [
    { id: "profile", label: "Profile Details", icon: "profile" },
    { id: "bookings", label: "My Bookings", icon: "bookings", badge: 3 },
    { id: "password", label: "Change Password", icon: "password" },
    { id: "logout", label: "Logout", icon: "logout" },
  ]

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "profile":
        return <UserIcon size={18} />
      case "bookings":
        return <Calendar size={18} />
      case "password":
        return <Lock size={18} />
      case "logout":
        return <LogOut size={18} />
      default:
        return <UserIcon size={18} />
    }
  }

  const handleNavigationClick = (itemId: string) => {
    if (itemId === "logout") {
      // Handle logout logic
      console.log("Logging out...")
      return
    }
    setActiveSection(itemId)
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileDetails user={user} />
      case "bookings":
        return <MyBookings bookings={bookings} />
      case "password":
        return <ChangePassword />
      default:
        return <ProfileDetails user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-sm border border-border p-6 sticky top-24">
                <UserProfile
                  user={user}
                  isActive={activeSection === "profile"}
                  onClick={() => setActiveSection("profile")}
                />

                <nav className="mt-8">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                    Account
                  </div>
                  <ul className="space-y-1">
                    {navItems.map((item) => (
                      <li key={item.id}>
                        <NavigationItem
                          icon={getIcon(item.icon)}
                          label={item.label}
                          isActive={activeSection === item.id}
                          onClick={() => handleNavigationClick(item.id)}
                          showBadge={item.badge !== undefined}
                          badge={item.badge}
                        />
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            <div className="lg:col-span-3">{renderActiveSection()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
