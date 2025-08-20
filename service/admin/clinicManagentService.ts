
import  { axiosPrivate } from "../../axios/axios";


// Clinic

export const createClinic = async (clinicData: {
  name: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  map_link?: string;
  gps_coordinates?: string;
gst_no?: string;
about_clinic?: string;
  registration_certificate?: string;
    opening_time?: string;
  closing_time?: string;
  working_days: string[];
}) => {
  try {
    const response = await axiosPrivate.post('/clinic/', {
      name: clinicData.name,
      email: clinicData.email,
      contact_number:clinicData.phone,
      city: clinicData.city,
      address: clinicData.address,
      map_link: clinicData.map_link,
      gps_coordinates: clinicData.gps_coordinates,
      registration_certificate: clinicData.registration_certificate,
      gst_no: clinicData.gst_no,
      about_clinic: clinicData.about_clinic,
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
export const createUserForClinic = async (clinicData: {
  clinic: string;
  full_name: string;
  email: string;
  phone_number: string;
  password: string;

}) => {
  try {
    const response = await axiosPrivate.post('clinic/clinic-user-create/', {
      clinic: clinicData.clinic,
      full_name: clinicData.full_name,
      email: clinicData.email,
      password: clinicData.password,
      phone_number:clinicData.phone_number,
  
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
  return await axiosPrivate.get(`/clinic/clinic-rud/${Id}`);
};

export const getAllClinic = async (params: any = {}) => {
  try {
      const queryString = new URLSearchParams(params).toString();
    const response = await axiosPrivate.get(`clinic/?${queryString}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};


