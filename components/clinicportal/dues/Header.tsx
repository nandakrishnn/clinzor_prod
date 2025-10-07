'use client'
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import React, { useState } from 'react';
import { Clinic } from './types';
import { clearClinicDues } from '@/service/clinic/dueManagementService';
import { initializeRazorpayPayment } from '@/utils/razorpay';
import { toast } from 'sonner';

interface HeaderProps {
  due: any;
  clinicData: Clinic | null;
  activeTab: 'overview' | 'transactions';
  onTabChange: (tab: 'overview' | 'transactions') => void;
}

const Header: React.FC<HeaderProps> = ({ due, activeTab, onTabChange, clinicData }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderId, setOrderId] = React.useState<string | null>(null)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' }
  ];
  console.log(due, clinicData, 'due object from the header')

  // Add this function to handle payment success
  const handlePaymentSuccess = async (razorpayResponse: any) => {
    try {

      console.log(razorpayResponse, 'response we console form the sucess')

      const { razorpay_order_id } = razorpayResponse;
      setOrderId(razorpay_order_id)

      toast("Due Payment Successfully Completed")
    } catch (error) {
      console.error('Error handling payment success:', error);
      toast('Payment verification failed. Please contact support.');
    }
  };

  const handlePaymentConformation = async () => {
    setIsConfirming(true);
    try {
      const data = {
        amount: due?.remaining_dues,
        clinic: clinicData?.uuid
      }

      const response = await clearClinicDues(data)
      if (response?.status == 200 && response?.message === 'Transaction initiated') {
        console.log(response, 'response data')
        const razorpayOrder = response?.data;
        const clinic = {
          name: clinicData?.name,
          email: clinicData?.email,
          phone_number: clinicData?.contact_number,
        }
        console.log(razorpayOrder, 'response data')
        console.log(clinic, 'Clinic Passing data')
        // Initialize Razorpay payment
        await initializeRazorpayPayment(
          razorpayOrder,
          razorpayOrder?.id,
          clinic,
          handlePaymentSuccess,
          (error) => {
            toast(`Payment initialization failed: ${error.message}`);
            setIsConfirming(false);
          },
          "Due Payment",
          "Due payment for"
        );
      }
    } catch (error: any) {
      console.log(error?.response?.data)
    } finally {
      setShowConfirmModal(false)
      setIsConfirming(false);
    }
  }

  const handleDueModal = () => {
    setShowConfirmModal(true);
  };

  return (<>
    {/* Confirmation Modal */}
    <ConfirmationModal
      isOpen={showConfirmModal}
      onClose={() => setShowConfirmModal(false)}
      onConfirm={handlePaymentConformation}
      title="Confirm Due Payment"
      message="Are you sure you want to confirm this Payment? This action cannot be undone."
      confirmText="Confirm Payment"
      isLoading={isConfirming}
    />

    <div className="backdrop-blur-xl bg-white/80 z-40">
      <div className="max-w-7xl mx-auto py-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
                Dues Management
              </h1>
              <p className="text-sm text-slate-500 mt-1">Track payments and manage clinic dues</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4 mt-2 sm:mt-0">
            <button
              onClick={handleDueModal}
              className="p-3  sm:px-5  rounded-lg bg-primaryColor text-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Pay Now
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ${activeTab === tab.id
                ? 'bg-white text-blue-600 border border-slate-200 border-b-white relative -mb-px'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </>
  );
};

export default Header;