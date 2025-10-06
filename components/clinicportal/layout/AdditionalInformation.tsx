import React, { useState } from 'react';
import { Settings, Plus, X } from 'lucide-react';
import { ClinicData } from '@/types/clinic';

interface AdditionalInformationProps {
  clinicData: ClinicData;
  isEditMode: boolean;
  onInputChange: (field: keyof ClinicData, value: string) => void;
  onAddInsurance: (insurance: string) => void;
  onRemoveInsurance: (insurance: string) => void;
  onAddSpecialty: (specialty: string) => void;
  onRemoveSpecialty: (specialty: string) => void;
}

const AdditionalInformation: React.FC<AdditionalInformationProps> = ({
  clinicData,
  isEditMode,
  onInputChange,
  onAddInsurance,
  onRemoveInsurance,
  onAddSpecialty,
  onRemoveSpecialty
}) => {
  const [newInsurance, setNewInsurance] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleAddInsurance = () => {
    if (newInsurance.trim()) {
      onAddInsurance(newInsurance.trim());
      setNewInsurance('');
    }
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim()) {
      onAddSpecialty(newSpecialty.trim());
      setNewSpecialty('');
    }
  };

  return (
    <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
            <p className="text-gray-500">Tell us more about your clinic</p>
          </div>
        </div>
        <div className="space-y-8">
          {/* About Clinic */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 ml-1 block">About Your Clinic</label>
            <textarea
              value={clinicData.about}
              onChange={(e) => onInputChange('about', e.target.value)}
              disabled={!isEditMode}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 resize-none"
              placeholder="Describe your clinic, services, and what makes you unique..."
            />
          </div>

          {/* Insurance Networks */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 ml-1 block">Insurance Networks</label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {clinicData.insuranceNetworks.map((insurance, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {insurance}
                    {isEditMode && (
                      <button
                        onClick={() => onRemoveInsurance(insurance)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditMode && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newInsurance}
                    onChange={(e) => setNewInsurance(e.target.value)}
                    placeholder="Add insurance network..."
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInsurance()}
                  />
                  <button
                    onClick={handleAddInsurance}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Specialties */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 ml-1 block">Specialties</label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {clinicData.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                  >
                    {specialty}
                    {isEditMode && (
                      <button
                        onClick={() => onRemoveSpecialty(specialty)}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditMode && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="Add specialty..."
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty()}
                  />
                  <button
                    onClick={handleAddSpecialty}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdditionalInformation;