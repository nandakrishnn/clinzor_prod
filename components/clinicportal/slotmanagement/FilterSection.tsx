import React from 'react';
import { Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ClinicService, FilterState } from '@/types/common';

interface FilterSectionProps {
  filters: FilterState;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleFilterChange: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
  filteredSlots: any[];
  clinicServices: ClinicService[];
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  searchTerm,
  setSearchTerm,
  handleFilterChange,
  clearFilters,
  filteredSlots,
}) => {
  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-slate-200 rounded-2xl shadow-lg p-3 sm:p-6 mb-6 sm:mb-8 relative overflow-visible">
      <div className="flex flex-col gap-3">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          <div className="flex flex-col justify-center h-full">
            <label htmlFor="slot-search" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Search</label>
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="slot-search"
                type="text"
                placeholder="Search slots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 sm:py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400 text-sm sm:text-base shadow-sm h-12 sm:h-14"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center h-full">
            <label htmlFor="status-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Status</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm shadow-sm h-12 sm:h-14"
            >
              <option value="">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex flex-col justify-center h-full">
            <label className="text-xs font-semibold text-slate-600 mb-1 ml-1" htmlFor="fromDatePicker">From</label>
            <DatePicker
              id="fromDatePicker"
              selected={filters.fromDate}
              onChange={(date: Date | null) => handleFilterChange('fromDate', date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="From"
              className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 w-full text-sm sm:text-base shadow-sm h-12 sm:h-14"
              isClearable
            />
          </div>

          <div className="flex flex-col justify-center h-full">
            <label className="text-xs font-semibold text-slate-600 mb-1 ml-1" htmlFor="toDatePicker">To</label>
            <DatePicker
              id="toDatePicker"
              selected={filters.toDate}
              onChange={(date: Date | null) => handleFilterChange('toDate', date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="To"
              className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 w-full text-sm sm:text-base shadow-sm h-12 sm:h-14"
              isClearable
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mt-3">
          <div className="flex-1 flex items-center sm:justify-start justify-center">
            <button
              onClick={clearFilters}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-100 to-blue-300 text-blue-800 font-semibold border border-blue-300 hover:from-blue-200 hover:to-blue-400 transition-all duration-200 shadow-sm text-sm sm:text-base w-full sm:w-auto"
            >
              Reset Filters
            </button>
          </div>
          <div className="flex-1 flex items-center sm:justify-end justify-center">
            <div className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-0 text-center sm:text-right w-full">
              {filteredSlots.length} slots found{' '}
              {(Object.values(filters).some(f => f) || searchTerm) && (
                <span className="text-blue-600">(Filters applied)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;