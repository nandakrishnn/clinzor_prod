import React from 'react';
import { Building2, Mail, Phone, ChevronDown } from 'lucide-react';
import { ClinicData } from '@/types/clinic';
import { clinicTypes } from '@/utils/clinicUtils';

interface ClinicInformationProps {
  clinicData: ClinicData;
  isEditMode: boolean;
  onInputChange: (field: keyof ClinicData, value: string) => void;
}

const ClinicInformation: React.FC<ClinicInformationProps> = ({
  clinicData,
  isEditMode,
  onInputChange
}) => {
  return (
    <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Clinic Information</h2>
            <p className="text-gray-500">Basic details about your clinic</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Clinic Name</label>
            <input
              type="text"
              value={clinicData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              disabled={!isEditMode}
              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Clinic Type</label>
            <div className="relative">
              <select
                value={clinicData.type}
                onChange={(e) => onInputChange('type', e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 appearance-none text-lg"
              >
                {clinicTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={clinicData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                disabled={!isEditMode}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={clinicData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                disabled={!isEditMode}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicInformation;