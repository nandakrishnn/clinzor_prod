
import  { axiosPrivate } from "../../axios/axios";


// Clinic

export const createClinic = async (clinicData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  address?: string;
  map_link?: string;
  gps_coordinates?: string;
  opening_time?: string;
  closing_time?: string;
  working_days: string[];
}) => {
  try {
    const response = await axiosPrivate.post('/clinic/', {
      name: clinicData.name,
      email: clinicData.email,
      password: clinicData.password,
      contact_number:clinicData.phone,
      city: clinicData.city,
      address: clinicData.address,
      map_link: clinicData.map_link,
      gps_coordinates: clinicData.gps_coordinates,
      opening_time: clinicData.opening_time,
      closing_time: clinicData.closing_time,
      working_days: clinicData.working_days
    });
    return response.data;
  } catch (error) {
    console.error("Error creating clinic:", error);
    throw error;
  }
};

export const approveOrRejectClinic = async (id: string, body: {
  status: string;
}) => {
  try {
    const response = await axiosPrivate.patch(`clinic/clinic-approval/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};
export const toggleActiveClinic = async (id: string, body: {
  is_active: boolean;
}) => {
  try {
    const response = await axiosPrivate.patch(`clinic/clinic-patch/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};

export const deleteClinic= async (Id:string) => {
  return await axiosPrivate.delete(`/clinic/clinic-service-rud/${Id}/`);
};
export const getAClinic = async (Id:string) => {
  return await axiosPrivate.delete(`user/user-detail/${Id}`);
};

export const getAllClinic = async () => {
  try {
    const response = await axiosPrivate.get(`/clinic/`);
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};


