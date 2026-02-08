
import { axiosPrivate } from "../../axios/axios";
interface Organization {
  created_by: string;
  privacy_policy: string;
  about_organization: string;
  free_expert_booking: number;
  expert_booking_charge: string;
  isPost:boolean

  
  // Add other fields as needed
}

// OrganizationManagement Api 
export const createOrganization = async (body:Organization) => {
  try {
    const response = await axiosPrivate.post(
      `clinic/org-detail-create/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("Organization creation error:", error);
    throw error;
  }
};


export const editOrganization = async (
 body: Organization) => {
  try {
    console.log("body",body)
    if(body.isPost){

      const response = await axiosPrivate.post(
      `clinic/org-detail-update/`,
      body
    );
    return response.data;

    }else{
      const response = await axiosPrivate.put(
      `clinic/org-detail-update/`,
      body
    );
    return response.data;
    }
  } catch (error) {
    
    console.error("Organization update error:", error);
    throw error;
  }
};
export const deleteOrganization = async (Id: string) => {
  return await axiosPrivate.delete(`user/blog-rud/${Id}/`);
};
export const GetAOrganization = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/faq-rud/${Id}`);
};

export const GetAllOrganization = async () => {
  try {
    const response = await axiosPrivate.get(
      `clinic/org-detail-get/`
    );
      const data =  response.data.data;
     return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Failed to fetch Organization", error);
    throw error;
  }
};
