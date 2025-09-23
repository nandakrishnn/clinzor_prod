import { User } from "@/types/user";
import { axiosPrivate } from "../../axios/axios";
import { getSession } from "next-auth/react";
import { baseUrl } from "@/utils/Endpoint";

// users
export const updateUserStatus = async (
  id: string,
  body: {
    is_blocked: boolean;
    reason_for_block?: string;
  }
) => {
  try {
    const response = await axiosPrivate.patch(`user/user-block/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};
export const editUser = async (
  id: string,
  body: Partial<User>
) => {
  try {
    const response = await axiosPrivate.patch(
      `customer/update-customer-detail/${id}/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("User update error:", error);
    throw error;
  }
};
export const deleteUser = async (Id: string) => {
  return await axiosPrivate.delete(`user/user-delete/${Id}/`);
};
export const GetAUser = async (Id: string) => {
  return await axiosPrivate.delete(`user/user-detail/${Id}`);
};
export const getUserAdminDashboard = async () => {
  const res = await axiosPrivate.get(`clinic/user-tab-analytics/`);
  return res?.data
};

export const GetAllUsers = async (params: any = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosPrivate.get(`user/user-list/?${queryString}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};