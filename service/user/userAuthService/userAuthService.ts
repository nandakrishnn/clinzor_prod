import { axiosPrivate, axiosPublic } from "@/axios/axios";


export const findUsers = async (body: { phone_number: string }) => {
  return await axiosPublic.post(`/user/find-user/`, body);
};

export const sendOTP = async (body: {
  phone_number: string;
}) => {
  try {
    const response = await axiosPublic.post(
      `/user/send-otp/`,
      body
    );
    console.log(response?.data, "fromt he otp send option")
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
    const response = await axiosPublic.post(
      `/user/validate-otp/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send OTP error:", error);
    throw error;
  }
};