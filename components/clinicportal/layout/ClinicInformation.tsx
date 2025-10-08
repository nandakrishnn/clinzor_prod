import React from 'react';
import { Building2, Mail, Phone, ChevronDown, Calendar, Hash, Users, Globe, CheckCircle, XCircle } from 'lucide-react';
import { ClinicData } from '@/types/clinic';

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
  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const validateCountryCode = (code: string): boolean => {
    const codeRegex = /^\d{1,3}$/;
    return codeRegex.test(code);
  };

  const validateGST = (gst: string): boolean => {
    if (!gst) return true; // GST is optional
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  };

  // Validation states
  const isEmailValid = validateEmail(clinicData.email);
  const isPhoneValid = validatePhone(clinicData.contact_number);
  const isCountryCodeValid = validateCountryCode(clinicData.country_code);
  const isGSTValid = validateGST(clinicData.gst_no || '');

  const getValidationIcon = (isValid: boolean, value: string) => {
    if (!value) return null;
    return isValid ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getValidationMessage = (field: string, isValid: boolean, value: string) => {
    if (!value) return null;
    
    if (!isValid) {
      const messages: { [key: string]: string } = {
        email: "Please enter a valid email address",
        contact_number: "Please enter a valid 10-digit phone number",
        country_code: "Please enter a valid country code (1-3 digits)",
        gst_no: "Please enter a valid GST number format"
      };
      return messages[field];
    }
    return null;
  };

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
          {/* Clinic Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Clinic Name *</label>
            <input
              type="text"
              value={clinicData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              disabled={!isEditMode}
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl focus:outline-none  text-gray-900 text-lg"
              placeholder="Enter clinic name"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={clinicData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                disabled={!isEditMode}
                className={`w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl focus:outline-none text-gray-900 text-lg ${
                  clinicData.email && !isEmailValid ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="clinic@example.com"
              />
              {clinicData.email && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {getValidationIcon(isEmailValid, clinicData.email)}
                </div>
              )}
            </div>
            {clinicData.email && !isEmailValid && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {getValidationMessage('email', isEmailValid, clinicData.email)}
              </p>
            )}
          </div>

          {/* Contact Number with Country Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Contact Number *</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={clinicData.country_code}
                  onChange={(e) => {
                    // Allow only numbers
                    const value = e.target.value.replace(/\D/g, '');
                    onInputChange('country_code', value);
                  }}
                  disabled={!isEditMode}
                  className={`w-full pl-12 pr-8 py-4 bg-gray-50  rounded-2xl focus:outline-none text-gray-900 text-lg ${
                    clinicData.country_code && !isCountryCodeValid ? 'ring-2 ring-red-500' : ''
                  }`}
                  placeholder="91"
                  maxLength={3}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">+</span>
                
              </div>
              <div className="relative flex-[2]">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={clinicData.contact_number}
                  onChange={(e) => {
                    // Allow only numbers and limit to 10 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    onInputChange('contact_number', value);
                  }}
                  disabled={!isEditMode}
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg ${
                    clinicData.contact_number && !isPhoneValid ? 'ring-2 ring-red-500' : ''
                  }`}
                  placeholder="Contact number"
                  maxLength={10}
                />
                {clinicData.contact_number && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {getValidationIcon(isPhoneValid, clinicData.contact_number)}
                  </div>
                )}
              </div>
            </div>
            {(clinicData.country_code && !isCountryCodeValid) && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {getValidationMessage('country_code', isCountryCodeValid, clinicData.country_code)}
              </p>
            )}
            {(clinicData.contact_number && !isPhoneValid) && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {getValidationMessage('contact_number', isPhoneValid, clinicData.contact_number)}
              </p>
            )}
          </div>

          {/* GST Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">GST Number</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={clinicData.gst_no || ''}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  onInputChange('gst_no', value);
                }}
                disabled={!isEditMode}
                className={`w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl focus:outline-none  text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg ${
                  clinicData.gst_no && !isGSTValid ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="29ABCDE1234F2Z5"
              />
              {clinicData.gst_no && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {getValidationIcon(isGSTValid, clinicData.gst_no)}
                </div>
              )}
            </div>
            {clinicData.gst_no && !isGSTValid && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {getValidationMessage('gst_no', isGSTValid, clinicData.gst_no)}
              </p>
            )}
          </div>

          {/* Founded Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Founded On</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={clinicData.founded_on || ''}
                onChange={(e) => onInputChange('founded_on', e.target.value)}
                disabled={!isEditMode}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
              />
            </div>
          </div>

          {/* Status Display (Read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
            <div className="relative">
              <div className={`w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl text-lg ${
                clinicData.status === 'APPROVED' ? 'text-green-600' :
                clinicData.status === 'PENDING' ? 'text-yellow-600' :
                clinicData.status === 'DRAFT' ? 'text-blue-600' :
                'text-red-600'
              } font-medium capitalize`}>
                {clinicData.status?.toLowerCase() || 'Not Set'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicInformation;