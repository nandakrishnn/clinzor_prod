import { axiosPrivate } from "../../axios/axios";

interface Slot {
  start_time: string;
  status?: string;
}
interface NewDoctor {
  clinic_service: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  specializaton: string;
 experience: number | string;
  phone_number: string;
  email: string;
  education?: string;
  profile_pic_file?: File | null;
  government_document?:string[];
  extra_info?: string;
}
// Clinic-Doctor Management Api
export const createDoctor = async (body: NewDoctor) => {
  try {
    const response = await axiosPrivate.post(
      `clinic/doctor-lc/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert creation error:", error);
    throw error;
  }
};

export const editDoctor = async (id: string, body: Slot) => {
  try {
    const response = await axiosPrivate.put(`clinic/doctor-rud/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};
export const approveOrRejectDoctor = async (
  id: string,
  body: {
    status: string;
  }
) => {
  try {
    const response = await axiosPrivate.patch(
      `clinic/doctor-approval/${id}/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};
export const deleteDoctor = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}/`);
};

// Update the GetAllDoctor function to accept additional parameters
export const GetAllDoctor = async (
  page: number = 1,
  page_size?: number,
  search?: string,
  status?: string,
  service?: string,
  gender?: string,
  specialization?: string
): Promise<any> => {
  try {
    const params: Record<string, any> = { page };
    if (page_size) params.page_size = page_size;
    if (search) params.search = search;
    if (status) params.status = status;
    if (service) params.clinic_service = service;
    if (gender) params.gender = gender;
    if (specialization) params.specialization = specialization;
    
    const response = await axiosPrivate.get(`clinic/doctor-lc/`, { params });
    // Return full shape so callers can read pagination metadata
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch doctors", error);
    throw error;
  }
};