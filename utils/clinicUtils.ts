import { OperatingHours, TimingItem } from '@/types/clinic';

export const clinicTypes: string[] = [
  'General Practice',
  'Dental Clinic',
  'Specialty Clinic',
  'Urgent Care',
  'Hospital'
];

export const dayNames: Record<keyof OperatingHours, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

export const generateTimeOptions = () => {
  const timeOptions: { value: string; label: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = new Date(`2000-01-01T${time}:00`).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      timeOptions.push({ value: time, label: displayTime });
    }
  }
  return timeOptions;
};

export const transformOperatingHoursToAPI = (operatingHours: OperatingHours): TimingItem[] => {
  const daysMapping: Record<keyof OperatingHours, string> = {
    monday: 'monday',
    tuesday: 'tuesday',
    wednesday: 'wednesday',
    thursday: 'thursday',
    friday: 'friday',
    saturday: 'saturday',
    sunday: 'sunday'
  };

  const timingList: TimingItem[] = [];

  Object.entries(operatingHours).forEach(([day, hours]) => {
    if (!hours.closed && hours.open && hours.close) {
      timingList.push({
        day: daysMapping[day as keyof OperatingHours],
        opening_time: `${hours.open}:00`,
        closing_time: `${hours.close}:00`
      });
    }
  });

  return timingList;
};