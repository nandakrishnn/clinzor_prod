import { useState, useEffect } from 'react';
import { OperatingHours } from '@/types/clinic';
import { getOperatingHours } from '@/service/clinic/profileService';
import useClinicByUser from './cilincHook/useClinicByUser';

// Initial operating hours structure
const initialOperatingHours: OperatingHours = {
  monday: { open: '09:00', close: '17:00', closed: false, uuid: undefined },
  tuesday: { open: '09:00', close: '17:00', closed: false, uuid: undefined },
  wednesday: { open: '09:00', close: '17:00', closed: false, uuid: undefined },
  thursday: { open: '09:00', close: '17:00', closed: false, uuid: undefined },
  friday: { open: '09:00', close: '17:00', closed: false, uuid: undefined },
  saturday: { open: '09:00', close: '17:00', closed: false, uuid: undefined },
  sunday: { open: '09:00', close: '17:00', closed: true, uuid: undefined }
};

export const useOperatingHours = () => {
  const [operatingHours, setOperatingHours] = useState<OperatingHours>(initialOperatingHours);
  const [originalOperatingHours, setOriginalOperatingHours] = useState<OperatingHours>(initialOperatingHours);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [existingTimings, setExistingTimings] = useState<any[]>([]);

  // Load operating hours from API
  const loadOperatingHours = async (clinicId: any, apiData: any[] = []) => {
    try {
      const res = await getOperatingHours(clinicId)
      const data = res?.data?.data
      if (data.length > 0) {
        setExistingTimings(data);
        const formattedHours = formatApiDataToOperatingHours(data);
        setOperatingHours(formattedHours);
        setOriginalOperatingHours(formattedHours);
      } else {
        // Use initial data if no API data
        setOperatingHours(initialOperatingHours);
        setOriginalOperatingHours(initialOperatingHours);
      }
      setHasChanges(false);
    } catch (error) {
      console.error('Error loading operating hours:', error);
    }
  };

  // Format API data to our operating hours structure
  const formatApiDataToOperatingHours = (apiData: any[]): OperatingHours => {
    const formatted: OperatingHours = { ...initialOperatingHours };

    apiData.forEach(item => {
      const day = item.day.toLowerCase() as keyof OperatingHours;
      if (formatted[day]) {
        formatted[day] = {
          open: item.opening_time?.slice(0, 5) || '09:00', // Remove seconds
          close: item.closing_time?.slice(0, 5) || '17:00', // Remove seconds
          closed: false, // Assuming if there's an entry, it's not closed
          uuid: item.uuid
        };
      }
    });

    return formatted;
  };

  // Get UUID for a specific day
  const getTimingUuid = (day: keyof OperatingHours): string | undefined => {
    const timing = existingTimings.find(item =>
      item.day.toLowerCase() === day.toLowerCase()
    );
    return timing?.uuid;
  };

  // Handle hours change
  const handleHoursChange = (day: keyof OperatingHours, field: 'open' | 'close', value: string) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  // Toggle day closed
  const toggleDayClosed = (day: keyof OperatingHours) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        closed: !prev[day].closed
      }
    }));
  };

  // Reset changes
  const resetOperatingHoursChanges = () => {
    setOperatingHours(operatingHours);
    setHasChanges(false);
  };

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(operatingHours) !== JSON.stringify(originalOperatingHours);
    setHasChanges(changed);
  }, [operatingHours, originalOperatingHours]);

  return {
    operatingHours,
    handleHoursChange,
    toggleDayClosed,
    hasOperatingHoursChanged: hasChanges,
    resetOperatingHoursChanges,
    loadOperatingHours,
    getTimingUuid,
    existingTimings
  };
};