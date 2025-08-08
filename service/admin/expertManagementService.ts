
import { axiosPrivate } from "../../axios/axios";

type Expert = {
  uuid: string;
  name: string;
  email: string;
  phone_number: string;
  gender: 'MALE' | 'FEMALE';
  enabled: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';
  specialization?: string;
  experience?: string;
  rating?: number;
  totalBookings?: number;
  joinedDate?: string;
  clinic_service?: string; // Added clinic_service to match the API
  education?: string; // Added education to match the API
};

// Epert Management Api 
export const createExpert = async (body:Expert) => {
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
export const deleteExpert = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}/`);
};
export const GetAExpert = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}`);
};

export const GetAllExpert= async () => {
  try {
    const response = await axiosPrivate.get(
      `/clinic/doctor-lc/`
    );
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
