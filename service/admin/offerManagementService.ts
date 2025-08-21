
import { axiosPrivate } from "../../axios/axios";

interface Offers {
  title: string;
  offer_type: 'ADMIN' | 'CLINIC' | 'PROMOTIONAL' | 'SYSTEM';
  description: string;
  valid_from: string;
  valid_to: string;
  discount_percentage: string | null;
   flat_discount_amt?: number | null ;
  max_use_limit: number;


  
  // Add other fields as needed
}

// Offers Management Api 
export const createOffers = async (body:Offers) => {
  try {
    const response = await axiosPrivate.post(
      `clinic/offer-lc/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("Organization creation error:", error);
    throw error;
  }
};
export const editOffers = async (
    id: string,
 body: Offers) => {
  try {
    const response = await axiosPrivate.put(
      `/clinic/offer-rud/${id}/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Organization update error:", error);
    throw error;
  }
};
export const approveOrRejectOffers = async (id: string, body: {
  status: string;
}) => {
  try {
    const response = await axiosPrivate.patch(`/clinic/offer-approve-or-reject/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};
export const deleteOffers = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/offer-rud/${Id}/`);
};

// Update the GetAllOffers function to accept filters
export const GetAllOffers = async (page: number, filters: any = {}) => {
  try {
    // Create params object with page and any filters
    const params: any = { page };
    
    // Add filters to params if they exist
    if (filters.search && filters.search.trim() !== '') {
      params.search = filters.search.trim();
    }
    if (filters.status && filters.status !== 'ALL') {
      params.status = filters.status;
    }
    if (filters.type && filters.type !== 'ALL') {
      params.offer_type = filters.type;
    }
    
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosPrivate.get(
      `clinic/offer-lc/?${queryString}`
    );
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error("Failed to fetch offers", error);
    throw error;
  }
};