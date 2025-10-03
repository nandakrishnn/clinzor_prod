import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Booking } from './types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface PastDueBookingsProps {
  bookings: Booking[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PastDueBookings: React.FC<PastDueBookingsProps> = ({
  bookings,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const bookingsPerPage = 3;
  const allPastDueBookings = bookings.filter((b) => b.amount_due > 0 && b.is_past_due);
  const paginatedPastDueBookings = allPastDueBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 sm:p-8 mb-8 sm:mb-12 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl shadow-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Past Due Bookings</h2>
            <p className="text-sm text-slate-600 mt-1">Overdue payments requiring attention</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-600 font-semibold">Overdue Payments</span>
        </div>
      </div>
      
      <div className="space-y-6 sm:space-y-8">
        {paginatedPastDueBookings.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">No past due bookings</h3>
            <p className="text-slate-600 text-base">All payments are up to date</p>
          </div>
        ) : (
          paginatedPastDueBookings.map((booking, index) => {
            const daysOverdue = Math.floor((Date.now() - new Date(booking.date).getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div
                key={booking.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 bg-gradient-to-br from-red-50 via-white to-orange-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 gap-6 sm:gap-0 border border-red-200/70 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-6 sm:space-x-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-1">{booking.patient_name}</h3>
                    <p className="text-sm sm:text-base text-slate-600 font-semibold mb-2">{booking.clinic_name}</p>
                    <p className="text-sm text-slate-500 mb-1">{booking.service_details}</p>
                    <p className="text-sm text-red-600 font-semibold">{formatDate(booking.date)} • {daysOverdue} days overdue</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center space-x-8 sm:space-x-12 mt-4 sm:mt-0">
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium mb-1">Total Cost</p>
                    <p className="font-bold text-slate-800 text-lg sm:text-xl">{formatCurrency(booking.total_cost)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium mb-1">Overdue Amount</p>
                    <p className="font-bold text-red-600 text-lg sm:text-xl">{formatCurrency(booking.amount_due)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium mb-1">Mode</p>
                    <p className="font-bold text-blue-600 text-lg sm:text-xl">{booking.mode_of_consultation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-medium mb-1">Status</p>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border shadow-sm bg-red-500/10 text-red-700 border-red-500/20">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Past Due
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
        <div className="flex justify-center items-center mt-10 space-x-3">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-semibold disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Previous
          </button>
          <span className="px-6 py-3 text-slate-700 font-semibold bg-white rounded-2xl shadow-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-semibold disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PastDueBookings;