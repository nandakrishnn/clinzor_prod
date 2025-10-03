import React from 'react';
import { X, Receipt } from 'lucide-react';
import { Transaction } from './types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  transaction,
  onClose
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-sm sm:max-w-md border border-white/20 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="p-4 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Receipt className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Transaction Details</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Review the transaction information</p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <span className="block text-xs text-slate-500 font-medium mb-1">Transaction ID</span>
              <span className="font-mono text-xs sm:text-sm text-slate-900">{transaction.uuid}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium mb-1">Clinic</span>
              <span className="text-xs sm:text-sm text-slate-900">{transaction.clinic_name}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium mb-1">Amount</span>
              <span className="text-xs sm:text-sm text-slate-900">{formatCurrency(transaction.amount)}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium mb-1">Status</span>
              <span className="text-xs sm:text-sm text-slate-900">{transaction.status}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium mb-1">Date</span>
              <span className="text-xs sm:text-sm text-slate-900">{formatDate(transaction.created_at)}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium mb-1">Description</span>
              <span className="text-xs sm:text-sm text-slate-900">{transaction.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;