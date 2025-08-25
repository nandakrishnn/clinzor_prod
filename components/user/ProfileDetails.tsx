// src/components/user/ProfileDetails.tsx
import { ProfileDetailsProps } from "@/types/user";

export default function ProfileDetails({ user }: ProfileDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 w-full">
      <h2 className="text-xl font-semibold mb-6">Profile Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Full Name
          </label>
          <p className="text-gray-800">{user.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Email
          </label>
          <p className="text-gray-800">{user.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Phone
          </label>
          <p className="text-gray-800">{user.phone}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Location
          </label>
          <p className="text-gray-800">{user.location}</p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Bio
          </label>
          <p className="text-gray-800">{user.bio}</p>
        </div>
      </div>
      <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Edit Profile
      </button>
    </div>
  );
}
