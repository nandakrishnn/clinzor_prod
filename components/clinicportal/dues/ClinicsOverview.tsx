import React from 'react';
import { Building } from 'lucide-react';
import { Clinic } from './types';
import { formatCurrency, getStatusConfig } from '@/utils/formatters';
import * as LucideIcons from 'lucide-react';

interface ClinicsOverviewProps {
  clinics: Clinic[];
}

const ClinicsOverview: React.FC<ClinicsOverviewProps> = ({ clinics }) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 sm:p-8 mb-8 sm:mb-12 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Service Overview</h2>
            <p className="text-sm text-slate-600 mt-1">Clinic performance and payment status</p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md">
          View All
        </button>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        {clinics.slice(0, 3).map((clinic, index) => {
          const statusConfig = getStatusConfig(clinic.status);
          // Dynamically get the icon component
          const StatusIcon = LucideIcons[statusConfig.icon as keyof typeof LucideIcons] as React.ComponentType<any>;

          return (
            <div
              key={clinic.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl hover:from-slate-100 hover:to-slate-200 transition-all duration-300 gap-4 sm:gap-0 border border-slate-200/50 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">{clinic.name}</h3>
                  <p className="text-sm text-slate-600 font-medium">{clinic.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center space-x-6 sm:space-x-8 mt-3 sm:mt-0">
                <div className="text-right">
                  <p className="text-sm text-slate-600 font-medium mb-1">Current Dues</p>
                  <p className="font-bold text-red-600 text-base sm:text-lg">{formatCurrency(clinic.current_dues)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 font-medium mb-1">Total Paid</p>
                  <p className="font-bold text-emerald-600 text-base sm:text-lg">{formatCurrency(clinic.total_paid)}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold border shadow-sm ${statusConfig.color}`}>
                  {StatusIcon && <StatusIcon className="w-4 h-4 mr-1" />}
                  {clinic.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClinicsOverview;