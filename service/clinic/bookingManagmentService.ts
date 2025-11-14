
import { axiosPrivate } from "../../axios/axios";


// Clinic Booking  api

export const getAllClinicBookings = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  status: string = '',
  type: string = '',
  date: string = '',
  showToday: boolean = false
) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());

    if (search) params.append('search', search);
    if (status) params.append('booking_status', status);
    if (type) params.append('booking_type', type);
    if (date) params.append('to_date', date);
    if (showToday) params.append('show_today', 'true');

    const response = await axiosPrivate.get(`clinic/clinic-bookings/?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch bookings", error);
    throw error;
  }
};

export const cancelClinicBookings = async (id: string, body: {
  booking_status: string;
}) => {
  try {
    const response = await axiosPrivate.patch(`clinic/mark-booking-complete/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};

export const updateBookingStatus = async (id: string, newStatus: any) => {
  try {
    const body = {
      booking_status: newStatus
    }
    const response = await axiosPrivate.patch(`clinic/mark-booking-complete/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};
