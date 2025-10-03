import React from 'react';
import { Search } from 'lucide-react';
import { Clinic } from './types';

interface FiltersSectionProps {
  searchTerm: string;
  statusFilter: string;
  clinicFilter: string;
  dateRangeFilter: string;
  clinics: Clinic[];
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (status: string) => void;
  onClinicFilterChange: (clinicId: string) => void;
  onDateRangeChange: (range: string) => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  searchTerm,
  statusFilter,
  clinicFilter,
  dateRangeFilter,
  clinics,
  onSearchChange,
  onStatusFilterChange,
  onDateRangeChange
}) => {
  return (
    <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {/* Search Bar */}
        <div className="xl:col-span-2">
          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Search</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>
        
        {/* Status Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="CREATED">Created</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
        
        {/* Date Range Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Date Range</label>
          <select
            value={dateRangeFilter}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;