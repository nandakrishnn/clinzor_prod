import { axiosPrivate } from "../../axios/axios";

// Booking  
export const updateBookings = async (id: string, body: {
  is_blocked: boolean;
  reason_for_block?: string;
}) => {
  try {
    const response = await axiosPrivate.patch(`user/user-block/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};

export const deleteBooking = async (Id: string) => {
  return await axiosPrivate.delete(`user/user-delete/${Id}/`);
};

export const getABooking = async (Id: string) => {
  return await axiosPrivate.delete(`user/user-detail/${Id}`);
};

export const getAllBookings = async (params: any) => {
  try {
    const response = await axiosPrivate.get(`clinic/admin-list-bookings/`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch bookings", error);
    throw error;
  }
};

export const getExpertBookings = async (params?: any) => {
  try {
    const response = await axiosPrivate.get(`/customer/expert-booking-lc/`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch expert bookings", error);
    throw error;
  }
};

export const getClinicBookings = async (params: any) => {
  try {
    const response = await axiosPrivate.get(`/clinic/admin-list-bookings/`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch clinic bookings", error);
    throw error;
  }
};

// Slot management 
export const getAllSlots = async (params: any) => {
  try {
    const response = await axiosPrivate.get(`/clinic/slot-lc/`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

export const approveSlot = async (slotId: string) => {
  try {
    const response = await axiosPrivate.patch(
      `clinic/slot-approve-or-reject/${slotId}/`,
      { status: 'APPROVED', reason_for_rejection: null }
    );
    return response.data;
  } catch (error) {
    console.error("Slot approval error:", error);
    throw error;
  }
};

export const rejectSlot = async (slotId: string, reason: string) => {
  try {
    const response = await axiosPrivate.patch(
      `clinic/slot-approve-or-reject/${slotId}/`,
      { status: 'REJECTED', reason_for_rejection: reason }
    );
    return response.data;
  } catch (error) {
    console.error("Slot rejection error:", error);
    throw error;
  }
};

export const bulkApproveSlots = async (slotType: string, slotList: string[]) => {
  try {
    const response = await axiosPrivate.patch(
      `clinic/bulk-slot-approval/`, // Adjust endpoint as needed
      {
        slot_type: slotType,
        slot_list: slotList
      }
    );
    return response.data;
  } catch (error) {
    console.error("Bulk slot approval error:", error);
    throw error;
  }
};

// Payment Management 
export const getAllPayment = async (params: Record<string, string | number | undefined>) => {
  try {
    // Create a clean params object without undefined values
    const cleanParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleanParams[key] = String(value);
      }
    });

    const queryString = new URLSearchParams(cleanParams).toString();
    const response = await axiosPrivate.get(`/clinic/payment-transaction-list/?${queryString}`);

    // Return the full response data (not just response.data.data)
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch payment records", error);
    throw error;
  }
};