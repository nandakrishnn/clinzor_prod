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

// Update operating hours
export const updateOperatingHours = async (body: any) => {
  try {
    const response = await axiosPrivate.put('/clinic/clinic-timing-update/', body);

    // Normalize the response to always have data property
    return {
      ...response,
      data: {
        status: response.status,
        message: response.data?.message || 'Timings updated',
        data: response.data?.data || null,
        ...response.data
      }
    };
  } catch (error) {
    console.error("Update operating hours error:", error);
    throw error;
  }
};

// Create operating hours
export const createOperatingHours = async (body: any) => {
  try {
    const response = await axiosPrivate.post('/clinic/clinic-timing-create/', body);

    // Normalize the response to always have data property
    return {
      ...response,
      data: {
        status: response.status,
        message: response.data?.message || 'Timings created',
        data: response.data?.data || null,
        ...response.data
      }
    };
  } catch (error) {
    console.error("Create operating hours error:", error);
    throw error;
  }
};