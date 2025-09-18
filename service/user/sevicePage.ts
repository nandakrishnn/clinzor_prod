import { axiosPrivate, axiosPublic } from "@/axios/axios";
import { USER_CLINIC, USER_HOME, USER_SERVICE } from "@/utils/Endpoint";

export const getUserService = async () => {
  const res = await axiosPrivate.get(`${USER_HOME.GET_USER}`);
  return res.data;
};

export const getAllService = async (page?: number, search?: string) => {
  let url = `${USER_SERVICE.GET_ALL_SERVICE}?page=${page || 1}`;

  if (search && search.trim() !== "") {
    url += `&search=${encodeURIComponent(search.trim())}`;
  }

  const res = await axiosPublic.get(url);
  return res.data;
};

export const getCouponService = async (serviceId: string) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_COUPON}?clinic_service=${serviceId}`);
  return res.data;
};
export const getClinicServiceData = async (clinicId: string) => {
  const res = await axiosPublic.get(`${USER_SERVICE.GET_CLINIC_SERVICES}?clinic=${clinicId}`);
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


export const getClinicListService = async (id?: string, location?: { lat: number; lng: number } | null, search?: string) => {
  let url = `${USER_SERVICE.GET_CLINIC_SERVICE_RELATED}${id}/`;

  const params: Record<string, string> = {};

  // Add location query parameters if available
  if (location?.lat && location?.lng) {
    params.lat = location.lat.toString();
    params.lng = location.lng.toString();
  }

  if (search) {
    params.search = search;
  }

  const res = await axiosPublic.get(url, { params });
  return res?.data;
}

export const createBookingService = async (data?: any) => {
  const res = await axiosPrivate.post(`${USER_SERVICE.CREATE_BOOKING}`, data);
  return res.data;
};


export const createRazorpayOrder = async (bookingId: string) => {
  try {
    const response = await axiosPrivate.post(`${USER_SERVICE.CREATE_RAYZOR_PAY}`, {
      booking: bookingId,
      payment_purpose: "NORMAL_BOOKING",
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};


export const verifyPayment = async (id: any) => {
  try {
    const response = await axiosPrivate.post(`${USER_SERVICE.VERIFY_STATUS}?order_id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

export const createCampRegistration = async (data: any) => {
  try {
    const response = await axiosPrivate.post(`${USER_SERVICE.CREATE_CAMP}`, data);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}