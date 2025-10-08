import React from 'react';
import { Shield, Phone, Mail, MapPin, Award, Users, Calendar } from 'lucide-react';
import { ClinicData, OperatingHours } from '@/types/clinic';

interface SidebarInfoProps {
  clinicData: ClinicData;
  operatingHours: OperatingHours;
}

const SidebarInfo: React.FC<SidebarInfoProps> = ({ clinicData, operatingHours }) => {
  return (
    <div className="space-y-6">
      {/* Clinic Status Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          Clinic Status
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Verification</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              clinicData.status === 'APPROVED'
                ? 'bg-green-100 text-green-800'
                : clinicData.status === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {clinicData.status || 'Not Set'}
            </span>
          </div>
          {clinicData.gstNo && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">GST Number</span>
              <span className="text-gray-900 font-medium">{clinicData.gstNo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Phone className="w-5 h-5 text-blue-600 mr-2" />
          Contact Info
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{clinicData.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{clinicData.phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 text-sm">{clinicData.city}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Award className="w-5 h-5 text-blue-600 mr-2" />
          Clinic Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-2xl">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          </div>
          <div className="text-center p-4 bg-green-50 rounded-2xl">
            <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Object.values(operatingHours).some(hour => !hour.closed) ? '24/7' : 'Limited'}
            </div>
            <div className="text-xs text-gray-600">Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarInfo;