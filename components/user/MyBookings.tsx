// src/components/user/MyBookings.tsx
import { MyBookingsProps } from "@/types/user";

export default function MyBookings({ bookings }: MyBookingsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 min-w-full">
      <h2 className="text-xl font-semibold mb-6">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">{booking.title}</h3>
                <p className="text-sm text-gray-500">{booking.date} • {booking.time}</p>
                <p className="text-sm mt-1">{booking.location}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {booking.status}
              </span>
            </div>
            <div className="mt-3 flex space-x-3">
              <button className="text-blue-600 text-sm font-medium hover:underline">View Details</button>
              <button className="text-blue-600 text-sm font-medium hover:underline">Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}