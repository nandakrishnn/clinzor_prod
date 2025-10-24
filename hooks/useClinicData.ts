import { useState, useEffect } from 'react';
import { ClinicData, BackendClinic } from '@/types/clinic';
import useClinicByUser from '@/hooks/cilincHook/useClinicByUser';

export const useClinicData = () => {
  const { clinic, loading: isClinicLoading, error: clinicError } = useClinicByUser();
  const [clinicData, setClinicData] = useState<ClinicData>({
    uuid: '',
    name: '',
    email: '',
    phone: '',
    contact_number: '',
    country_code: '91',
    address: '',
    city: '',
    pincode: 0,
    landmark: '',
    map_link: '',
    coordinates: '',
    location: { lat: 8.5241, lng: 76.9366 }, // Default location
    about: '',
    about_clinic: '',
    gst_no: '',
    founded_on: null,
    status: '',
    is_active: false,
    languages: [],
    images: [],
    registration_certificate: null,
    reason_for_rejection: null
  });

  // Track if we have initial data loaded from backend
  const [hasInitialData, setHasInitialData] = useState(false);

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
      return { lat: 8.5241, lng: 76.9366 };
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return { lat: 8.5241, lng: 76.9366 };
    }
  };

  // Function to convert location object back to coordinates string
  const locationToCoordinatesString = (location: { lat: number; lng: number }): string => {
    return `SRID=4326;POINT (${location.lng} ${location.lat})`;
  };

  useEffect(() => {
    if (clinic && !hasInitialData) {
      const backendClinic = clinic as BackendClinic;
      const coordinates = parseCoordinates(backendClinic?.coordinates);

      setClinicData(prev => ({
        ...prev,
        uuid: backendClinic?.uuid || '',
        name: backendClinic?.name || '',
        email: backendClinic?.email || '',
        phone: backendClinic?.contact_number || '',
        contact_number: backendClinic?.contact_number || '',
        country_code: backendClinic?.country_code || '91',
        address: backendClinic?.address || '',
        city: backendClinic?.city || '',
        pincode: backendClinic?.pincode || 0,
        landmark: backendClinic?.landmark || '',
        map_link: backendClinic?.map_link || '',
        coordinates: backendClinic?.coordinates || locationToCoordinatesString(coordinates),
        location: coordinates,
        about: backendClinic?.about_clinic || '',
        about_clinic: backendClinic?.about_clinic || '',
        gst_no: backendClinic?.gst_no || '',
        founded_on: backendClinic?.founded_on || null,
        status: backendClinic?.status || '',
        is_active: backendClinic?.is_active || false,
        images: backendClinic?.images || [],
        registration_certificate: backendClinic?.registration_certificate || null,
        reason_for_rejection: backendClinic?.reason_for_rejection || null,
        specialties: [],
        languages: backendClinic?.languages || []
      }));
      
      setHasInitialData(true);
    }
  }, [clinic, hasInitialData]);

  // Input change handler with type safety
  const handleInputChange = (field: keyof ClinicData, value: any) => {
    setClinicData(prev => {
      // Handle location object separately
      if (field === 'location' && typeof value === 'object') {
        const newLocation = value;
        const newCoordinates = locationToCoordinatesString(newLocation);
        return { 
          ...prev, 
          location: newLocation,
          coordinates: newCoordinates
        };
      }

      // Handle languages array (comma separated string to array)
      if (field === 'languages' && typeof value === 'string') {
        return {
          ...prev,
          languages: value.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0)
        };
      }

      // Handle images array
      if (field === 'images' && Array.isArray(value)) {
        return { ...prev, images: value };
      }

      // Handle other fields
      return { ...prev, [field]: value };
    });
  };

  // Direct location update function that keeps coordinates in sync
  const updateLocation = (coords: { lat: number; lng: number }) => {
    setClinicData(prev => ({
      ...prev,
      location: coords,
      coordinates: locationToCoordinatesString(coords)
    }));
  };

  // NEW: Function to reset to backend data (useful when canceling edit)
  const resetToBackendData = () => {
    if (clinic) {
      const backendClinic = clinic as BackendClinic;
      const coordinates = parseCoordinates(backendClinic?.coordinates);
      
      setClinicData(prev => ({
        ...prev,
        location: coordinates,
        coordinates: backendClinic?.coordinates || locationToCoordinatesString(coordinates)
      }));
    }
  };

  return {
    clinicData,
    setClinicData,
    isClinicLoading,
    clinicError,
    handleInputChange,
    updateLocation,
    resetToBackendData // Export the reset function
  };
};