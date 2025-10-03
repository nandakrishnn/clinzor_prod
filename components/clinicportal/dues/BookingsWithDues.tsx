import React from 'react';
import { Calendar } from 'lucide-react';
import { Booking } from './types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface BookingsWithDuesProps {
  bookings: Booking[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BookingsWithDues: React.FC<BookingsWithDuesProps> = ({
  bookings,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const bookingsPerPage = 3;
  const allBookingsWithDues = bookings.filter((b) => b.amount_due > 0 && !b.is_past_due);
  const paginatedBookings = allBookingsWithDues.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 sm:p-8 mb-8 sm:mb-12 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">New Bookings with Dues to Clinzor</h2>
            <p className="text-sm text-slate-600 mt-1">Recent bookings requiring payment</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6 sm:space-y-8">
        {paginatedBookings.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">No bookings with dues</h3>
            <p className="text-slate-600 text-base">All bookings are settled</p>
          </div>
        ) : (
          paginatedBookings.map((booking, index) => {
            const activeDue = booking.amount_due > 0 && booking.status === 'NEW';
            return (
              <div
                key={booking.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 gap-6 sm:gap-0 border border-slate-200/70 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-6 sm:space-x-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-1">{booking.patient_name}</h3>
                    <p className="text-sm sm:text-base text-slate-600 font-semibold mb-2">{booking.clinic_name}</p>
                    <p className="text-sm text-slate-500 mb-1">{booking.service_details}</p>
                    <p className="text-sm text-slate-500 font-medium">{formatDate(booking.date)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center space-x-8 sm:space-x-12 mt-4 sm:mt-0">
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium mb-1">Total Cost</p>
                    <p className="font-bold text-slate-800 text-lg sm:text-xl">{formatCurrency(booking.total_cost)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium mb-1">Due to Clinzor</p>
                    <p className="font-bold text-red-600 text-lg sm:text-xl">{formatCurrency(booking.amount_due)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium mb-1">Mode</p>
                    <p className="font-bold text-blue-600 text-lg sm:text-xl">{booking.mode_of_consultation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium mb-1">Active Due</p>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border shadow-sm ${activeDue ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'}`}>
                      {activeDue ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 disabled:opacity-50 hover:bg-slate-200 transition-colors"
          >
            Previous
          </button>
          <span className="text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 disabled:opacity-50 hover:bg-slate-200 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingsWithDues;