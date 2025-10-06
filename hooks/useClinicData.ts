import { useState, useEffect } from 'react';
import { ClinicData, BackendClinic } from '@/types/clinic';
import useClinicByUser from '@/hooks/cilincHook/useClinicByUser';

export const useClinicData = () => {
  const { clinic, loading: isClinicLoading, error: clinicError } = useClinicByUser();
  const [clinicData, setClinicData] = useState<ClinicData>({
    name: '',
    email: '',
    phone: '',
    type: 'General Practice',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    about: '',
    insuranceNetworks: [],
    specialties: [],
    location: { lat: 0, lng: 0 },
    images: []
  });

  const parseCoordinates = (coordinatesString?: string): { lat: number; lng: number } => {
    if (!coordinatesString) return { lat: 8.5241, lng: 76.9366 };
    
    try {
      if (coordinatesString.includes('POINT')) {
        const match = coordinatesString.match(/POINT\(([^)]+)\)/);
        if (match) {
          const coords = match[1].split(' ');
          const lng = parseFloat(coords[0]);
          const lat = parseFloat(coords[1]);
          if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
        }
      }

      const coords = coordinatesString.trim().split(/\s+/);
      if (coords.length >= 2) {
        const lng = parseFloat(coords[0]);
        const lat = parseFloat(coords[1]);
        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
      }

      const commaCoords = coordinatesString.split(',');
      if (commaCoords.length === 2) {
        const lat = parseFloat(commaCoords[0].trim());
        const lng = parseFloat(commaCoords[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
      }
    } catch (error) {
      console.error('Error parsing coordinates:', error);
    }

    return { lat: 8.5241, lng: 76.9366 };
  };

  useEffect(() => {
    if (clinic) {
      const backendClinic = clinic as BackendClinic;
      const coordinates = parseCoordinates(backendClinic?.coordinates);

      setClinicData(prev => ({
        ...prev,
        name: backendClinic?.name || '',
        email: backendClinic?.email || '',
        phone: backendClinic?.contact_number || '',
        address: backendClinic?.address || '',
        city: backendClinic?.city || '',
        postalCode: backendClinic?.pincode?.toString() || '',
        about: backendClinic?.about_clinic || '',
        location: coordinates,
        uuid: backendClinic?.uuid || '',
        images: backendClinic?.images || [],
        status: backendClinic?.status || '',
        gstNo: backendClinic?.gst_no || '',
        foundedOn: backendClinic?.founded_on || null
      }));
    }
  }, [clinic]);

  // Input change handler
  const handleInputChange = (field: keyof ClinicData, value: string) => {
    setClinicData(prev => ({ ...prev, [field]: value }));
  };

  // Insurance functions
  const addInsurance = (newInsurance: string) => {
    if (newInsurance.trim() && !clinicData.insuranceNetworks.includes(newInsurance.trim())) {
      setClinicData(prev => ({
        ...prev,
        insuranceNetworks: [...prev.insuranceNetworks, newInsurance.trim()]
      }));
    }
  };

  const removeInsurance = (insurance: string) => {
    setClinicData(prev => ({
      ...prev,
      insuranceNetworks: prev.insuranceNetworks.filter(i => i !== insurance)
    }));
  };

  // Specialty functions
  const addSpecialty = (newSpecialty: string) => {
    if (newSpecialty.trim() && !clinicData.specialties.includes(newSpecialty.trim())) {
      setClinicData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
    }
  };

  const removeSpecialty = (specialty: string) => {
    setClinicData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  return {
    clinicData,
    setClinicData,
    isClinicLoading,
    clinicError,
    handleInputChange,
    addInsurance,
    removeInsurance,
    addSpecialty,
    removeSpecialty
  };
};