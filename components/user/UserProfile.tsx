"use client";

import type { UserProfileProps } from "@/types/user";

export default function UserProfile({
  user,
  isActive,
  onClick
}: UserProfileProps) {
  return (
    <div
      className={`flex items-center p-4 cursor-pointer rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-sidebar-primary border border-sidebar-border shadow-sm"
          : "hover:bg-sidebar-accent/10 hover:shadow-sm"
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={user.profileImage || "/placeholder.svg"}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-sidebar-border"
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background"></div>
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <h3 className="font-semibold text-sidebar-foreground truncate">
          {user.name}
        </h3>
        <p className="text-sm text-muted-foreground truncate">{user.title}</p>
      </div>
    </div>
  );
}
