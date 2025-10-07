// BookingsWithDues.tsx
import React from 'react';
import { Calendar, Eye } from 'lucide-react';
import { Transaction, PaginationData } from './types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Pagination from '@/components/common/Pagination';

interface BookingsWithDuesProps {
  transactions: Transaction[];
  paginationData: PaginationData;
  onTransactionClick: (transaction: Transaction) => void;
  onPageChange: (page: number) => void;
}

const BookingsWithDues: React.FC<BookingsWithDuesProps> = ({
  transactions,
  paginationData,
  onTransactionClick,
  onPageChange
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 sm:p-8 mb-8 sm:mb-12 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Bookings with Dues to Clinzor</h2>
            <p className="text-sm text-slate-600 mt-1">Recent bookings requiring payment</p>
          </div>
        </div>
      </div>

      {/* Table View for Due Transactions */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm sm:text-base">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Patient & Service</th>
              <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Clinic</th>
              <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Amount Due</th>
              <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Date</th>
              <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 sm:py-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">No dues found</h3>
                  <p className="text-slate-600 text-base">All bookings are settled</p>
                </td>
              </tr>
            ) : (
              transactions.map((transaction: any, index) => (
                <tr
                  key={transaction.uuid}
                  className="hover:bg-slate-50 transition-all duration-200 group"
                >
                  <td className="py-4 sm:py-6 px-4 sm:px-8">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm sm:text-base">
                          {transaction.patient_name}
                        </p>
                        <p className="text-sm text-slate-600 font-medium">
                          {transaction.service_name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {transaction.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-8">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">
                      {transaction.clinic_name}
                    </p>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-8">
                    <div className="text-right">
                      <p className="text-sm text-slate-600 font-medium mb-1">Due Amount</p>
                      <p className="font-bold text-red-600 text-lg sm:text-xl">
                        {formatCurrency(parseFloat(transaction.amount))}
                      </p>
                      {transaction.discount_amount !== "0.00" && (
                        <p className="text-sm text-slate-500 line-through">
                          Original: {formatCurrency(parseFloat(transaction.final_amount) + parseFloat(transaction.discount_amount))}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-8">
                    <p className="text-sm text-slate-600 font-medium">
                      {formatDate(transaction.created_at)}
                    </p>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-8">
                    <button
                      onClick={() => onTransactionClick(transaction)}
                      className="p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {paginationData.total_pages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={paginationData.current_page}
            totalPages={paginationData.total_pages}
            setCurrentPage={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default BookingsWithDues;