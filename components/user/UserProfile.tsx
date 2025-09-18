"use client";

import { UserIcon } from "lucide-react";
import { FaMale, FaFemale } from "react-icons/fa";

export default function UserProfile({
  user,
  isActive,
  onClick
}: any) {
  // const hasProfileImage = user?.profile_url && user.profile_url.trim() !== "";

  const renderAvatar = () => {
    // if (hasProfileImage) {
    //   return (
    //     <img
    //       src={user?.profile_url}
    //       alt={user?.full_name}
    //       className="w-12 h-12 rounded-full object-cover ring-2 ring-sidebar-border"
    //     />
    //   );
    // }

    // Gender-based fallback
    if (user?.gender?.toLowerCase() === "female") {
      return (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 ring-2 ring-sidebar-border border-primaryColor">
          <FaFemale className="text-pink-600 text-xl" />
        </div>
      );
    }

    if (user?.gender?.toLowerCase() === "male") {
      return (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 ring-2 ring-sidebar-border border-primaryColor">
          <FaMale className="text-primaryColor text-3xl" />
        </div>
      );
    }

    // Default if no gender provided
    return (
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 ring-2 ring-sidebar-border border-primaryColor">
        <UserIcon className="text-gray-600" />
      </div>
    );
  };

  return (
    <div
      className={`flex items-center p-4 cursor-pointer rounded-lg transition-all duration-200 bg-sidebar-primary border border-sidebar-border shadow-sm`}
      onClick={onClick}
    >
      <div className="relative">{renderAvatar()}</div>
      <div className="ml-3 flex-1 min-w-0">
        <h3 className="font-semibold text-sidebar-foreground truncate">
          {user?.full_name}
        </h3>
        <p className="text-sm text-muted-foreground truncate">{user?.role}</p>
      </div>
    </div>
  );
}
