import { axiosPrivate } from '@/axios/axios';
import { useState, useEffect } from 'react';

interface BackendClinic {
  name: string;
  email: string;
  contact_number: string;
  address: string;
  city: string;
  pincode: string;
  about_clinic: string;
  coordinates?: string;
  uuid?: string;
}
const useClinicByUser = () => {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClinicByUser = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`clinic/get-clinic-by-user/`);
      setClinic(response.data.data);
      setError(null);
    } catch (err:any) {
      console.error("Failed to fetch clinic", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicByUser();
  }, []);

  return { clinic, loading, error, refetch: fetchClinicByUser };
};

export default useClinicByUser;