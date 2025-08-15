
import { axiosPrivate } from "../../axios/axios";
type ServiceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
interface Service {
  name: string;
  description: string;
  tags: string;
  image?: string;
}

// ClinicService Management Api 
export const createService = async (body:Service) => {
  try {
    const response = await axiosPrivate.post(
      `clinic/service-lc/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert creation error:", error);
    throw error;
  }
};
export const editService = async (
  id: string,
 body: Service) => {
  try {
    const response = await axiosPrivate.put(
      `clinic/service-rud/${id}/`,
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
export const deleteService = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/service-rud/${Id}/`);
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
export const GetAllService= async (page: number) => {
  try {
    const response = await axiosPrivate.get(
      `clinic/service-lc/?page=${page}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
