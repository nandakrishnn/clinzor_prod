import { ClinicService } from '@/types/common';
import React, { useState } from 'react';

interface SlotPatternGeneratorProps {
  clinicServices: ClinicService[];
}

const SlotPatternGenerator: React.FC<SlotPatternGeneratorProps> = ({ clinicServices }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [slotsByDay, setSlotsByDay] = useState<{ [day: string]: { [time: string]: number } }>({});
  const [showSlotModal, setShowSlotModal] = useState<{ time: string, count: number } | null>(null);
  const [averageServiceTime, setAverageServiceTime] = useState(45);
  const [offDays, setOffDays] = useState<string[]>([]);
  const [patternSaveOption, setPatternSaveOption] = useState<'all' | 'week' | 'month' | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState(clinicServices[0]?.id || '');

  const timeSlots = [];
  for (let h = 8; h < 21; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  timeSlots.push('21:00');

  const selectedDay = daysOfWeek[selectedDayIdx];
  const slotsForDay = slotsByDay[selectedDay] || {};
  const isOffDay = offDays.includes(selectedDay);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleSlotClick = (time: string) => {
    setShowSlotModal({ time, count: slotsForDay[time] || 1 });
  };

  const handleSlotModalSubmit = () => {
    if (!showSlotModal) return;
    setSlotsByDay(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [showSlotModal.time]: showSlotModal.count
      }
    }));
    setShowSlotModal(null);
    showNotif(`Slot for ${showSlotModal.time} set (${showSlotModal.count}x) for ${selectedDay} [${getServiceName(selectedService)}]`);
  };

  const handleOffDayChange = (checked: boolean) => {
    setOffDays(prev => checked ? [...prev, selectedDay] : prev.filter(d => d !== selectedDay));
  };

  function getServiceName(id: string) {
    return clinicServices.find(s => s.id === id)?.name || 'Unknown';
  }

  const handlePatternSave = (option: 'all' | 'week' | 'month') => {
    setPatternSaveOption(option);
    let newSlotsByDay = { ...slotsByDay };
    let newOffDays = [...offDays];
    if (option === 'all' || option === 'month') {
      daysOfWeek.forEach(day => {
        newSlotsByDay[day] = { ...slotsForDay };
        if (isOffDay) {
          if (!newOffDays.includes(day)) newOffDays.push(day);
        } else {
          newOffDays = newOffDays.filter(d => d !== day);
        }
      });
      showNotif(`Pattern saved for all days [${getServiceName(selectedService)}]`);
    } else if (option === 'week') {
      daysOfWeek.slice(0, 5).forEach(day => {
        newSlotsByDay[day] = { ...slotsForDay };
        if (isOffDay) {
          if (!newOffDays.includes(day)) newOffDays.push(day);
        } else {
          newOffDays = newOffDays.filter(d => d !== day);
        }
      });
      showNotif(`Pattern saved for week (Mon-Fri) [${getServiceName(selectedService)}]`);
    }
    setSlotsByDay(newSlotsByDay);
    setOffDays(newOffDays);
  };

  return (
    <div className="space-y-8">
      {notification && (
        <div className="w-full bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl px-2 py-2 sm:px-4 sm:py-2 font-semibold text-center mb-4 animate-fade-in text-base shadow">
          {notification}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
        <label className="text-base font-semibold min-w-max">Select Service:</label>
        <select
          value={selectedService}
          onChange={e => setSelectedService(e.target.value)}
          className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border rounded-xl text-sm sm:text-base bg-white shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 min-w-[120px]"
        >
          {clinicServices.map(service => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 overflow-x-auto">
        <button onClick={() => setSelectedDayIdx((selectedDayIdx + 6) % 7)} className="px-2 py-2 sm:px-3 sm:py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold shadow-sm min-w-[44px]">&#8592;</button>
        {daysOfWeek.map((day, idx) => (
          <button
            key={day}
            onClick={() => setSelectedDayIdx(idx)}
            className={`px-2 py-2 sm:px-4 sm:py-2 rounded-full font-semibold text-sm sm:text-base mx-0.5 sm:mx-1 transition-all duration-150 shadow-sm min-w-[44px] ${selectedDayIdx === idx ? 'bg-blue-600 text-white scale-105' : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50'}`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
        <button onClick={() => setSelectedDayIdx((selectedDayIdx + 1) % 7)} className="px-2 py-2 sm:px-3 sm:py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold shadow-sm min-w-[44px]">&#8594;</button>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <input type="checkbox" checked={isOffDay} onChange={e => handleOffDayChange(e.target.checked)} id="offday" className="w-5 h-5 rounded border-gray-300 focus:ring-blue-500" />
        <label htmlFor="offday" className="text-sm sm:text-base font-medium">Is it an off day?</label>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 mb-6">
        {timeSlots.map(time => (
          <button
            key={time}
            disabled={isOffDay}
            onClick={() => handleSlotClick(time)}
            className={`h-12 w-full sm:h-14 sm:w-24 rounded-2xl border text-sm sm:text-base font-semibold flex flex-col items-center justify-center transition-all duration-150 shadow-sm
              ${isOffDay ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' :
                slotsForDay[time] ? 'bg-emerald-500 text-white border-emerald-600 scale-105' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 active:scale-95'}`}
            style={{ fontFamily: 'SF Pro Display, Inter, Arial, sans-serif', minHeight: 44 }}
          >
            {time}
            {slotsForDay[time] && <span className="text-xs font-bold mt-1">{slotsForDay[time]}x</span>}
          </button>
        ))}
      </div>
      
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2 sm:px-0">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-md md:w-96 px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center border border-gray-100" style={{ fontFamily: 'SF Pro Display, Inter, Arial, sans-serif' }}>
            <button onClick={() => setShowSlotModal(null)} className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xl shadow-sm" aria-label="Close">
              <span style={{ fontWeight: 700, fontSize: 22 }}>&times;</span>
            </button>
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 text-center tracking-tight">{showSlotModal.time}</h3>
            <div className="flex items-center gap-4 sm:gap-6 mb-8">
              <button onClick={() => setShowSlotModal(s => s && { ...s, count: Math.max(1, s.count - 1) })} className="px-4 py-3 sm:px-5 sm:py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-bold shadow min-w-[44px]">-</button>
              <span className="text-3xl sm:text-4xl font-bold w-12 sm:w-16 text-center text-gray-800 select-none">{showSlotModal.count}</span>
              <button onClick={() => setShowSlotModal(s => s && { ...s, count: s.count + 1 })} className="px-4 py-3 sm:px-5 sm:py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-bold shadow min-w-[44px]">+</button>
            </div>
            <button onClick={handleSlotModalSubmit} className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition mb-2 shadow">Submit</button>
            <button onClick={() => setShowSlotModal(null)} className="w-full text-gray-500 py-3 rounded-2xl hover:bg-gray-100 transition text-base">Cancel</button>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mb-4">
        <label className="text-base font-medium min-w-max">Enter average service time:</label>
        <input
          type="number"
          min={1}
          value={averageServiceTime}
          onChange={e => setAverageServiceTime(Number(e.target.value))}
          className="w-full sm:w-24 px-3 py-2 border rounded-xl text-base shadow-sm"
        />
        <span className="text-base text-gray-500">min</span>
      </div>
      
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mt-4">
        {['all', 'week', 'month'].map(option => (
          <button
            key={option}
            onClick={() => handlePatternSave(option as 'all' | 'week' | 'month')}
            className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-2xl font-semibold border transition-all duration-150 flex items-center gap-2 text-base shadow-sm
              ${patternSaveOption === option ?
                option === 'all' ? 'bg-blue-600 text-white border-blue-700' :
                option === 'week' ? 'bg-emerald-600 text-white border-emerald-700' :
                'bg-purple-600 text-white border-purple-700'
                :
                option === 'all' ? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200' :
                option === 'week' ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200' :
                'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200'}
            `}
          >
            {patternSaveOption === option && <span className="text-lg font-bold">✓</span>}
            {option === 'all' ? 'Save for all days' : option === 'week' ? 'Save for week' : 'Save for month'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SlotPatternGenerator;