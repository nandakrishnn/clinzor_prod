"use client";

export default function UserProfile({
  user,
  isActive,
  onClick
}: any) {
  console.log(user)
  return (
    <div
      className={`flex items-center p-4 cursor-pointer rounded-lg transition-all duration-200 bg-sidebar-primary border border-sidebar-border shadow-sm`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={user?.profile_url || "/clinic.png"}
          alt={user?.full_name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-sidebar-border"
        />
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <h3 className="font-semibold text-sidebar-foreground truncate">
          {user?.full_name}
        </h3>
        <p className="text-sm text-muted-foreground truncate">{user?.role}</p>
      </div>
    </div>
  );
}
