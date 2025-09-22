import { axiosPrivate, axiosPublic } from "@/axios/axios"
import { USER_EXPERT } from "@/utils/Endpoint"

export const getAllExpertService = async () => {
    const res = await axiosPrivate.get(`${USER_EXPERT.GET_EXPERT}`)
    return res.data
}
export const getExpertSlotService = async (expertId: string, fromDate?: any, toDate?: any) => {
    const formatDateForAPI = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().replace(/\.[\d]{3}Z/, '');
    };

    const url = `${USER_EXPERT.GET_EXPERT_SLOT}?expert=${expertId}&pgn=false&from_date=${formatDateForAPI(fromDate)}&to_date=${formatDateForAPI(toDate)}`;

    const res = await axiosPrivate.get(url);
    return res.data;
}

export const getExpertSlotBookingService = async (slot: any) => {
    console.log(slot)
    const res = await axiosPrivate.post(`${USER_EXPERT.GET_EXPERT_SLOT_BOOKING}`, { slot })
    return res.data
}
export const getAllExpertBookingService = async (status: any) => {
    const res = await axiosPrivate.get(`${USER_EXPERT.GET_EXPERT_SLOT_BOOKING}?booking_status=${status}`)
    return res.data
}

export const cancelExpertService = async (id: string, status: any) => {
    const res = await axiosPrivate.patch(`${USER_EXPERT.CANCEL_EXPERT_BOOKING}${id}/`, { booking_status: status });
    return res.data;
}
export const getExpertSuggestionsService = async () => {
    const res = await axiosPrivate.get(`${USER_EXPERT.EXPERT_BOOKING_SUGGESTION}`);
    return res.data;
}
