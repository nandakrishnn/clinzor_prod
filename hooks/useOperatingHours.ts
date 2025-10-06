import { useState } from 'react';
import { OperatingHours } from '@/types/clinic';

export const useOperatingHours = (initialHours?: OperatingHours) => {
  const defaultHours: OperatingHours = {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '10:00', close: '14:00', closed: true }
  };

  const [operatingHours, setOperatingHours] = useState<OperatingHours>(initialHours || defaultHours);

  const handleHoursChange = (day: keyof OperatingHours, field: keyof OperatingHour, value: string | boolean) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const toggleDayClosed = (day: keyof OperatingHours) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], closed: !prev[day].closed }
    }));
  };

  return {
    operatingHours,
    setOperatingHours,
    handleHoursChange,
    toggleDayClosed
  };
};