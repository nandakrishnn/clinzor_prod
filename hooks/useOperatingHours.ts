import { useState, useEffect } from 'react';
import { OperatingHours } from '@/types/clinic';
import { getOperatingHours, updateOperatingHours, createOperatingHours } from '@/service/clinic/profileService';

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
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);

  // Load operating hours from API
  const loadOperatingHours = async (clinicId: string) => {
    try {
      const res = await getOperatingHours(clinicId);
      const data = res?.data?.data || [];
      
      if (data.length > 0) {
        setExistingTimings(data);
        setHasExistingData(true);
        const formattedHours = formatApiDataToOperatingHours(data);
        setOperatingHours(formattedHours);
        setOriginalOperatingHours(formattedHours);
      } else {
        // Use initial data if no API data
        setOperatingHours(initialOperatingHours);
        setOriginalOperatingHours(initialOperatingHours);
        setHasExistingData(false);
      }
      setHasChanges(false);
    } catch (error) {
      console.error('Error loading operating hours:', error);
      setHasExistingData(false);
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
          closed: item.is_closed || false,
          uuid: item.clinic_timing_uuid || item.uuid
        };
      }
    });

    return formatted;
  };

  // Transform operating hours to API format for update
  const transformOperatingHoursToAPI = (hours: OperatingHours, clinicId: string) => {
    const timingList = Object.entries(hours).map(([day, data]) => {
      const existingTiming = existingTimings.find(item => 
        item.day.toLowerCase() === day.toLowerCase()
      );

      return {
        day: day.toLowerCase(),
        opening_time: data.closed ? null : `${data.open}:00`,
        closing_time: data.closed ? null : `${data.close}:00`,
        is_closed: data.closed,
        clinic_timing_uuid: existingTiming?.clinic_timing_uuid || existingTiming?.uuid,
        clinic_uuid: clinicId
      };
    });

    return timingList;
  };

  // Transform operating hours to API format for create
  const transformOperatingHoursForCreate = (hours: OperatingHours, clinicId: string) => {
    const timingList = Object.entries(hours).map(([day, data]) => ({
      day: day.toLowerCase(),
      opening_time: data.closed ? null : `${data.open}:00`,
      closing_time: data.closed ? null : `${data.close}:00`,
      is_closed: data.closed
    }));

    return {
      clinic: clinicId,
      timing_list: timingList
    };
  };

  // Save operating hours (handles both create and update)
  const saveOperatingHoursToAPI = async (clinicId: string): Promise<boolean> => {
    try {
      let response;
      
      if (hasExistingData) {
        // Update existing operating hours
        const updateData = transformOperatingHoursToAPI(operatingHours, clinicId);
        response = await updateOperatingHours(updateData);
      } else {
        // Create new operating hours
        const createData = transformOperatingHoursForCreate(operatingHours, clinicId);
        response = await createOperatingHours(createData);
      }
      
      // FIX: Handle both response structures
      const successStatus = response.status === 200 || response.status === 201 || response.data?.status === 200;
      
      if (successStatus) {
        // FIX: Update the original operating hours to match current state
        setOriginalOperatingHours({...operatingHours});
        setHasChanges(false);
        
        // Reload the data to get updated UUIDs
        await loadOperatingHours(clinicId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error saving operating hours:', error);
      throw error;
    }
  };

  // Handle hours change
  const handleHoursChange = (day: keyof OperatingHours, field: 'open' | 'close', value: string) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
        closed: false // Automatically uncheck closed when changing hours
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

  // Reset changes - FIXED: Reset to original data
  const resetOperatingHoursChanges = () => {
    setOperatingHours({...originalOperatingHours});
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
    saveOperatingHours: saveOperatingHoursToAPI,
    hasExistingOperatingHours: hasExistingData,
    existingTimings
  };
};