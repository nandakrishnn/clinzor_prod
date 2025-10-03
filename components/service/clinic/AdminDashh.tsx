import { axiosPrivate } from "@/axios/axios"
import { CLINIC_DASHBOARD } from "@/utils/Endpoint"

export const getDashboardDataService = async () => {
    const res = await axiosPrivate.get(CLINIC_DASHBOARD.GETALL_DASH_STATIC)
    return res.data
}
export const getClinicDataService = async () => {
    const res = await axiosPrivate.get(CLINIC_DASHBOARD.GET_CLINIC_BY_USER)
    return res.data
}