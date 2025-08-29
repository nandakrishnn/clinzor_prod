import { axiosPrivate } from "../../axios/axios";

interface UpdateClinicData {
  name: string;
  email: string;
  contact_number: string;
  address: string;
  city: string;
  pincode: string;
  about_clinic: string;
  coordinates?: string; // Format: "SRID=4326;POINT (lng lat)"
}


export const editClinicODetails = async (id: string, body: UpdateClinicData) => {
  try {
    const response = await axiosPrivate.put(`clinic/clinic-rud/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};
export const setOperatingHours = async ( body: any) => {
  
  try {
    const response = await axiosPrivate.put(`/clinic/clinic-timing-create/`, body);
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};