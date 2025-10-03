import React from 'react';
import { X, Receipt } from 'lucide-react';
import { Transaction } from './types';
import { formatCurrency, formatDate, getStatusConfig } from '@/utils/formatters';
import * as LucideIcons from 'lucide-react';

interface PaymentHistoryModalProps {
    isOpen: boolean;
    transactions: Transaction[];
    searchTerm: string;
    statusFilter: string;
    onClose: () => void;
    onSearchChange: (search: string) => void;
    onStatusFilterChange: (status: string) => void;
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
    isOpen,
    transactions,
    searchTerm,
    statusFilter,
    onClose,
    onSearchChange,
    onStatusFilterChange
}) => {
    if (!isOpen) return null;

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.uuid.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.clinic_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || transaction.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-4xl border border-white/20 shadow-2xl relative flex flex-col max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="p-2 sm:p-6 flex-1 flex flex-col overflow-hidden">
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <Receipt className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Payment History</h2>
                        <p className="text-slate-500 text-xs sm:text-sm">All payment transactions</p>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 w-full">
                        <input
                            type="text"
                            placeholder="Search by clinic or transaction ID..."
                            value={searchTerm}
                            onChange={e => onSearchChange(e.target.value)}
                            className="w-full sm:w-1/2 px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        />
                        <select
                            value={statusFilter}
                            onChange={e => onStatusFilterChange(e.target.value)}
                            className="w-full sm:w-1/4 px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                        >
                            <option value="">All Status</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="PENDING">Pending</option>
                            <option value="CREATED">Created</option>
                            <option value="FAILED">Failed</option>
                        </select>
                    </div>

                    <div className="flex-1 overflow-auto w-full">
                        <table className="w-full min-w-[700px] text-xs sm:text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Transaction</th>
                                    <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Patient Name</th>
                                    <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Service</th>
                                    <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                                    <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredTransactions.map((transaction) => {
                                    const statusConfig = getStatusConfig(transaction.status);
                                    return (
                                        <tr key={transaction.uuid} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-2 sm:py-4 px-2 sm:px-4">
                                                <div className="flex items-center space-x-2 sm:space-x-3">
                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                                        <Receipt className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 text-xs sm:text-sm">{transaction.uuid}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2 sm:py-4 px-2 sm:px-4">
                                                <p className="font-medium text-slate-900 text-xs sm:text-sm text-nowrap">{transaction.patient_name || 'N/A'}</p>
                                            </td>
                                            <td className="py-2 sm:py-4 px-2 sm:px-4">
                                                <p className="font-medium text-slate-900 text-xs sm:text-sm text-nowrap">{transaction.service_name || transaction.clinic_name}</p>
                                                <p className="text-xs sm:text-sm text-slate-600 capitalize">{transaction.transaction_type.toLowerCase()}</p>
                                            </td>
                                            <td className="py-2 sm:py-4 px-2 sm:px-4">
                                                <p className="font-bold text-slate-900 text-xs sm:text-sm">{formatCurrency(transaction.amount)}</p>
                                            </td>
                                            <td className="py-2 sm:py-4 px-2 sm:px-4">
                                                <p className="text-xs sm:text-sm text-slate-600">{formatDate(transaction.created_at)}</p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredTransactions.length === 0 && (
                            <div className="text-center py-8 sm:py-12">
                                <Receipt className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">No payment transactions found</h3>
                                <p className="text-slate-500 text-xs sm:text-sm">No payments have been made yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistoryModal;