import React from 'react';
import { MapPin, Navigation, FileText, Calendar, Languages, Upload } from 'lucide-react';
import { ClinicData } from '@/types/clinic';

interface LocationSectionProps {
  clinicData: ClinicData;
  isEditMode: boolean;
  onInputChange: (field: keyof ClinicData, value: string) => void;
  onLocationChange: (location: { lat: number; lng: number }) => void;
  onFileUpload?: (field: keyof ClinicData, file: File) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  clinicData,
  isEditMode,
  onInputChange,
  onLocationChange,
  onFileUpload
}) => {
  
  const handleFileChange = (field: keyof ClinicData, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(field, file);
    }
  };

  return (
    <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Location & Details</h2>
            <p className="text-gray-500">Your clinic's address and additional information</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Full Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Full Address *</label>
            <textarea
              value={clinicData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              disabled={!isEditMode}
              rows={3}
              className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none  text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg resize-none"
              placeholder="Enter your complete clinic address"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">City *</label>
              <input
                type="text"
                value={clinicData.city}
                onChange={(e) => onInputChange('city', e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none  text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                placeholder="City"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Pincode *</label>
              <input
                type="number"
                value={clinicData.pincode}
                onChange={(e) => onInputChange('pincode', e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none  text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                placeholder="560001"
              />
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Landmark</label>
              <input
                type="text"
                value={clinicData.landmark}
                onChange={(e) => onInputChange('landmark', e.target.value)}
                disabled={!isEditMode}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none  text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                placeholder="Nearby landmark"
              />
            </div>
          </div>

          {/* Map Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Google Maps Link</label>
            <div className="relative">
              <Navigation className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={clinicData.map_link}
                onChange={(e) => onInputChange('map_link', e.target.value)}
                disabled={!isEditMode}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none  text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>

          {/* Registration Certificate Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Registration Certificate
            </label>
            <div className="space-y-3">
              {clinicData.registration_certificate ? (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      Certificate uploaded
                    </span>
                  </div>
                  {isEditMode && (
                    <button
                      onClick={() => onInputChange('registration_certificate', '')}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 transition-colors">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 mb-3">No certificate uploaded</p>
                  {isEditMode && (
                    <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Certificate
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('registration_certificate', e)}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Languages Spoken */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Languages Spoken</label>
            <div className="relative">
              <Languages className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={clinicData.languages?.join(', ') || ''}
                onChange={(e) => onInputChange('languages', e.target.value)}
                disabled={!isEditMode}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none  text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                placeholder="English, Hindi, etc. (comma separated)"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Enter languages separated by commas
            </p>
          </div>

          {/* Coordinates Input - Only in Edit Mode */}
          {isEditMode && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                Coordinates
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                Enter the latitude and longitude coordinates for your clinic location.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={isNaN(clinicData.location.lat) ? '' : clinicData.location.lat}
                    onChange={(e) => {
                      const lat = parseFloat(e.target.value);
                      if (!isNaN(lat)) {
                        onLocationChange({ ...clinicData.location, lat });
                      }
                    }}
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-blue-900"
                    placeholder="e.g., 12.9715987"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={isNaN(clinicData.location.lng) ? '' : clinicData.location.lng}
                    onChange={(e) => {
                      const lng = parseFloat(e.target.value);
                      if (!isNaN(lng)) {
                        onLocationChange({ ...clinicData.location, lng });
                      }
                    }}
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-blue-900"
                    placeholder="e.g., 77.5945627"
                  />
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-white rounded-xl border border-blue-100">
                <div className="text-sm text-blue-700">
                  <span className="font-semibold">Current Coordinates:</span>{' '}
                  {isNaN(clinicData.location.lat) ? '0.00000' : clinicData.location.lat.toFixed(6)}
                  , {isNaN(clinicData.location.lng) ? '0.00000' : clinicData.location.lng.toFixed(6)}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Format: SRID=4326;POINT ({clinicData.location.lng} {clinicData.location.lat})
                </div>
              </div>
            </div>
          )}

          {/* Display coordinates in view mode */}
          {!isEditMode && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Coordinates</h3>
              <div className="text-gray-700">
                <span className="font-medium">Latitude:</span> {clinicData.location.lat.toFixed(6)}
                <span className="mx-2">•</span>
                <span className="font-medium">Longitude:</span> {clinicData.location.lng.toFixed(6)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;