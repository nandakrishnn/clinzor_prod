import { UserProfileProps } from "@/types/user";


export default function UserProfile({ user, isActive, onClick }: UserProfileProps) {
  return (
    <div 
      className={`flex items-center p-4 cursor-pointer rounded-lg ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
      onClick={onClick}
    >
      <img 
        src={user.profileImage} 
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover mr-3"
      />
      <div>
        <h3 className="font-semibold text-gray-800">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.title}</p>
      </div>
    </div>
  );
}