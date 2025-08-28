import { axiosPublic } from "@/axios/axios"
import { USER_BLOGS } from "@/utils/Endpoint"

export const getAllBlogs = async (pageNum?: number) => {
    const res = await axiosPublic.get(`${USER_BLOGS.GET_ALL_BLOGS}?page=${pageNum}`)
    return res?.data
}

export const getABlog = async (id?: string) => {
  try {
    const res = await axiosPublic.get(`${USER_BLOGS.GET_A_BLOG}${id}/`)
    return res?.data
  } catch (err: any) {
    console.error("Failed to fetch blog:", err?.response?.status, err?.response?.data)
    throw new Error(`Blog with id ${id} not found`)
  }
}
