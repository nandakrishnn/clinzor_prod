import React from 'react';
import { X, Receipt, Calendar, User, Building, CreditCard, FileText, Tag } from 'lucide-react';
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

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'DUE':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'PAID':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PAYMENT':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-h-[70%] max-w-md border border-gray-200 shadow-lg overflow-y-scroll hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
              <p className="text-sm text-gray-500">Complete transaction information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-between items-start">
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(transaction.transaction_type)}`}>
                {transaction.transaction_type}
              </span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {transaction?.final_amount && formatCurrency(parseFloat(transaction.final_amount))}
              </p>
              {transaction?.discount_amount && transaction?.final_amount && parseFloat(transaction.discount_amount) > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  {formatCurrency(parseFloat(transaction.final_amount) + parseFloat(transaction.discount_amount))}
                </p>
              )}
            </div>
          </div>

          {/* Transaction Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Patient Info */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>Patient</span>
              </div>
              <p className="font-medium text-gray-900">{transaction.patient_name}</p>
            </div>

            {/* Clinic Info */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Building className="w-4 h-4" />
                <span>Clinic</span>
              </div>
              <p className="font-medium text-gray-900">{transaction.clinic_name}</p>
            </div>

            {/* Service Info */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Tag className="w-4 h-4" />
                <span>Service</span>
              </div>
              <p className="font-medium text-gray-900">{transaction.service_name}</p>
            </div>

            {/* Date Info */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </div>
              <p className="font-medium text-gray-900">{formatDate(transaction.created_at)}</p>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-gray-900 text-sm">Amount Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Original Amount</span>
                <span className="font-medium text-gray-900">
                  {transaction.discount_amount && formatCurrency(parseFloat(transaction.amount) + parseFloat(transaction.discount_amount))}
                </span>
              </div>
              {transaction.discount_amount && parseFloat(transaction.discount_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount</span>
                  <span className="font-medium text-green-600">
                    -{formatCurrency(parseFloat(transaction.discount_amount))}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Final Amount</span>
                <span className="font-semibold text-gray-900">
                  {transaction.final_amount && formatCurrency(parseFloat(transaction.final_amount))}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            {/* Transaction ID */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Transaction ID</label>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">
                {transaction.uuid}
              </p>
            </div>

            {/* Booking ID */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Booking ID</label>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">
                {transaction.booking}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileText className="w-4 h-4" />
                <span>Description</span>
              </div>
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200 min-h-[40px]">
                {transaction.description || 'No description provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primaryColor text-white rounded-lg font-medium hover:bg-primaryColor transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;