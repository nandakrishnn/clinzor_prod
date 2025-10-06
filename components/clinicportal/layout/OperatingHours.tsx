import React from 'react';
import { Clock } from 'lucide-react';
import { OperatingHours as OperatingHoursType } from '@/types/clinic';
import { dayNames, generateTimeOptions } from '@/utils/clinicUtils';

interface OperatingHoursProps {
  operatingHours: OperatingHoursType;
  isEditMode: boolean;
  onHoursChange: any;
  onToggleDayClosed: (day: keyof OperatingHoursType) => void;
}

const OperatingHours: React.FC<OperatingHoursProps> = ({
  operatingHours,
  isEditMode,
  onHoursChange,
  onToggleDayClosed
}) => {
  const timeOptions = generateTimeOptions();

  return (
    <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Operating Hours</h2>
            <p className="text-gray-500">Set your clinic's working hours</p>
          </div>
        </div>
        <div className="space-y-4">
          {Object.entries(operatingHours).map(([day, hours]) => (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4 min-w-[140px]">
                <div className="w-20">
                  <span className="text-lg font-semibold text-gray-900 capitalize">
                    {dayNames[day as keyof OperatingHoursType]}
                  </span>
                </div>
                <button
                  onClick={() => onToggleDayClosed(day as keyof OperatingHoursType)}
                  disabled={!isEditMode}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                    hours.closed ? 'bg-gray-300' : 'bg-blue-500'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                      hours.closed ? 'translate-x-1' : 'translate-x-7'
                    }`}
                  />
                </button>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                {hours.closed ? (
                  <span className="text-gray-400 font-medium">Closed</span>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                    <select
                      value={hours.open}
                      onChange={(e) => onHoursChange(day as keyof OperatingHoursType, 'open', e.target.value)}
                      disabled={!isEditMode}
                      className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      {timeOptions.map(time => (
                        <option key={time.value} value={time.value}>{time.label}</option>
                      ))}
                    </select>
                    <span className="text-gray-400 font-medium text-center">—</span>
                    <select
                      value={hours.close}
                      onChange={(e) => onHoursChange(day as keyof OperatingHoursType, 'close', e.target.value)}
                      disabled={!isEditMode}
                      className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      {timeOptions.map(time => (
                        <option key={time.value} value={time.value}>{time.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OperatingHours;