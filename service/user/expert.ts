import { axiosPrivate, axiosPublic } from "@/axios/axios"
import { USER_EXPERT } from "@/utils/Endpoint"

export const getAllExpertService = async () => {
    const res = await axiosPrivate.get(`${USER_EXPERT.GET_EXPERT}`)
    return res.data
}
export const getExpertSlotService = async (expertId: string, fromDate?: any, toDate?: any) => {
    const res = await axiosPrivate.get(`${USER_EXPERT.GET_EXPERT_SLOT}?expert=${expertId}&&pgn=false&&from_date=${fromDate}&&to_date=${toDate}`)
    return res.data
}

export const getExpertSlotBookingService = async (slot: any) => {
    console.log(slot)
    const res = await axiosPrivate.post(`${USER_EXPERT.GET_EXPERT_SLOT_BOOKING}`,{ slot })
    return res.data
}
export const getAllExpertBookingService = async (status: any) => {
    const res = await axiosPrivate.post(`${USER_EXPERT.GET_EXPERT_SLOT_BOOKING}?booking_status=${status}`)
    return res.data
}