import { axiosPrivate } from "@/axios/axios";

export const getAllClinicCount = async () => {
  try {
    const response = await axiosPrivate.get(`/clinic/`);
    return response.data.data.total_items;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

export const GetAllExpertCount= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/list-experts/`
    );
    return response.data.data.total_items;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

export const getAllBookingsCount = async () => {
  try {
    const response = await axiosPrivate.get(`clinic/admin-list-bookings/`);
    return response.data.data.total_items;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

export const GetAllServiceCount= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/service-lc/`
    );
    return response.data.data.total_items;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};



export const GetAllOffersCount = async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/offer-lc/`
    );
      const data =  response.data.data.total_items;
     return data;
  } catch (error) {
    console.error("Failed to fetch Organization", error);
    throw error;
  }
};

export const getAllCampsCount = async () => {
  try {
    const response = await axiosPrivate.get(`clinic/camp-lc/`);
    return response.data.data.total_items;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

export const GetAllBlogCount= async () => {
  try {
    const response = await axiosPrivate.get(
      `user/blog-list-create/`
    );
    return response.data.data.total_items;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

