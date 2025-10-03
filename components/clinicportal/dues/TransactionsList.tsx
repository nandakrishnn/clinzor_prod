import React from 'react';
import { Receipt, Download, Filter, Eye } from 'lucide-react';
import { Transaction, PaginationData } from './types';
import { formatCurrency, formatDate, getStatusConfig } from '@/utils/formatters';
import * as LucideIcons from 'lucide-react';

interface TransactionsListProps {
  transactions: Transaction[];
  paginationData: PaginationData;
  onTransactionClick: (transaction: Transaction) => void;
  onPageChange: (page: number) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  paginationData,
  onTransactionClick,
  onPageChange
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl overflow-x-auto">
      <div className="p-6 sm:p-8 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recent Transactions</h2>
              <p className="text-sm text-slate-600 mt-1">Payment and transaction history</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button className="p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] sm:min-w-full text-sm sm:text-base">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Transaction</th>
              <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Service</th>
              <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Amount</th>
              <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Status</th>
              <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Date</th>
              <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {transactions.map((transaction, index) => {
              const statusConfig = getStatusConfig(transaction.status);
              const StatusIcon = LucideIcons[statusConfig.icon as keyof typeof LucideIcons] as React.ComponentType<any>;

              return (
                <tr key={transaction.uuid} className="hover:bg-slate-50 transition-all duration-200 group">
                  <td className="py-4 sm:py-6 px-4 sm:px-8">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm sm:text-base">{transaction.uuid}</p>
                        <p className="text-sm text-slate-600 font-medium">{transaction.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-8">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">{transaction.clinic_name}</p>
                    <p className="text-sm text-slate-600 capitalize font-medium">{transaction.transaction_type?.toLowerCase()}</p>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-8">
                    <p className="font-bold text-slate-900 text-lg sm:text-xl">{formatCurrency(transaction.amount)}</p>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-8">
                    <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold border shadow-sm ${statusConfig.color}`}>
                      {StatusIcon && <StatusIcon className="w-4 h-4 mr-1" />}
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 sm:py-6 px-4 sm:px-8">
                    <p className="text-sm text-slate-600 font-medium">{formatDate(transaction.created_at)}</p>
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
              );
            })}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12 sm:py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Receipt className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">No transactions found</h3>
          <p className="text-slate-600 text-base">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Pagination Controls */}
      {paginationData.total_pages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4 p-6 border-t border-slate-200">
          <button
            onClick={() => onPageChange(Math.max(1, paginationData.current_page - 1))}
            disabled={paginationData.current_page === 1}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 disabled:opacity-50 hover:bg-slate-200 transition-colors"
          >
            Previous
          </button>
          <span className="text-slate-700">
            Page {paginationData.current_page} of {paginationData.total_pages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(paginationData.total_pages, paginationData.current_page + 1))}
            disabled={paginationData.current_page === paginationData.total_pages}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 disabled:opacity-50 hover:bg-slate-200 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionsList;