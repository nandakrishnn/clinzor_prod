"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CalendarProps {
  currentMonth: Date;
  selectedDate: string | null;
  changeMonth: (increment: number) => void;
  handleDateSelect: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  selectedDate,
  changeMonth,
  handleDateSelect,
}) => {
  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const prevMonthDays = firstDay.getDay();
    const nextMonthDays = 6 - lastDay.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
      days.push({
        date: new Date(year, month - 1, i),
        currentMonth: false,
        disabled: true
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        currentMonth: true,
        disabled: date < new Date(new Date().setHours(0, 0, 0, 0))
      });
    }
    
    // Next month days
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
        disabled: true
      });
    }
    
    return days;
  };

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  return (
    <div className="md:mb-8  w-full max-w-md">
      <div className="bg-white rounded-xl border overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-primaryColor text-white">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-1 rounded-full hover:bg-primaryColor transition-colors"
          >
            <FiChevronLeft size={20} />
          </button>
          
          <h3 className="text-lg font-semibold">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          
          <button 
            onClick={() => changeMonth(1)}
            className="p-1 rounded-full hover:bg-primaryColor transition-colors"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 bg-gray-100 p-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="text-sm font-medium text-gray-600 text-center py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 p-2">
          {daysInMonth.map((day, index) => {
            const isSelected = selectedDate === day.date.toISOString().split('T')[0];
            const isToday = day.date.toDateString() === new Date().toDateString();
            
            return (
              <button
                key={index}
                onClick={() => !day.disabled && handleDateSelect(day.date)}
                disabled={day.disabled}
                className={`
                  p-2 h-10 w-10 rounded-full text-center text-sm
                  ${day.disabled ? 'text-gray-300 cursor-default' : 'hover:bg-gray-100 cursor-pointer'} 
                  ${isSelected ? 'bg-primaryColor text-white hover:bg-primaryColor' : ''}
                  ${isToday && !isSelected ? 'border border-primaryColor' : ''}
                  ${!day.currentMonth ? 'text-gray-400' : 'text-gray-800'}
                  transition-colors duration-200
                `}
              >
                {day.date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};