import { axiosPrivate } from "../../axios/axios";

interface Slot {
  valid_from: string;
  valid_to: string;
}

interface NewClinicOffer {
  name: string;
  email: string;
  phone: string;
  type: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  about: string;
  insuranceNetworks: string[];
  specialties: string[];
  location: {
    lat: number;
    lng: number;
  };
  // Add any additional fields from your backend
  landmark?: string;
  gstNo?: string;
  foundedOn?: string | null;
}
// Clinic-Service Management Api
export const createClinicOffers = async (body: NewClinicOffer) => {
  try {
    const response = await axiosPrivate.post(
      `/clinic/offer-lc/`, // Changed from PUT to POST for creation
      body
    );
    return response.data;
  } catch (error) {
    console.error("Expert creation error:", error);
    throw error;
  }
};

export const editClinicOffers = async (id: string, body: NewClinicOffer) => {
  try {
    const response = await axiosPrivate.put(`clinic/offer-rud/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("Expert update error:", error);
    throw error;
  }
};
export const approveOrRejectOffers = async (
  id: string,
  body: {
    status: string;
  }
) => {
  try {
    const response = await axiosPrivate.patch(
      `clinic/doctor-approval/${id}/`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};
export const deleteClinicOffers = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/offer-rud/${Id}/`);
};

export const GetAllClinicOffers = async () => {
  try {
    const response = await axiosPrivate.get(`clinic/offer-lc/`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
// export const GetAllClinicService = async (
//   clinicId?: string,
//   status?: string // Pass this if you want status filtering
// ) => {
//   try {
//     const params: string[] = [];
//     if (clinicId) params.push(`clinic=${encodeURIComponent(clinicId)}`);
//     if (status && status !== 'all') params.push(`status=${encodeURIComponent(status)}`);

//     const queryString = params.length ? `?${params.join('&')}` : '';
//     const response = await axiosPrivate.get(`/clinic/clinic-service-lc/${queryString}`);
//     return response.data.data;
//   } catch (error) {
//     console.error("Failed to fetch clinic services", error);
//     throw error;
//   }
// };

// export const Clinic_by_clinic_user = async () => {
//   try {
//     const response = await axiosPrivate.get(`clinic/get-clinic-by-user/`);
//     return response.data.data;
//   } catch (error) {
//     console.error("Failed to fetch users", error);
//     throw error;
//   }
// };
