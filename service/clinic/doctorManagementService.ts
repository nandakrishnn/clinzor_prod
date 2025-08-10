import { axiosPrivate } from "../../axios/axios";

interface Slot {
  start_time: string;
  status?: string;
}
interface NewDoctor {
  clinic_service: string;
  name: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  specializaton: string;
  experience: string;
  phone_number: string;
  email: string;
  education?: string;
  additional_info?: string;
  profile_pic_file?: File | null;
  govt_verification_doc_files?: File[];
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

export const GetAllDoctor = async (page: number, page_size?: number): Promise<any> => {
  try {
    const params: Record<string, any> = { page };
    if (page_size) params.page_size = page_size;
    const response = await axiosPrivate.get(`clinic/doctor-lc/`, { params });
    // Return full shape so callers can read pagination metadata
    return response.data;
  } catch (error) {
    console.error("Failed to fetch doctors", error);
    throw error;
  }
};

