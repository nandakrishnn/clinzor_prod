"use client"

import type { NavigationItemProps } from "@/types/user"

export default function NavigationItem({
  icon,
  label,
  isActive,
  onClick,
  showBadge = false,
  badge,
}: NavigationItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-primaryColor text-sidebar-accent-foreground shadow-sm text-white"
          : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
      }`}
    >
      <span
        className={`mr-3 transition-colors ${isActive ? "text-sidebar-accent-foreground" : "text-muted-foreground group-hover:text-sidebar-primary-foreground"}`}
      >
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {showBadge && badge && (
        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground rounded-full">
          {badge}
        </span>
      )}
    </button>
  )
}
