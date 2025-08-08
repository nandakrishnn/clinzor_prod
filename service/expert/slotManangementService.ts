
import { axiosPrivate } from "../../axios/axios";

interface Slot {
  start_time: string;
  status?: string;
}

interface BulkSlotData {
  slot_list: { start_time: string }[];
}

// Slot Management Api 
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

export const GetAllSlot= async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/expert-slot-lc/`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
