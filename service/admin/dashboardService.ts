import { axiosPrivate } from "@/axios/axios";
// Dashboard Service

export const GetAllUsertabAnalytics= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/user-tab-analytics/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const GetAllExperttabAnalytics= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/expert-user-analytics/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const GetAllBookingtabAnalytics= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/booking-tab-analytics/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const GetAllDueRecievedtabAnalytics= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/dues-recieved-summary/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const GetAllDuetabAnalytics= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/dues-management-analytics/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const GetAllTopBooked= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/top-booked-service/?search=heart`
    );
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const GetAllMostBookedAreas= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/most-booked-areas/?search=indore`
    );
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const GetUserGrowthTrend= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/user-growth-trend/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const GetBookingWeeklyTrend= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/booking-trend/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const GetExpertSlotUtilization= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/expert-insight/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
