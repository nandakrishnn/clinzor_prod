
import  { axiosPrivate } from "../../axios/axios";


// users 
export const updateClient = async (id: string, body: {
  is_blocked: boolean;
  reason_for_block?: string;
}) => {
  try {
    const response = await axiosPrivate.patch(`user/user-block/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};

export const deleteClient = async (Id:string) => {
  return await axiosPrivate.delete(`user/user-delete/${Id}/`);
};
export const getAClient = async (Id:string) => {
  return await axiosPrivate.delete(`user/user-detail/${Id}`);
};

export const getAllClients = async () => {
  try {
    const response = await axiosPrivate.get(`/clinic/?page_size=2`);
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};


