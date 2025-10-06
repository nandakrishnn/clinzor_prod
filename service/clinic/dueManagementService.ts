
import { axiosPrivate } from "../../axios/axios";


// Due Management Api 

export const approveOrRejectDue = async (id: string, body: {
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
export const deleteClinicDues = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}/`);
};
export const GetClinicDues = async (Id: string) => {
  const res = await axiosPrivate.get(`clinic/get-clinic-dues/${Id}/`);
  return res
};

export const GetAllClinicTransactions = async (
  clinicUuid: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  status: string = '',
  dateRange: string = 'all'
) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    // Always include the clinic UUID
    params.append('clinic_uuid', clinicUuid);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (dateRange && dateRange !== 'all') params.append('date_range', dateRange);

    const response = await axiosPrivate.get(`clinic/list-transactions/?transaction_type=DUE&${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch transactions", error);
    throw error;
  }
};
