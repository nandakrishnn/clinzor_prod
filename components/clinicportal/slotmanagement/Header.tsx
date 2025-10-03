import React from 'react';
import { Calendar, CalendarDays } from 'lucide-react';

interface HeaderProps {
  setShowBulkForm: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setShowBulkForm }) => {
  return (
    <div className="bg-white  z-40">
      <div className="max-w-7xl mx-auto pt-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Slots</h1>
              <p className="text-xs sm:text-sm text-gray-500">Manage your appointment slots</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-0">
            <button
              onClick={() => setShowBulkForm(true)}
              className="bg-primaryColor hover:bg-primaryColor text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Bulk Create</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;