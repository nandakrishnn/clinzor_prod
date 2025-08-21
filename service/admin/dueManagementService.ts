
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
export const deleteDue = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}/`);
};
export const GetADue = async (Id: string) => {
  return await axiosPrivate.delete(`clinic/doctor-rud/${Id}`);
};

export const GetAllDues = async (page: number, search: string = '', filter: string = 'all', sort: string = 'default') => {
  try {
    const params: any = {
      page: page
    };

    // Add search parameter if provided
    if (search) {
      params.search = search;
    }

    // Add filter parameter if provided and not 'all'
    if (filter !== 'all') {
      params.status = filter;
    }

    // Add sort parameter if provided and not 'default'
    if (sort !== 'default') {
      params.sort = sort;
    }

    const response = await axiosPrivate.get('clinic/list-clinic-dues/', {
      params: params
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch dues data", error);
    throw error;
  }
};
export const GetAllPayment = async (page: number, search: string = '', filter: string = 'all', sort: string = 'default') => {
  try {
    const params: any = {
      page: page
    };

    // Add search parameter if provided
    if (search) {
      params.search = search;
    }

    // Add filter parameter if provided and not 'all'
    if (filter !== 'all') {
      params.status = filter;
    }

    // Add sort parameter if provided and not 'default'
    if (sort !== 'default') {
      params.sort = sort;
    }

    const response = await axiosPrivate.get('/clinic/payment-transaction-list/', {
      params: params
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch dues data", error);
    throw error;
  }
};