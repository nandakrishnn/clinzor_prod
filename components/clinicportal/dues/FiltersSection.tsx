// FiltersSection.tsx
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Clinic, FiltersState } from './types';

interface FiltersSectionProps {
  filters: FiltersState;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (status: string) => void;
  onDateRangeChange: (fromDate: string, toDate: string) => void;
  onTransactionTypeChange: (type: string) => void;
  onClearFilters: () => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  onSearchChange,
  onStatusFilterChange,
  onDateRangeChange,
  onTransactionTypeChange,
  onClearFilters
}) => {
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fromDate = e.target.value ? `${e.target.value}T00:00:00` : '';
    const toDate = filters.dateRange.toDate || '';
    onDateRangeChange(fromDate, toDate);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const toDate = e.target.value ? `${e.target.value}T23:59:59` : '';
    const fromDate = filters.dateRange.fromDate || '';
    onDateRangeChange(fromDate, toDate);
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.statusFilter ||
    filters.dateRange.fromDate ||
    filters.dateRange.toDate ||
    filters.transactionType !== 'ALL';

  return (
    <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200"
          >
            <X className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Search</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name, service, transaction ID..."
              value={filters.searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">From Date</label>
          <input
            type="date"
            value={filters.dateRange.fromDate ? filters.dateRange.fromDate.split('T')[0] : ''}
            onChange={handleFromDateChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">To Date</label>
          <input
            type="date"
            value={filters.dateRange.toDate ? filters.dateRange.toDate.split('T')[0] : ''}
            onChange={handleToDateChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Hidden Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Transaction Type</label>
          <select
            value={filters.transactionType}
            onChange={(e) => onTransactionTypeChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
          >
            <option value="ALL">All Transactions</option>
            <option value="DUE">Due</option>
            <option value="PAID">Paid</option>
          </select>
        </div> */}

        {/* Status Filter */}
        {/* <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Status</label>
          <select
            value={filters.statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="CREATED">Created</option>
            <option value="FAILED">Failed</option>
          </select>
        </div> */}
      </div>
    </div>
  );
};

export default FiltersSection;