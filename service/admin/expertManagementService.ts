
import { axiosPrivate } from "../../axios/axios";

type Expert = {
  full_name: string;
  email: string;
  phone_number: string;
  gender: 'MALE' | 'FEMALE';
  enabled: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';
  specialization?: string;
  experience?: string;
  rating?: number;
  totalBookings?: number;
  password?: string;
  joinedDate?: string;
  clinic_service?: string; // Added clinic_service to match the API
  education?: string; // Added education to match the API
  address?: string; // Added addresss to match the API
  dob?: string; // Added dob to match the API
};

// Epert Management Api 
export const createExpert = async (body:Expert) => {
  try {
    const response = await axiosPrivate.post(
      `clinic/expert-user-create/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert creation error:", error);
    throw error;
  }
};
export const editExpert = async (
  id: string,
 body: Expert) => {
  try {
    const response = await axiosPrivate.put(
      `clinic/doctor-rud/${id}/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};
export const approveOrRejectExpert = async (id: string, body: {
  status: string;
}) => {
  try {
    const response = await axiosPrivate.patch(`clinic/doctor-approval/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};

export const approveExpertSlot = async (slotId: string) => {
  try {
    const response = await axiosPrivate.patch(
      `clinic/expert-slot-approval/${slotId}/`,
      { status: 'APPROVED', reason_for_rejection: null }
    );
    return response.data;
  } catch (error) {
    console.error("Slot approval error:", error);
    throw error;
  }
};

export const rejectExpertSlot = async (slotId: string, reason: string) => {
  try {
    const response = await axiosPrivate.patch(
      `clinic/expert-slot-approval/${slotId}/`,
      { status: 'REJECTED', reason_for_rejection: reason }
    );
    return response.data;
  } catch (error) {
    console.error("Slot rejection error:", error);
    throw error;
  }
};
// doc
export const createDoc = async (body:Expert) => {
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
export const editDoc = async (
  id: string,
 body: Expert) => {
  try {
    const response = await axiosPrivate.put(
      `clinic/doctor-rud/${id}/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};
export const approveOrRejectDoc = async (id: string, body: {
  status: string;
}) => {
  try {
    const response = await axiosPrivate.patch(`clinic/doctor-approval/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};
export const deleteExpert = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}/`);
};
export const GetAExpert = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}`);
};

export const GetAllExpert = async (page: number = 1, search?: string, status?: string, gender?: string) => {
  try {
    const params: any = { page };
    
    if (search) params.search = search;
    if (status && status !== 'ALL') params.status = status;
    if (gender && gender !== 'ALL') params.gender = gender;

    const response = await axiosPrivate.get(`clinic/list-experts/`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch experts", error);
    throw error;
  }
};


export const getAllSlotsforExpret = async (params: any) => {
  try {
    const response = await axiosPrivate.get(`clinic/expert-slot-lc/`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const GetAllClinicServiceforDoc= async (page:number) => {
  try {
    const response = await axiosPrivate.get(
      `clinic/clinic-service-lc/?page=${page}&status=APPROVED`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};