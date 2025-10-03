import React, { FormEvent } from 'react';
import { X, CreditCard } from 'lucide-react';
import { Clinic } from './types';

interface PaymentModalProps {
  isOpen: boolean;
  selectedClinic: Clinic | null;
  paymentAmount: string;
  paymentDescription: string;
  isProcessing: boolean;
  onClose: () => void;
  onPaymentAmountChange: (amount: string) => void;
  onPaymentDescriptionChange: (description: string) => void;
  onSubmit: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  selectedClinic,
  paymentAmount,
  paymentDescription,
  isProcessing,
  onClose,
  onPaymentAmountChange,
  onPaymentDescriptionChange,
  onSubmit
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

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
              <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Initiate Payment</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Create a new payment transaction</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Clinic</label>
              <input
                type="text"
                value={selectedClinic ? selectedClinic.name : ''}
                disabled
                className="w-full px-3 sm:px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs sm:text-sm"
              />
            </div>
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Amount (INR)</label>
              <input
                type="number"
                min="1"
                value={paymentAmount}
                onChange={e => onPaymentAmountChange(e.target.value)}
                required
                className="w-full px-3 sm:px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs sm:text-sm"
              />
            </div>
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={paymentDescription}
                onChange={e => onPaymentDescriptionChange(e.target.value)}
                placeholder="Payment for..."
                className="w-full px-3 sm:px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg ${
                isProcessing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? 'Processing...' : 'Initiate Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;