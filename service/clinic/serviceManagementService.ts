import { axiosPrivate } from "../../axios/axios";

interface Slot {
  start_time: string;
  status?: string;
}

interface NewClinicService {
  clinic: string;
  service: string;
  clinic_provided_name: string;
  description: string;
  image: string;
  start_time: string;
  end_time?: string; // Optional for HOME_VISIT
  max_bookings: number;
  is_video_call: boolean;
  is_home_visit: boolean;
  is_physical_visit: boolean;
  consultation_charge_video_call: string;
  consultation_charge_physical_visit: string;
  consultation_charge_home_visit: string;
  treatment_charge_video_call: string;
  treatment_charge_physical_visit: string;
  treatment_charge_home_visit: string;
}
// Clinic-Service Management Api
export const createClinicService = async (body: NewClinicService) => {
  try {
    const response = await axiosPrivate.post(
      `clinic/clinic-service-lc/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert creation error:", error);
    throw error;
  }
};

export const editClinicService = async (id: string, body: Slot) => {
  try {
    const response = await axiosPrivate.put(`clinic/slot-rud/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};
export const updateRankClinicService = async (
  body: Array<{
    clinic_service: string;
    rank: number;
  }>
) => {
  try {
    const response = await axiosPrivate.patch(
      `clinic/update-service-rank/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Rank update error:", error);
    throw error;
  }
};
export const deleteClinicService = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/clinic-service-rud/${Id}/`);
};

export const GetAllServiceForClinic = async () => {
  try {
    const response = await axiosPrivate.get(`clinic/service-lc/`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const GetAllClinicService = async (
  clinicId?: string,
  status?: string // Pass this if you want status filtering
) => {
  try {
    const params: string[] = [];
    if (clinicId) params.push(`clinic=${encodeURIComponent(clinicId)}`);
    if (status && status !== 'all') params.push(`status=${encodeURIComponent(status)}`);

    const queryString = params.length ? `?${params.join('&')}` : '';
    const response = await axiosPrivate.get(`/clinic/clinic-service-lc/${queryString}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch clinic services", error);
    throw error;
  }
};

export const Clinic_by_clinic_user = async () => {
  try {
    const response = await axiosPrivate.get(`clinic/get-clinic-by-user/`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
