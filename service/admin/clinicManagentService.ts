
import { axiosPrivate, axiosPublic } from "../../axios/axios";


// Clinic

export const createClinic = async (clinicData: {
  name: string;
  email: string;
  pincode: string;
  landmark: string;
  phone: string;
  city: string;
  address?: string;
  map_link?: string;
  gps_coordinates?: string;
  gst_no?: string;
  about_clinic?: string;
  registration_certificate?: string;
  images: string[];

}) => {
  try {
    const response = await axiosPrivate.post('/clinic/', {
      name: clinicData.name,
      address: clinicData.address,
      pincode: clinicData.pincode,
      landmark: clinicData.landmark,
      map_link: clinicData.map_link,
      coordinates: `POINT(${clinicData.gps_coordinates})`,
      city: clinicData.city,
      email: clinicData.email,
      gst_no: clinicData.gst_no,
      registration_certificate: clinicData.registration_certificate,
      about_clinic: clinicData.about_clinic,
      images: clinicData.images,
      contact_number: clinicData.phone,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating clinic:", error);
    throw error;
  }
};

export const createUserForClinic = async (clinicData: {
  clinic: string;
  full_name: string;
  email: string;
  phone_number: string;
  password: string;

}) => {
  try {
    const response = await axiosPrivate.post('clinic/clinic-user-create/', {
      clinic: clinicData.clinic,
      full_name: clinicData.full_name,
      email: clinicData.email,
      password: clinicData.password,
      phone_number: clinicData.phone_number,

    });
    return response.data;
  } catch (error) {
    console.error("Error creating clinic:", error);
    throw error;
  }
};

export const approveOrRejectClinic = async (id: string, body: {
  status: string;
}) => {
  try {
    const response = await axiosPrivate.patch(`clinic/clinic-approval/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};
export const approveOrRejectService = async (id: string, body: any) => {
  try {
    const response = await axiosPrivate.patch(`clinic/clinic-service-approval/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};

export const toggleActiveClinic = async (id: string, body: {
  is_active: boolean;
}) => {
  try {
    const response = await axiosPrivate.patch(`clinic/clinic-patch/${id}/`, body);
    return response.data;
  } catch (error) {
    console.error("User status update error:", error);
    throw error;
  }
};

export const deleteClinic = async (Id: string) => {
  return await axiosPrivate.delete(`/clinic/clinic-service-rud/${Id}/`);
};

export const deleteClinicByKey = async (Id: string, deletionKey: string) => {
  return await axiosPrivate.delete(`/clinic/clinic-rud/${Id}/`, {
    data: {
      deletion_key: deletionKey
    }
  });
};

export const getAClinic = async (Id: string) => {
  return await axiosPrivate.get(`clinic/clinic-rud/${Id}`);


};
export const getClinicDoctors = async (Id: string, status?: string ) => {
  const res = await axiosPrivate.get(`clinic/doctor-lc/?clinic=${Id}&status=${status}`);
  return res?.data
};
export const getAClinicService = async (Id: string) => {
  return await axiosPublic.get(`clinic/clinic-detail/${Id}`);
};



export const getAllClinic = async (params: any = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosPrivate.get(`clinic/?${queryString}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
export const getClinicService = async (params: any = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosPrivate.get(`clinic/clinic-service-lc/?${queryString}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

export const getAdminClinicStaticData = async () => {
  const res = await axiosPrivate.get('clinic/clinic-tab-analytics/')
  return res?.data
}
export const getClinicIndStaticData = async () => {
  const res = await axiosPrivate.get('clinic/clinic-tab-analytics/')
  return res?.data
}
export const getClinicServiceData = async (id: string, status?: string) => {
  console.log(id)
  const res = await axiosPrivate.get(`clinic/clinic-service-lc/?clinic=${id}&status=${status}`)
  return res?.data?.data
}

export const getClinicTimingServiceData = async (id: string) => {
  console.log(id)
  const res = await axiosPrivate.get(`clinic/clinic-timing-list/${id}`)
  return res?.data?.data
}

// In your clinicManagentService.ts file
export const GetAllDoctor = async (page: number, clinicId?: string, status?: string) => {
  try {
    const params: any = { page };

    if (clinicId) {
      params.clinic = clinicId;
    }
    if (status) {
      params.status = status;
    }

    const queryString = new URLSearchParams(params).toString();
    const response = await axiosPrivate.get(`/clinic/doctor-lc/?${queryString}`);
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch doctors", error);
    throw error;
  }
};

export const GetAllSpecialties = async (page: number, clinicId?: string, status?: string) => {
  try {
    const params: any = { page };

    if (clinicId) {
      params.clinic = clinicId;
    }
    if (status) {
      params.status = status;
    }

    const queryString = new URLSearchParams(params).toString();
    const response = await axiosPrivate.get(`/clinic/service-lc/?${queryString}`);
    return response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch services", error);
    throw error;
  }
};

// service functions for doctor management
export const getClinicDoctor = async (params: any) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axiosPrivate.get(`clinic/doctor-lc/?${queryString}`);
  return response.data.data;
};

export const approveOrRejectDoctor = async (doctorUuid: string, data: { status: string; reason_for_rejection?: string }) => {
  const response = await axiosPrivate.patch(`clinic/doctor-approval/${doctorUuid}/`, data);
  return response.data;
};