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
export const createClinicOffers = async (body: any) => {
  try {
    const response = await axiosPrivate.post(
      `/clinic/offer-lc/`, 
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

// service/clinic/clinicOfferManagementService.ts

export const GetAllClinicOffers = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  status: string = '',
  service: string = '',
  dateFrom: string = '',
  dateTo: string = '',
  liveOnly: boolean = false
) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (service) params.append('clinic_service', service);
    if (dateFrom) params.append('from_date', dateFrom);
    if (dateTo) params.append('to_date', dateTo);
    if (liveOnly) params.append('live_only', 'true');

    const response = await axiosPrivate.get(`clinic/offer-lc/?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch offers", error);
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
