import { axiosPublic } from "@/axios/axios";
import { USER_SERVICE } from "@/utils/Endpoint";

export const getAllService = async (url?: string) => {
  const endpoint = url || USER_SERVICE.GET_ALL_SERVICE;
  const res = await axiosPublic.get(endpoint);
  return res;
};
