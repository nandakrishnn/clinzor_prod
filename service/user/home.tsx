import { axiosPublic } from "@/axios/axios";
import { USER_HOME } from "@/utils/Endpoint";

export const getServices = async () => {
  const res = await axiosPublic.get(USER_HOME.GET_SERVICE);
  return res.data;
};
