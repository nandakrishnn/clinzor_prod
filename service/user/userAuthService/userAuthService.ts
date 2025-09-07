import { axiosPrivate, axiosPublic } from "@/axios/axios";

// FInd user before login
export const findUsers = async (body: { phone_number: string }) => {
  const res = await axiosPublic.post(`/user/find-user/`, body);
  return res?.data
};

// send otp for login and registration
export const sendOTP = async (body: {
  phone_number: string;
}) => {
  try {
    const response = await axiosPublic.post(
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
  full_name?: string;
  email?: string;
  address?: string;
  dob?: string
  gender?: string
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