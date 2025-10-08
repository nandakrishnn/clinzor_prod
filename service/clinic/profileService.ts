import { axiosPrivate } from "../../axios/axios";


export const editClinicODetails = async (id: string, body: any) => {
  try {
    const response = await axiosPrivate.put(`clinic/clinic-rud/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};
export const setOperatingHours = async (body: any) => {

  try {
    const response = await axiosPrivate.put(`/clinic/clinic-timing-create/`, body);
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};

export const getOperatingHours = async (id: any) => {
  try {
    const response = await axiosPrivate.get(`/clinic/clinic-timing-list/${id}`);
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};