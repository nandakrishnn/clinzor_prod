import { axiosPublic } from "@/axios/axios";
import { USER_SERVICE } from "@/utils/Endpoint";

export const getAllService = async (page?: number) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_ALL_SERVICE}?page=${page}`);
  return res.data;
};
