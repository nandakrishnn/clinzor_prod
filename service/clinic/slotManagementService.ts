
import { axiosPrivate } from "../../axios/axios";

interface Slot {
  start_time: string;
  status?: string;
}

interface BulkSlotData {
  clinic: string;
  slot_type: string;
  slot_list: {
    start_time: string;
    end_time?: string; // Optional for HOME_VISIT
    max_bookings: number;
    is_video_call: boolean;
    is_home_visit: boolean;
    is_physical_visit: boolean;
    female_doctor_count?: number;
  }[];
}

// Slot Management Api 
export const createClinicSlot = async (body: Slot) => {
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

export const createClinicBlukSlot = async (body: BulkSlotData) => {
  try {
    const response = await axiosPrivate.post(
      `clinic/bulk-slot-create/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert creation error:", error);
    throw error;
  }
};

// In your slotManagementService.ts file
export const editClinicSlot = async (id: string, body: Partial<Slot>) => {
  try {
    const response = await axiosPrivate.put(
      `clinic/slot-rud/${id}/`,
      body
    );
    return response.data;
  } catch (error: any) {
    console.error("Slot update error:", error);

    // Throw the error with response data for better error handling
    if (error.response) {
      throw {
        response: {
          data: error.response.data,
          status: error.response.status
        }
      };
    }

    throw error;
  }
};

export const approveOrRejectClinicSlot = async (id: string, body: {
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

export const deleteClinicSlot = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/slot-rud/${Id}/`);
};

export const GetAClinicSlot = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/expert-slot-rud/${Id}`);
};

export const getClinicDataService = async () => {
  const res = await axiosPrivate.get(`clinic/get-clinic-by-user/`);
  return res?.data
};

export const GetAllClinicSlot = async (page: number) => {
  try {
    const response = await axiosPrivate.get(
      `clinic/slot-lc/?page=${page}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

