
import { axiosPrivate } from "../../axios/axios";

// FAQ Api
export const createFAQ = async (body: {
  question: string;
  answer: string;
  // Add other required fields as needed
}) => {
  try {
    const response = await axiosPrivate.post(
      `clinic/faq-lc/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("FAQ creation error:", error);
    throw error;
  }
};
export const editFAQ = async (
  id: string,
 body: {
  question: string;
  answer: string;
  // Add other required fields as needed
}) => {
  try {
    const response = await axiosPrivate.put(
      `clinic/faq-rud/${id}/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("User update error:", error);
    throw error;
  }
};
export const deleteFAQ = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/faq-rud/${Id}/`);
};
export const GetAFAQ = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/faq-rud/${Id}`);
};

export const GetAllFAQ = async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/faq-lc/`
    );
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
