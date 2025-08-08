
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
export const deleteDue = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}/`);
};
export const GetADue = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}`);
};

export const GetAllDues= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/list-clinic-dues/?search=`
    );
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
