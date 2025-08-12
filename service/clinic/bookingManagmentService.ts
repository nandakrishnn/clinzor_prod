
import  { axiosPrivate } from "../../axios/axios";


// Clinic Booking  api

export const getAllClinicBookings = async (page: number) => {
  try {
    const response = await axiosPrivate.get(`clinic/clinic-bookings/?page=${page}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
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

