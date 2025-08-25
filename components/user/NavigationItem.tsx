// src/components/user/NavigationItem.tsx
import { NavigationItemProps } from "@/types/user";

export default function NavigationItem({
  icon,
  label,
  isActive,
  onClick,
  showBadge
}: NavigationItemProps) {
  return (
    <div
      className={`flex items-center p-3 cursor-pointer rounded-lg min-w-full ${
        isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
      {showBadge && (
        <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          3
        </span>
      )}
    </div>
  );
}
