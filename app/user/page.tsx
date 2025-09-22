"use client"

import MyBookings from "@/components/user/MyBookings"
import NavigationItem from "@/components/user/NavigationItem"
import ProfileDetails from "@/components/user/ProfileDetails"
import UserProfile from "@/components/user/UserProfile"
import CommonHeroSection from "@/components/common/CommonHeroSection"
import type { NavigationItem as NavItemType } from "@/types/user"
import { useEffect, useState, Suspense } from "react"
import { UserIcon, Calendar, Lock, LogOut } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { getUserService } from "@/service/user/sevicePage"
import { NavbarDemo } from "@/components/landingpage/navbar/navbar"
import { logOutService } from "@/service/user/profileService"
import { BookingsSkeleton, ProfileDetailsSkeleton, UserProfileSkeleton } from "@/components/skeltons/user/LoadingSkeleton"
import { useSearchParams } from "next/navigation"
import MyExpertBooking from "@/components/user/MyExpertBooking"

// Inner component that uses useSearchParams
function UserDashContent() {
  const { data } = useSession()
  const [user, setUser] = useState(data?.user || {});
  const [isLoading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<string>("profile")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const searchParams = useSearchParams()
  const tabData = searchParams.get('tab')

  const getUser = async () => {
    try {
      const res = await getUserService();
      if (res.status === 200) {
        setUser(res.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUser()
    const hash = window.location.hash.replace("#", "")
    if (hash) {
      setActiveSection(hash)
    }
  }, [])

  const navItems: NavItemType[] = [
    { id: "profile", label: "Profile Details", icon: "profile" },
    { id: "bookings", label: "My Bookings", icon: "bookings" },
    { id: "expert_bookings", label: "Expert Bookings", icon: "bookings" },
    { id: "logout", label: "Logout", icon: "logout" },
  ]

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "profile":
        return <UserIcon size={18} />
      case "bookings":
        return <Calendar size={18} />
      case "logout":
        return <LogOut size={18} />
      default:
        return <UserIcon size={18} />
    }
  }

  const logOut = async () => {
    try {
      const res = await logOutService(data?.refreshToken)
      if (res.status === 200) {
        signOut({ callbackUrl: "/auth" });
      }
    } catch (error) {
      console.error(error)
    } finally {
      setShowLogoutConfirm(false)
    }
  }

  const handleNavigationClick = (itemId: string) => {
    if (itemId === "logout") {
      setShowLogoutConfirm(true)
      return
    }
    setActiveSection(itemId)
  }

  const renderActiveSection = () => {
    if (isLoading) {
      switch (activeSection) {
        case "profile":
          return <ProfileDetailsSkeleton />
        case "bookings":
          return <BookingsSkeleton />
        case "expert_bookings":
          return <BookingsSkeleton />
        default:
          return <ProfileDetailsSkeleton />
      }
    }

    switch (activeSection) {
      case "profile":
        return <ProfileDetails user={user} onUpdate={getUser} />
      case "bookings":
        return <MyBookings />
      case "expert_bookings":
        return <MyExpertBooking defaultTab={tabData === "SUGGESTIONS" ? "SUGGESTIONS" : "SCHEDULED"} />
      default:
        return <ProfileDetails user={user} onUpdate={getUser} />
    }
  }

  useEffect(() => {
    if (tabData === "SUGGESTIONS") {
      setActiveSection('expert_bookings')
    }
  }, [tabData])

  return (
    <div className="min-h-screen bg-background">
      <nav>
        <NavbarDemo />
      </nav>

      <section className="pb-5">
        <CommonHeroSection className="h-[15vh]" />
      </section>

      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-sm border border-border p-6 sticky top-24">
                {isLoading ? (
                  <UserProfileSkeleton />
                ) : (
                  <UserProfile
                    user={user}
                    isActive={activeSection === "profile"}
                    onClick={() => setActiveSection("profile")}
                  />
                )}

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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-foreground border border-border rounded-lg hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={logOut}
                className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-destructive/90"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main component with Suspense boundary
export default function UserDash() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading user dashboard...</div>
      </div>
    }>
      <UserDashContent />
    </Suspense>
  )
}