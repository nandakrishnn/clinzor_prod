// src/pages/UserDash.tsx
"use client";

import Navbar from "@/components/shared/NavBar";
import ChangePassword from "@/components/user/ChangePassword";
import MyBookings from "@/components/user/MyBookings";
import NavigationItem from "@/components/user/NavigationItem";
import ProfileDetails from "@/components/user/ProfileDetails";
import UserProfile from "@/components/user/UserProfile";
import { User, Booking, NavigationItem as NavItemType } from "@/types/user";
import { useState } from "react";

export default function UserDash() {
  const [activeSection, setActiveSection] = useState<string>("profile");

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
    bio: "Software engineer with expertise in distributed systems and real-time messaging platforms. Currently working on scalable solutions at RusTech Land."
  };

  // Sample bookings data
  const bookings: Booking[] = [
    {
      id: 1,
      title: "Master Kafka & ZooKeeper — Live Masterclass!",
      date: "Aug 25, 2025",
      time: "7:30 - 10:30 PM",
      location: "Online",
      status: "Confirmed"
    },
    {
      id: 2,
      title: "AI Engineering Program Orientation",
      date: "Sep 1, 2025",
      time: "6:00 - 8:00 PM",
      location: "IIT Roorkee Campus",
      status: "Pending"
    },
    {
      id: 3,
      title: "Scaler Interview Preparation Workshop",
      date: "Sep 5, 2025",
      time: "5:00 - 7:00 PM",
      location: "Online",
      status: "Confirmed"
    }
  ];

  // Navigation items
  const navItems: NavItemType[] = [
    { id: "profile", label: "Profile Details", icon: "👤" },
    { id: "bookings", label: "My Bookings", icon: "📅", badge: 3 },
    { id: "password", label: "Change Password", icon: "🔒" },
    { id: "logout", label: "Logout", icon: "🚪" }
  ];

  const handleNavigationClick = (itemId: string) => {
    if (itemId === "logout") {
      // Handle logout logic
      console.log("Logging out...");
      return;
    }
    setActiveSection(itemId);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileDetails user={user} />;
      case "bookings":
        return <MyBookings bookings={bookings} />;
      case "password":
        return <ChangePassword />;
      default:
        return <ProfileDetails user={user} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-5 mt-24 justify-center overflow-hidden">
        {/* Left Sidebar - Sticky */}
        <div className="w-full md:min-w-[30%] bg-white shadow-sm border-r border-gray-200 p-6 md:sticky md:top-0 h-fit overflow-y-auto rounded-lg">
          <UserProfile
            user={user}
            isActive={activeSection === "profile"}
            onClick={() => setActiveSection("profile")}
          />

          <nav className="mt-8">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Account
            </div>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <NavigationItem
                    icon={item.icon}
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => handleNavigationClick(item.id)}
                    showBadge={item.badge !== undefined}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="min-w-full">{renderActiveSection()}</div>
      </div>
    </div>
  );
}
