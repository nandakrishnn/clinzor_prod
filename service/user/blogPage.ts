import { axiosPublic } from "@/axios/axios"
import { USER_BLOGS } from "@/utils/Endpoint"

export const getAllBlogs = async (pageNum?: number) => {
    const res = await axiosPublic.get(`${USER_BLOGS.GET_ALL_BLOGS}?page=${pageNum}`)
    return res?.data
}