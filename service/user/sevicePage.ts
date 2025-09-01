import { axiosPublic } from "@/axios/axios";
import { USER_SERVICE } from "@/utils/Endpoint";

export const getAllService = async (page?: number) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_ALL_SERVICE}?page=${page}`);
  return res.data;
};

export const getAService = async (id?: string) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_A_SERVICE}${id}`);
  return res.data;
};

export const getClinicListService = async (id?: string) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_CLINIC_SERVICE_RELATED}${id}`);
  return res?.data
}