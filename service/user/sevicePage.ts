import { axiosPublic } from "@/axios/axios";
import { USER_CLINIC, USER_SERVICE } from "@/utils/Endpoint";

export const getAllService = async (page?: number) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_ALL_SERVICE}?page=${page}`);
  return res.data;
};

export const getAService = async (id?: string) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_A_SERVICE}${id}`);
  return res.data;
};

export const getAClinic = async (id?: string) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_A_SERVICE}${id}`);
  return res.data;
};

export const getAClinicDetailed = async (id?: string) => {
  const res = await axiosPublic.get(`${USER_CLINIC.GET_A_CLINIC}${id}`);
  return res.data;
};

export const getAllClinicRelatedService = async (id?: string) => {
  const res = await axiosPublic.get(`${USER_CLINIC.GET_CLINIC_RELATED_SERVICE}?clinic=${id}`);
  return res.data;
};
export const getAllClinicDoctorsService = async (id?: string) => {
  const res = await axiosPublic.get(`${USER_CLINIC.GET_CLINIC_RELATED_DOCTORS}?clinic=${id}`);
  return res.data;
};


export const getClinicListService = async (id?: string, location?: { lat: number; lng: number } | null) => {
  let url = `${USER_SERVICE.GET_CLINIC_SERVICE_RELATED}${id}/`;

  // Add location query parameters if available
  if (location && location.lat && location.lng) {
    url += `?lat=${location.lat}&lng=${location.lng}`;
  }

  const res = await axiosPublic.get(url);
  return res?.data;
}