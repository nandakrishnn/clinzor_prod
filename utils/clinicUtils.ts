import { OperatingHours, TimingItem } from '@/types/clinic';
import { formatTimeForAPI } from './formatters';

export const clinicTypes: string[] = [
  'General Practice',
  'Dental Clinic',
  'Specialty Clinic',
  'Urgent Care',
  'Hospital'
];

export const getTransactionTypeConfig = (type: string) => {
  switch (type) {
    case 'DUE':
      return { color: 'bg-red-500/10 text-red-700 border-red-500/20', label: 'Due' };
    case 'PAID':
      return { color: 'bg-green-500/10 text-green-700 border-green-500/20', label: 'Paid' };
    case 'PAYMENT':
      return { color: 'bg-blue-500/10 text-blue-700 border-blue-500/20', label: 'Payment' };
    default:
      return { color: 'bg-gray-500/10 text-gray-700 border-gray-500/20', label: type };
  }
};

// Alternative approach that handles closed days by including them with null times
export const transformOperatingHoursToAPI = (operatingHours: any, clinicId: any) => {
  const timingList: any[] = [];

  Object.entries(operatingHours).forEach(([day, hours]: [string, any]) => {

    console.log(hours, 'timing')

    if (!hours.closed) {
      timingList.push({
        day: day.toLowerCase(),
        opening_time: formatTimeForAPI(hours.open),
        closing_time: formatTimeForAPI(hours.close),
        clinic_timing_uuid: hours?.uuid,
        clinic_uuid: clinicId
      });
    } else {
      // For closed days, you might want to send null times or handle differently
      // depending on your API requirements
      timingList.push({
        day: day.toLowerCase(),
        opening_time: null,
        closing_time: null,
        clinic_timing_uuid: operatingHours?.uuid,
        clinic_uuid: clinicId
      });
    }
  });

  return timingList;
};


export const dayNames: { [key: string]: string } = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

export const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push({
        value: timeString,
        label: timeString
      });
    }
  }
  return options;
};
