
import { axiosPrivate } from "../../axios/axios";

interface Slot {
  start_time: string;
  status?: string;
}

interface BulkSlotData {
  slot_list: { start_time: string }[];
}
export interface AddSuggestion {
  services: string[]; // Array of service UUIDs

}
// Booking Management Api 
export const createSlot = async (body:Slot) => {
  try {
    const response = await axiosPrivate.post(
      `clinic/expert-slot-lc/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert creation error:", error);
    throw error;
  }
};
export const createBlukSlot = async (body:BulkSlotData) => {
  try {
    const response = await axiosPrivate.post(
      `clinic/expert-bulk-slot-create/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert creation error:", error);
    throw error;
  }
};
export const editSlot = async (
  id: string,
 body: Slot) => {
  try {
    const response = await axiosPrivate.put(
      `clinic/expert-slot-rud/${id}/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};
export const approveOrRejectSlot = async (id: string, body: {
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
export const deleteSlot = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/expert-slot-rud/${Id}/`);
};
export const GetASlot = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/expert-slot-rud/${Id}`);
};

export const GetAllExpertBooking= async () => {
  try {
    const response = await axiosPrivate.get(
      `customer/expert-booking-lc/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

export const GetAExpertBookingDetails= async (Id: string) => {
  return await axiosPrivate.delete(`customer/expert_booking_info/${Id}`);
};


export const addSuggestion = async (
  id: string,
 body: AddSuggestion) => {
  try {
    const response = await axiosPrivate.patch(
      `clinic/expert-suggestion-create/${id}/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};