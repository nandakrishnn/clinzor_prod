import React, { useState, useEffect } from 'react';

const ClinicScheduler = () => {
  const [activeDay, setActiveDay] = useState('Monday');
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; slot: string } | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  
  type SlotData = {
    [day: string]: {
      [slot: string]: number;
    };
  };
  
  const [slotData, setSlotData] = useState<SlotData>({});
  const [dayOffStatus, setDayOffStatus] = useState<{ [day: string]: boolean }>({});

  const [saveSettings, setSaveSettings] = useState<{ enabled: boolean; selectedDays: string[] }>({
    enabled: false,
    selectedDays: []
  });

  const [serviceTime, setServiceTime] = useState<{ [dateKey: string]: string }>({});

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  // Initialize current week to start from Monday
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday (0) as last day
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    setCurrentWeekStart(monday);
  }, []);

  // Get date for each weekday
  const getWeekDates = () => {
    const dates: { [key: string]: Date } = {};
    weekdays.forEach((day, index) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + index);
      dates[day] = date;
    });
    return dates;
  };

  const weekDates = getWeekDates();

  // Get current month info
  const getCurrentMonth = () => {
    const currentDate = weekDates[activeDay] || new Date();
    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      monthName: currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  };

  // Get all weeks in current month
  const getMonthWeeks = () => {
    const { month, year } = getCurrentMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Find the Monday of the week containing the first day
    const firstMonday = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    firstMonday.setDate(firstDay.getDate() + mondayOffset);

    const weeks = [];
    let currentWeek = new Date(firstMonday);

    while (currentWeek <= lastDay || currentWeek.getMonth() === month) {
      weeks.push(new Date(currentWeek));
      currentWeek.setDate(currentWeek.getDate() + 7);
      
      // Break if we've gone too far into next month
      if (currentWeek.getMonth() > month && currentWeek.getDate() > 7) break;
    }

    return weeks;
  };

  // Get all days in current month with their data
  const getMonthData = () => {
    const { month, year } = getCurrentMonth();
    const monthWeeks = getMonthWeeks();
    const monthData: { day: string; date: Date; dateKey: string; isCurrentMonth: boolean; slots: { [slot: string]: number; }; dayOff: boolean; totalSlots: number; }[][] = [];

    monthWeeks.forEach(weekStart => {
      const weekData: { day: string; date: Date; dateKey: string; isCurrentMonth: boolean; slots: { [slot: string]: number; }; dayOff: boolean; totalSlots: number; }[] = [];
      weekdays.forEach((dayName, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        
        const dateKey = date.toISOString().split('T')[0]; // Use ISO date as key
        const isCurrentMonth = date.getMonth() === month;
        
        weekData.push({
          day: dayName,
          date: date,
          dateKey: dateKey,
          isCurrentMonth: isCurrentMonth,
          slots: slotData[dateKey] || {},
          dayOff: dayOffStatus[dateKey] || false,
          totalSlots: Object.values(slotData[dateKey] || {}).reduce((sum, count) => sum + count, 0)
        });
      });
      monthData.push(weekData);
    });

    return monthData;
  };

  // Navigate to previous/next week
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  // Navigate to previous/next month
  const navigateMonth = (direction: 'prev' | 'next') => {
    const { month, year } = getCurrentMonth();
    const newDate = new Date(year, month + (direction === 'next' ? 1 : -1), 1);
    
    // Find the Monday of the first week
    const dayOfWeek = newDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    newDate.setDate(newDate.getDate() + mondayOffset);
    
    setCurrentWeekStart(newDate);
  };

  // Format date display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format week range
  const getWeekRange = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(currentWeekStart.getDate() + 6);
    return `${formatDate(currentWeekStart)} - ${formatDate(endDate)}`;
  };

  // Use date key for data operations
  const getDateKey = (day: string) => {
    return weekDates[day].toISOString().split('T')[0];
  };

  const getSlotCount = (day: string, slot: string) => {
    const dateKey = getDateKey(day);
    return slotData[dateKey]?.[slot] || 0;
  };

  const updateSlotCount = (day: string, slot: string, count: number) => {
    const dateKey = getDateKey(day);
    setSlotData(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [slot]: Math.max(0, count)
      }
    }));
  };

  const handleSlotClick = (slot: string) => {
    setSelectedSlot({ day: activeDay, slot });
  };

  const handleSlotSubmit = (count: number) => {
    if (selectedSlot) {
      updateSlotCount(selectedSlot.day, selectedSlot.slot, count);
      setSelectedSlot(null);
    }
  };

  const toggleDayOff = (day: string) => {
    const dateKey = getDateKey(day);
    setDayOffStatus(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  };

  const updateServiceTime = (day: string, time: string) => {
    const dateKey = getDateKey(day);
    setServiceTime((prev) => ({
      ...prev,
      [dateKey]: time
    }));
  };

  const toggleSaveDay = (day: string) => {
    setSaveSettings(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  // Save settings to selected days
  const handleSaveSettings = () => {
    if (!saveSettings.enabled || saveSettings.selectedDays.length === 0) return;

    const currentDateKey = getDateKey(activeDay);
    const currentDaySettings = {
      slots: slotData[currentDateKey] || {},
      dayOff: dayOffStatus[currentDateKey] || false
    };

    // Apply current day settings to selected days
    saveSettings.selectedDays.forEach(day => {
      const targetDateKey = getDateKey(day);
      
      // Copy slot data
      setSlotData(prev => ({
        ...prev,
        [targetDateKey]: { ...currentDaySettings.slots }
      }));

      // Copy day off status
      setDayOffStatus(prev => ({
        ...prev,
        [targetDateKey]: currentDaySettings.dayOff
      }));
    });

    // Reset save settings
    setSaveSettings({ enabled: false, selectedDays: [] });
    
    // Show success message
    alert(`Settings applied to ${saveSettings.selectedDays.join(', ')}`);
  };

  // Save entire week schedule
  const handleSaveWeekSchedule = () => {
    const weekSchedule = {
      weekStart: currentWeekStart.toISOString(),
      weekRange: getWeekRange(),
      schedule: weekdays.map(day => {
        const dateKey = getDateKey(day);
        return {
          day,
          date: weekDates[day].toISOString(),
          dateKey: dateKey,
          slots: slotData[dateKey] || {},
          dayOff: dayOffStatus[dateKey] || false,
          totalSlots: Object.values(slotData[dateKey] || {}).reduce((sum, count) => sum + count, 0)
        };
      })
    };

    console.log('Week Schedule:', weekSchedule);
    alert(`Week schedule saved!\nWeek: ${getWeekRange()}\nTotal scheduled slots: ${weekSchedule.schedule.reduce((sum, day) => sum + day.totalSlots, 0)}`);
  };

  // Save entire month schedule
  const handleSaveMonthSchedule = () => {
    const monthData = getMonthData();
    const { monthName } = getCurrentMonth();
    
    let totalSlots = 0;
    let totalDaysOff = 0;
    let scheduledDays = 0;

    const monthSchedule = {
      month: monthName,
      savedAt: new Date().toISOString(),
      weeks: monthData.map((week, weekIndex) => ({
        weekNumber: weekIndex + 1,
        days: week.map((dayData: { isCurrentMonth: any; totalSlots: number; dayOff: any; day: any; date: { toISOString: () => any; }; dateKey: any; slots: any; }) => {
          if (dayData.isCurrentMonth) {
            totalSlots += dayData.totalSlots;
            if (dayData.dayOff) totalDaysOff++;
            if (dayData.totalSlots > 0 || dayData.dayOff) scheduledDays++;
          }
          
          return {
            day: dayData.day,
            date: dayData.date.toISOString(),
            dateKey: dayData.dateKey,
            isCurrentMonth: dayData.isCurrentMonth,
            slots: dayData.slots,
            dayOff: dayData.dayOff,
            totalSlots: dayData.totalSlots
          };
        })
      })),
      summary: {
        totalSlots,
        totalDaysOff,
        scheduledDays,
        totalDaysInMonth: monthData.flat().filter(d => d.isCurrentMonth).length
      }
    };

    // Here you would typically send this to your backend
    console.log('Month Schedule:', monthSchedule);
    
    // Show detailed summary
    alert(`Month schedule saved for ${monthName}!\n\nSummary:\n• Total scheduled slots: ${totalSlots}\n• Days off: ${totalDaysOff}\n• Days with settings: ${scheduledDays}\n• Total days in month: ${monthSchedule.summary.totalDaysInMonth}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen rounded-3xl shadow-xl">
      {/* Header with Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Daily Slot Management</h1>
            <p className="text-gray-600">Manage your clinic's daily scheduling slots</p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'week' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week View
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'month' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month View
              </button>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => viewMode === 'week' ? navigateWeek('prev') : navigateMonth('prev')}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">←</span>
              </button>
              
              <div className="text-center">
                <div className="text-sm text-gray-500">
                  {viewMode === 'week' ? 'Week of' : 'Month'}
                </div>
                <div className="font-semibold text-gray-900">
                  {viewMode === 'week' ? getWeekRange() : getCurrentMonth().monthName}
                </div>
              </div>
              
              <button
                onClick={() => viewMode === 'week' ? navigateWeek('next') : navigateMonth('next')}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleSaveWeekSchedule}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save Week Schedule
          </button>
          <button
            onClick={handleSaveMonthSchedule}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Save Month Schedule
          </button>
        </div>
      </div>

      {/* Month Overview (when in month view) */}
      {viewMode === 'month' && (
        <div className="mb-8 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Month Overview - {getCurrentMonth().monthName}</h3>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekdays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-700 p-2">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
          {getMonthData().map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2 mb-2">
              {week.map((dayData: { isCurrentMonth: any; dayOff: any; totalSlots: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; date: { getDate: () => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; }, dayIndex: React.Key | null | undefined) => (
                <div
                  key={dayIndex}
                  className={`p-2 rounded text-center text-sm ${
                    dayData.isCurrentMonth
                      ? dayData.dayOff
                        ? 'bg-red-100 text-red-700'
                        : typeof dayData.totalSlots === 'number' && dayData.totalSlots > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-white border border-gray-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <div className="font-medium">{dayData.date?.getDate()?.toString()}</div>
                  {dayData.isCurrentMonth && typeof dayData.totalSlots === 'number' && dayData.totalSlots > 0 && (
                    <div className="text-xs mt-1">{dayData.totalSlots} slots</div>
                  )}
                  {dayData.isCurrentMonth && dayData.dayOff && (
                    <div className="text-xs mt-1">Off</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Weekday Tabs with Dates */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {weekdays.map((day) => {
            const date = weekDates[day];
            const isToday = date.toDateString() === new Date().toDateString();
            const dateKey = getDateKey(day);
            const totalSlots = Object.values(slotData[dateKey] || {}).reduce((sum, count) => sum + count, 0);
            
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeDay === day
                    ? 'border-blue-500 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className={isToday ? 'text-orange-600 font-semibold' : ''}>{day}</span>
                  <span className={`text-xs mt-1 ${isToday ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>
                    {formatDate(date)}
                  </span>
                  {totalSlots > 0 && (
                    <span className="text-xs text-blue-600 font-bold">{totalSlots} slots</span>
                  )}
                  {isToday && <span className="text-xs text-orange-600 font-bold">Today</span>}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Current Day Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-900">
              {activeDay}, {formatDate(weekDates[activeDay])}
            </h2>
            <p className="text-blue-700 text-sm">
              {weekDates[activeDay].toDateString() === new Date().toDateString() ? 'Today' : 
               weekDates[activeDay] < new Date() ? 'Past day' : 'Upcoming day'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-700">Total Slots</div>
            <div className="text-2xl font-bold text-blue-900">
              {Object.values(slotData[getDateKey(activeDay)] || {}).reduce((sum, count) => sum + count, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Time Slot Buttons */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Time Slots</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {timeSlots.map((slot) => {
            const count = getSlotCount(activeDay, slot);
            const dateKey = getDateKey(activeDay);
            const isDayOff = dayOffStatus[dateKey];
            
            return (
              <button
                key={slot}
                onClick={() => handleSlotClick(slot)}
                disabled={isDayOff}
                className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                  isDayOff
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 active:scale-95'
                }`}
              >
                <div className="text-sm font-medium">{slot}</div>
                {count > 0 && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                    {count}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Settings */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Day Settings</h3>
        {/* Day Off Checkbox */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id={`dayoff-${activeDay}`}
            checked={dayOffStatus[getDateKey(activeDay)] || false}
            onChange={() => toggleDayOff(activeDay)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor={`dayoff-${activeDay}`} className="ml-3 text-sm font-medium text-gray-700">
            Set as off day
          </label>
        </div>
        {/* Average Service Time Input */}
        <div className="flex items-center mb-4">
          <label htmlFor={`servicetime-${activeDay}`} className="text-sm font-medium text-gray-700 mr-3 min-w-[140px]">
            Average Service Time
          </label>
          <input
            id={`servicetime-${activeDay}`}
            type="text"
            value={serviceTime[getDateKey(activeDay)] || ''}
            onChange={e => updateServiceTime(activeDay, e.target.value)}
            placeholder="e.g. 45 min"
            className="flex-1 px-4 py-2 rounded-full border border-slate-200 bg-white/80 shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base text-slate-700 placeholder-slate-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Copy Settings to Other Days */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="save-enabled"
            checked={saveSettings.enabled}
            onChange={(e) => setSaveSettings(prev => ({ ...prev, enabled: e.target.checked }))}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="save-enabled" className="ml-3 text-sm font-medium text-gray-700">
            Copy current day settings to other days
          </label>
        </div>

        {saveSettings.enabled && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Select days to apply current settings:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {weekdays.filter(day => day !== activeDay).map((day) => (
                <label key={day} className="flex items-center p-2 rounded border hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={saveSettings.selectedDays.includes(day)}
                    onChange={() => toggleSaveDay(day)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {day} - {formatDate(weekDates[day])}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSaveSettings}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            saveSettings.enabled && saveSettings.selectedDays.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!saveSettings.enabled || saveSettings.selectedDays.length === 0}
        >
          Apply Settings
        </button>
      </div>

      {/* Slot Availability Popup */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Number of slots available
            </h3>
            
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-1">{selectedSlot.slot}</p>
              <p className="text-xs text-gray-500 mb-4">
                {selectedSlot.day}, {formatDate(weekDates[selectedSlot.day])}
              </p>
              <SlotStepper
                value={getSlotCount(selectedSlot.day, selectedSlot.slot)}
                onChange={(count: number) => handleSlotSubmit(count)}
                onClose={() => setSelectedSlot(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type SlotStepperProps = {
  value: number;
  onChange: (count: number) => void;
  onClose: () => void;
};

const SlotStepper: React.FC<SlotStepperProps> = ({ value, onChange, onClose }) => {
  const [count, setCount] = useState(value);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));

  const handleSubmit = () => {
    onChange(count);
    onClose();
  };

  return (
    <div>
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={decrement}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <span className="text-lg font-semibold text-gray-600">−</span>
        </button>
        
        <div className="text-2xl font-semibold text-gray-900 min-w-8 text-center">
          {count}
        </div>
        
        <button
          onClick={increment}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <span className="text-lg font-semibold text-gray-600">+</span>
        </button>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
        
        <button
          onClick={onClose}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ClinicScheduler;
