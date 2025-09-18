export interface RazorpayOrder {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: any[];
  offer_id: null | string;
  receipt: null | string;
  status: string;
}

export interface RazorpayResponse {
  status: number;
  message: string;
  data: {
    pg_response: RazorpayOrder;
    status: string;
  };
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    booking_id: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initializeRazorpayPayment = async (
  orderData: RazorpayResponse,
  bookingId: string,
  patient: { name?: any; email?: any; phone_number?: any },
  onSuccess: (response: any) => void,
  onError: (error: any) => void
) => {
  const isLoaded = await loadRazorpay();
  
  if (!isLoaded) {
    onError(new Error('Failed to load Razorpay'));
    return;
  }


  console.log(orderData,'from the razorpyment response')
  const { pg_response } = orderData.data;
  const amountInRupees = pg_response.amount / 100; // Convert back to rupees from paise

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ,
    amount: pg_response.amount,
    currency: pg_response.currency,
    name: 'Healthcare Service Booking',
    description: `Booking payment for ${amountInRupees} INR`,
    order_id: pg_response.id,
    handler: onSuccess,
    prefill: {
      name: patient.name,
      email: patient.email,
      contact: patient.phone_number,
    },
    notes: {
      booking_id: bookingId,
    },
    theme: {
      color: '#3399cc',
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};