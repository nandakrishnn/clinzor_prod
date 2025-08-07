
import { axiosPrivate } from "../../axios/axios";


// Due Management Api 

export const approveOrRejectDue = async (id: string, body: {
  status: string;
}) => {
  try {
    const response = await axiosPrivate.patch(`clinic/doctor-approval/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};
export const deleteClinicDues = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}/`);
};
export const GetAClinicDues = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}`);
};

export const GetAllClinicTransactions= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/list-transactions/?clinic_uuid=5a1f8f39-ca38-464c-93c5-ea8edbd6c03f`
    );
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
