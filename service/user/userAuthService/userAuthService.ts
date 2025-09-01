import { axiosPrivate } from "@/axios/axios";


export const findUsers = async (phone_number: string) => {
  return await axiosPrivate.get(`/user/find-user/`, {
    params: {
      phone_number
    }
  });
};

export const sendOTP = async (body: {
  phone_number: string;

}) => {
  try {
    const response = await axiosPrivate.post(
      `/user/send-otp/`, 
      body
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send OTP error:", error);
    throw error;
  }
};
export const verifyOTP = async (body: {
  otp: string;
  refrence_id: string;
  full_name: string;
  email: string;
  address: string;

}) => {
  try {
    const response = await axiosPrivate.post(
      `/user/validate-otp/`, 
      body
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send OTP error:", error);
    throw error;
  }
};