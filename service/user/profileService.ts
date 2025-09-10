import { axiosPrivate } from "@/axios/axios"
import { USER_PROFILE } from "@/utils/Endpoint";

export const getBookingService = async (status: any) => {
    const res = await axiosPrivate.get(`${USER_PROFILE.GET_BOOKINGS}?booking_status=${status}`);
    return res.data;
}

export const updateUserDetailsService = async (data: any) => {
    const res = await axiosPrivate.patch(`${USER_PROFILE.GET_UPDATE_USER_DETAILS}`, data);
    return res.data;
}

export const logOutService = async (refresh: any) => {
    const res = await axiosPrivate.post(`${USER_PROFILE.GET_LOGOUT}`, { refresh });
    return res.data;
}

// SHEDULED, PENDING, COMPLETED, CANCELED