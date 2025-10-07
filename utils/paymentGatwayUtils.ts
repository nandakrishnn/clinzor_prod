import { useSession } from "next-auth/react";
import { baseUrl } from "./Endpoint";
import { RazorpayResponse } from "./razorpay";

export const createRazorpayOrder = async (bookingId: string) => {
    const { data: session } = useSession()
    try {
        const response = await fetch(`${baseUrl}customer/create-payment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify({
                booking: bookingId,
                payment_purpose: "NORMAL_BOOKING"
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create Razorpay order');
        }

        const data: RazorpayResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw error;
    }
};