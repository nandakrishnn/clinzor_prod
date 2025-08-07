
import  { axiosPrivate } from "../../axios/axios";


// Clinic Booking  api

export const getAllClinicBookings = async () => {
  try {
    const response = await axiosPrivate.get(`clinic/clinic-bookings/`);
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};



