import { axiosPrivate, axiosPublic } from "@/axios/axios";
import { USER_CLINIC, USER_HOME, USER_SERVICE } from "@/utils/Endpoint";

export const getUserService = async () => {
  const res = await axiosPrivate.get(`${USER_HOME.GET_USER}`);
  return res.data;
};

export const getAllService = async (page?: number) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_ALL_SERVICE}?page=${page}`);
  return res.data;
};
export const getCouponService = async (serviceId: string) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_COUPON}?clinic_service=${serviceId}`);
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

export const getServiceCharges = async (id?: string) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_SERVICE_CHARGES}${id}`);
  return res.data;
};

export const getServiceSlots = async (clinicId: string, mode: string, serviceId: string) => {
  console.log(clinicId, mode, serviceId, 'data fromt he api call for get slot')
  const slot = mode === "HOME_VISIT" ? "is_home_visit" : mode === "VIDEO_CALL" ? "is_video_call" : "is_physical_visit";
  const res = await axiosPrivate.get(`${USER_SERVICE.GET_SERVICE_SLOT}?clinic_uuid=${clinicId}&&slot_type=${slot}&&service_uuid=${serviceId}`);
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