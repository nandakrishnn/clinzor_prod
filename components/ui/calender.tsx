import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isBefore,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { Button } from "./button";

interface CustomCalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date) => void;
  minDate?: Date; // Optional minimum selectable date
  maxDate?: Date; // Optional maximum selectable date
}

export const CustomCalendar = ({
  selectedDate,
  onSelect,
  minDate = startOfDay(new Date()), // Default to today
  maxDate, // Optional maximum date
}: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navigation controls with min/max date constraints
  const canNavigatePrev = !minDate || isBefore(minDate, monthStart);
  const canNavigateNext = !maxDate || isBefore(currentMonth, maxDate);

  // Get days from previous month to fill the first week
  const startDay = monthStart.getDay();
  const prevMonthDays =
    startDay === 0
      ? []
      : Array.from({ length: startDay }, (_, i) => {
        const date = new Date(monthStart);
        date.setDate(-i);
        return date;
      }).reverse();

  // Get days from next month to fill the last week
  const endDay = monthEnd.getDay();
  const nextMonthDays =
    endDay === 6
      ? []
      : Array.from({ length: 6 - endDay }, (_, i) => {
        const date = new Date(monthEnd);
        date.setDate(monthEnd.getDate() + i + 1);
        return date;
      });

  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

  const nextMonth = () => {
    if (canNavigateNext) {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const prevMonth = () => {
    if (canNavigatePrev) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  // Check if a date is selectable
  const isDateSelectable = (date: Date) => {
    const isInCurrentMonth = isSameMonth(date, currentMonth);
    const isNotBeforeMin = !minDate || !isBefore(date, minDate);
    const isNotAfterMax = !maxDate || !isBefore(maxDate, date);
    return isInCurrentMonth && isNotBeforeMin && isNotAfterMax;
  };

  return (
    <div className="w-full  bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={prevMonth}
          disabled={!canNavigatePrev}
          className={`p-1 rounded ${canNavigatePrev ? "hover:bg-gray-100" : "opacity-50"
            }`}
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="font-medium text-primaryColor">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={nextMonth}
          disabled={!canNavigateNext}
          className={`p-1 rounded ${canNavigateNext ? "hover:bg-gray-100" : "opacity-50"
            }`}
        >
          <svg
            className="w-5 h-5 text-primaryColor"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 p-2">
        {["S", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <div
            key={index}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {allDays.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelectable = isDateSelectable(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isDayToday = isToday(day);

          return (
            <button
              key={i}
              onClick={() => isSelectable && onSelect(day)}
              className={`h-8 w-8 rounded-full text-sm flex items-center justify-center mx-auto
                ${!isCurrentMonth ? "text-gray-400" : ""}
                ${!isSelectable ? "text-gray-300 cursor-not-allowed" : ""}
                ${isSelected ? "bg-primaryColor text-white" : ""}
                ${isDayToday && !isSelected && isSelectable ? "border border-black" : ""}
                ${isSelectable && !isSelected ? "hover:bg-gray-100" : ""}
              `}
              disabled={!isSelectable}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={() => onSelect(selectedDate || new Date())}
          className="w-full bg-primaryColor hover:bg-primaryColor text-white"
          disabled={!selectedDate}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};