import * as LucideIcons from 'lucide-react';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusConfig = (status: string) => {
  const statusConfigs: Record<string, { color: string; dot: string; icon: string }> = {
    COMPLETED: {
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      dot: 'bg-emerald-500',
      icon: 'CheckCircle'
    },
    PENDING: {
      color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      dot: 'bg-amber-500',
      icon: 'Clock'
    },
    CREATED: {
      color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      dot: 'bg-amber-500',
      icon: 'Clock'
    },
    FAILED: {
      color: 'bg-red-500/10 text-red-700 border-red-500/20',
      dot: 'bg-red-500',
      icon: 'AlertCircle'
    },
    ACTIVE: {
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      dot: 'bg-emerald-500',
      icon: 'CheckCircle'
    },
    INACTIVE: {
      color: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
      dot: 'bg-slate-500',
      icon: 'Clock'
    },
    SUSPENDED: {
      color: 'bg-red-500/10 text-red-700 border-red-500/20',
      dot: 'bg-red-500',
      icon: 'AlertCircle'
    },
    NEW: {
      color: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      dot: 'bg-blue-500',
      icon: 'Clock'
    },
    CANCELLED: {
      color: 'bg-red-500/10 text-red-700 border-red-500/20',
      dot: 'bg-red-500',
      icon: 'X'
    }
  };

  return statusConfigs[status] || {
    color: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
    dot: 'bg-slate-500',
    icon: 'AlertCircle'
  };
};

// Helper function to get the icon component
export const getStatusIcon = (iconName: string): React.ComponentType<any> => {
  return LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any> || LucideIcons.AlertCircle;
};

export const formatLocalDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T00:00:00`;   // local midnight
};

export const convertTo12HourFormat = (utcDateString: string) => {
  const date = new Date(utcDateString);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${hh}:${mm} ${ampm}`;
};


// Convert 24-hour format to 12-hour format for display
export const convertTo12HourFormatN = (time24: string): string => {
  if (!time24) return '';

  try {
    const [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');
    return `${hours12}:${minutesStr} ${ampm}`;
  } catch (error) {
    console.error('Error converting time to 12-hour format:', error);
    return time24;
  }
};

// Convert 12-hour format to 24-hour format for API
export const convertTo24HourFormat = (time12: string): string => {
  if (!time12) return '';

  try {
    const time = time12.trim();
    const [timePart, ampm] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);

    let hours24 = hours;

    if (ampm?.toUpperCase() === 'PM' && hours !== 12) {
      hours24 = hours + 12;
    } else if (ampm?.toUpperCase() === 'AM' && hours === 12) {
      hours24 = 0;
    }

    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting time to 24-hour format:', error);
    return time12;
  }
};

// Generate time options in 12-hour format for dropdown
export const generate12HourTimeOptions = () => {
  const options = [];

  // Add times for AM
  for (let hour = 0; hour < 12; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const displayHour = hour === 0 ? 12 : hour;
      const timeString = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const value24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push({
        value: value24, // Store as 24-hour for API
        label: `${timeString} AM` // Display as 12-hour
      });
    }
  }

  // Add times for PM
  for (let hour = 12; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const displayHour = hour === 12 ? 12 : hour - 12;
      const timeString = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const value24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push({
        value: value24, // Store as 24-hour for API
        label: `${timeString} PM` // Display as 12-hour
      });
    }
  }

  return options;
};

// Format time for API (ensure it has seconds)
export const formatTimeForAPI = (time: string): string => {
  return time.includes(':') ? `${time}:00` : time;
};

export const formatDateTime = (startTime: string, endTime: string) => {
  const start = new Date(startTime);

  const date = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const time = `${convertTo12HourFormat(startTime)} – ${convertTo12HourFormat(endTime)}`;

  return { date, time };
};

export const parse12HourFormat = (time12Hour: string, originalDate: Date): Date => {
  const [timePart, ampm] = time12Hour.split(' ');
  const [hours, minutes] = timePart.split(':').map(Number);

  let hour24 = hours;

  if (ampm === 'PM' && hours !== 12) {
    hour24 = hours + 12;
  } else if (ampm === 'AM' && hours === 12) {
    hour24 = 0;
  }

  // Use the original date but set the time from 12-hour format
  const newDate = new Date(originalDate);
  newDate.setHours(hour24, minutes, 0, 0);

  return newDate;
};