
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
  reason_for_rejection?: string;
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

export const GetAllClinicService = async (page: number, search: string = '', status: string = 'ALL', priority: string = 'ALL') => {
  try {
    // Build query parameters
    const params: any = {
      page: page
    };

    // Add search parameter if provided
    if (search) {
      params.search = search;
    }

    // Add status filter if provided and not 'ALL'
    if (status !== 'ALL') {
      params.status = status;
    }

    // Add priority filter if provided and not 'ALL'
    if (priority !== 'ALL') {
      params.priority = priority;
    }

    const response = await axiosPrivate.get('clinic/clinic-service-lc/', {
      params: params
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch clinic services", error);
    throw error;
  }
};
export const GetAllService = async (page: number, search: string = '', status: string = 'ALL') => {
  try {
    // Build query parameters
    const params: any = {
      page: page
    };

    // Add search parameter if provided
    if (search) {
      params.search = search;
    }

    // Add status filter if provided and not 'ALL'
    if (status !== 'ALL') {
      params.status = status;
    }

    const response = await axiosPrivate.get('clinic/service-lc/', {
      params: params
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch services", error);
    throw error;
  }
};
