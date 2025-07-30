import { User } from "@/types/user";
import  { axiosPrivate } from "../../axios/axios";
import { getSession } from "next-auth/react";
import { baseUrl } from "@/utils/Endpoint";

// users 
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

export const deleteBooking= async (Id:string) => {
  return await axiosPrivate.delete(`user/user-delete/${Id}/`);
};
export const getABooking= async (Id:string) => {
  return await axiosPrivate.delete(`user/user-detail/${Id}`);
};

export const getAllBookings = async () => {
  try {
    const response = await axiosPrivate.get(`clinic/admin-list-bookings/`);
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};


