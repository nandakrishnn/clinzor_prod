import { User } from "@/types/user";
import  { axiosPrivate } from "../../axios/axios";


export const updateUserStatus= async (id :string) => {
  try {
    console.log(id,"planner")
    const response = await axiosPrivate.patch(`user/user-block/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to update workout plan", error);
    throw error;
  }
};

export const deleteUser= async (Id:string) => {
  return await axiosPrivate.delete(`user/user-delete/${Id}`);
};
export const GetAUser= async (Id:string) => {
  return await axiosPrivate.delete(`user/user-detail/${Id}`);
};

export const GetAllUsers = async (page_size:number) => {
  const response = await axiosPrivate.get(`user/user-list/?page_size=5`);
  console.log(response, "All Users Data");
  return response.data;
};