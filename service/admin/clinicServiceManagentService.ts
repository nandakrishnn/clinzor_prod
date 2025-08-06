
import { axiosPrivate } from "../../axios/axios";

interface Expert {
  uuid: string;
  clinic_service: string;
  created_by: string;
  name: string;
  dob: string | null;
  gender: "MALE" | "FEMALE" | "OTHER"; // Assuming these are the possible values
  specializaton: string; // Note: There's a typo in "specialization" in your JSON
  experience: number | null;
  phone_number: string;
  email: string | null;
  profile_pic: string | null;
  status: "APPROVED" | "REJECTED" | "PENDING"; // Assuming possible statuses
  reason_for_rejection: string | null;
  education: string;
  government_document: string | null;
  extra_info: string | null;
}

// ClinicService Management Api 
export const createClinicService = async (body:Expert) => {
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
export const editClinicService = async (
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
export const approveOrRejectClinicService = async (id: string, body: {
  status: string;
}) => {
  try {
    const response = await axiosPrivate.patch(`clinic/clinic-service-approval/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};
export const deleteClinicService = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}/`);
};
export const GetAClinicService = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}`);
};

export const GetAllClinicService= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/clinic-service-lc/`
    );
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
